'use client';

import React, { ComponentProps, useState } from 'react';
import { Rate } from './Rate';
import { z, ZodType } from 'zod';
import Button from '../common/Button';
import { useTranslations } from 'next-intl';
import { useAuth } from '../../(auth)/Context/useAuth';
import { IOrderItem, IReview } from '../../../../lib/types/types';
import { useMessage } from '../message/useMessage';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { SuccessfulReviewModal } from '../modals/SuccessfulReview';
import InputTextarea from '../common/InputTextarea';

type FormValues = {
    aroma: number;
    appearance: number;
    taste: number;
    mouthfeel: number;
    bitterness: number;
    overall: number;
    comment: string;
};

const schema: ZodType<FormValues> = z.object({
    aroma: z.number().min(1, { message: 'Required' }).max(5),
    appearance: z.number().min(1, { message: 'Required' }).max(5),
    taste: z.number().min(1, { message: 'Required' }).max(5),
    mouthfeel: z.number().min(1, { message: 'Required' }).max(5),
    bitterness: z.number().min(1, { message: 'Required' }).max(5),
    overall: z.number().min(1, { message: 'Required' }).max(5),
    comment: z.string().min(1, { message: 'Required' }).max(500, {
        message: 'The comment is too long, max length are 500 characters',
    }),
});

type ValidationSchema = z.infer<typeof schema>;

interface Props {
    orderItem: IOrderItem;
    handleSetReviews?: React.Dispatch<React.SetStateAction<IReview[]>>;
    handleShowReviewOnClick: ComponentProps<any>;
    handleSetIsReviewed: ComponentProps<any>;
}

export function NewProductReview({
    orderItem,
    handleSetReviews,
    handleShowReviewOnClick,
    handleSetIsReviewed,
}: Props) {
    const t = useTranslations();
    const successMessage = t('successful_product_review_creation');
    const { supabase } = useAuth();
    const queryClient = useQueryClient();

    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [reviewModal, setReviewModal] = useState(false);

    const [aromaRate, setAromaRate] = useState<number>(1);
    const [appearanceRate, setAppearanceRate] = useState<number>(1);
    const [tasteRate, setTasteRate] = useState<number>(1);
    const [mouthfeelRate, setMouthfeelRate] = useState<number>(1);
    const [bitternessRate, setBitternessRate] = useState<number>(1);
    const [overallRate, setOverallRate] = useState<number>(1);

    const { handleMessage } = useMessage();

    const form = useForm<FormValues>({
        mode: 'onSubmit',
        resolver: zodResolver(schema),
        defaultValues: {
            aroma: aromaRate,
            appearance: appearanceRate,
            taste: tasteRate,
            mouthfeel: mouthfeelRate,
            bitterness: bitternessRate,
            overall: overallRate,
        },
    });

    const { handleSubmit, reset } = form;

    const handleInsertReview = async (form: ValidationSchema) => {
        const { comment } = form;

        const productId = orderItem.product_packs?.products?.id;
        const pPackId = orderItem.product_pack_id;
        const bOrderId = orderItem.business_order_id;

        if (!productId || !pPackId || !bOrderId)
            throw new Error('Missing data');

        const { data, error: reviewError } = await supabase
            .from('reviews')
            .insert({
                aroma: aromaRate,
                appearance: appearanceRate,
                taste: tasteRate,
                mouthfeel: mouthfeelRate,
                bitterness: bitternessRate,
                overall: overallRate,
                comment,
                owner_id: user.id,
                product_id: productId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .select('*')
            .single();

        if (reviewError) {
            console.error(reviewError);
            throw reviewError;
        }

        // Update order item is_reviewed status
        const { error: updateOrderItemError } = await supabase
            .from('order_items')
            .update({ is_reviewed: true })
            .eq('product_pack_id', pPackId)
            .eq('business_order_id', bOrderId);

        if (updateOrderItemError) {
            console.error(updateOrderItemError);
            throw updateOrderItemError;
        }

        if (!data) throw new Error('No data');

        const review = data as IReview;

        handleSetIsReviewed(true);

        handleShowReviewOnClick(false);
        reset();

        if (handleSetReviews)
            handleSetReviews((prev) => [
                ...prev,
                {
                    id: review.id,
                    aroma: aromaRate,
                    appearance: appearanceRate,
                    taste: tasteRate,
                    mouthfeel: mouthfeelRate,
                    bitterness: bitternessRate,
                    overall: overallRate,
                    comment,
                    owner_id: user.id,
                    product_id: productId,
                    created_at: review.created_at,
                    updated_at: review.updated_at,
                },
            ]);

        handleMessage({
            type: 'success',
            message: successMessage,
        });

        queryClient.invalidateQueries('reviewList');
    };

    const handleInsertReviewMutation = useMutation({
        mutationKey: ['insertReview'],
        mutationFn: handleInsertReview,
        onMutate: () => {
            setLoading(true);
            setReviewModal(true);
        },
        onError: (error: Error) => {
            handleMessage({
                type: 'error',
                message: error.message,
            });
        },
        onSettled: () => {
            setLoading(false);
        },
    });

    const onSubmit: SubmitHandler<ValidationSchema> = async (
        formValues: FormValues,
    ) => {
        try {
            handleInsertReviewMutation.mutate(formValues);
        } catch (error) {
            console.error('error', error);
        } finally {
            setLoading(false);
        }
    };

    const starColor = { filled: '#fdc300', unfilled: '#a87a12' };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 space-y-2 md:grid-cols-2 lg:grid-cols-3">
                    {/* Stars  */}
                    <div className="w-full text-xl ">
                        <label htmlFor="aroma">{t('aroma')}</label>

                        <Rate
                            rating={aromaRate}
                            onRating={(rate) => setAromaRate(rate)}
                            count={5}
                            color={starColor}
                            editable={true}
                        />
                    </div>

                    <div className="w-full text-xl">
                        <label htmlFor="appearance">{t('appearance')}</label>
                        <Rate
                            rating={appearanceRate}
                            onRating={(rate) => setAppearanceRate(rate)}
                            count={5}
                            color={starColor}
                            editable={true}
                        />
                    </div>

                    <div className="w-full text-xl">
                        <label htmlFor="taste">{t('taste')}</label>
                        <Rate
                            rating={tasteRate}
                            onRating={(rate) => setTasteRate(rate)}
                            count={5}
                            color={starColor}
                            editable={true}
                        />
                    </div>

                    <div className="w-full text-xl">
                        <label htmlFor="mouthfeel">{t('mouthfeel')}</label>
                        <Rate
                            rating={mouthfeelRate}
                            onRating={(rate) => setMouthfeelRate(rate)}
                            count={5}
                            color={starColor}
                            editable={true}
                        />
                    </div>

                    <div className="w-full text-xl">
                        <label htmlFor="bitterness">{t('bitterness')}</label>
                        <Rate
                            rating={bitternessRate}
                            onRating={(rate) => setBitternessRate(rate)}
                            count={5}
                            color={starColor}
                            editable={true}
                        />
                    </div>

                    <div className="w-full text-xl">
                        <label htmlFor="overall">{t('overall')}</label>
                        <Rate
                            rating={overallRate}
                            onRating={(rate) => setOverallRate(rate)}
                            count={5}
                            color={starColor}
                            editable={true}
                        />
                    </div>
                </div>

                {/* Comment  */}
                <InputTextarea
                    form={form}
                    label={'comment'}
                    registerOptions={{
                        required: true,
                    }}
                />

                {/* Rate  */}
                <div className="flex w-full flex-row space-x-2">
                    <Button
                        btnType="submit"
                        disabled={loading}
                        isActive={false}
                        class={''}
                        title={''}
                        medium
                        primary
                    >
                        {loading ? t('loading') : t('rate')}
                    </Button>

                    <Button
                        class={'ml-2'}
                        onClick={() => handleShowReviewOnClick(false)}
                        disabled={loading}
                        isActive={false}
                        title={''}
                        medium
                    >
                        {t('cancel')}
                    </Button>
                </div>
            </form>

            {reviewModal && (
                <SuccessfulReviewModal isVisible={true}></SuccessfulReviewModal>
            )}
        </>
    );
}
