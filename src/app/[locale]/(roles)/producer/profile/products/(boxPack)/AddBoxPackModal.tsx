'use client';

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { z, ZodType } from 'zod';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from 'react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from '../../../../../(auth)/Context/useAuth';
import { useMessage } from '../../../../../components/message/useMessage';
import { ModalAddBoxPackFormData } from '../../../../../../../lib/types/product';
import { BoxPackInfoSection } from '../../../../../components/products/boxPack/BoxPackInfoSection';
import { BoxPackStepper } from '../../../../../components/products/boxPack/BoxPackStepper';
import { BoxSummary } from '../../../../../components/products/boxPack/BoxSummary';
import { BoxMultimediaSection } from '../../../../../components/products/boxPack/BoxMultimediaSection';
import BoxProductSlotsSection from '../../../../../components/products/boxPack/BoxProductSlotsSection';

const ModalWithForm = dynamic(
    () => import('../../../../../components/modals/ModalWithForm'),
    { ssr: false },
);

const schema: ZodType<ModalAddBoxPackFormData> = z.object({
    is_public: z.boolean(),
    name: z.string().nonempty('Name is required'),
    description: z.string().nonempty('Description is required'),
    price: z.number().min(0, 'Price must be greater than 0'),
    weight: z.number().min(0, 'Weight must be greater than 0'),
    slots_per_box: z.number().min(1, 'Slots must be greater than 0'),
    box_packs: z.array(
        z.object({
            quantity: z.number().min(1, 'Quantity must be greater than 0'),
            slots_per_product: z
                .number()
                .min(1, 'Slots per product must be greater than 0'),
            product_id: z.string().nonempty('Product id is required'), // Es el id del producto, no de la caja-box
        }),
    ),
});

type ValidationSchema = z.infer<typeof schema>;

export function AddBoxPackModal() {
    const t = useTranslations();

    const { user, supabase } = useAuth();

    const [showModal, setShowModal] = useState<boolean>(false);
    const [activeStep, setActiveStep] = useState<number>(0);

    const { handleMessage } = useMessage();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const form = useForm<ValidationSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(schema),
        defaultValues: {},
    });

    const {
        handleSubmit,
        reset,
        formState: { errors },
    } = form;
    const queryClient = useQueryClient();

    useEffect(() => {
        if (errors) {
            console.info('Errores detectados creando un pack', errors);
        }
    }, [errors]);

    const handleSetActiveStep = (value: number) => {
        setActiveStep(value);
    };

    const handleInsertBoxPack = async (form: ValidationSchema) => {
        const {
            name,
            description,
            price,
            weight,
            is_public,
            box_packs,
            slots_per_box,
        } = form;

        const { data: product, error: errorProduct } = await supabase
            .from('products')
            .insert({
                name,
                description,
                is_public,
                category: 'box_pack',
                owner_id: user?.id,
                price: price,
                weight: weight,
            })
            .select('id')
            .single();

        if (errorProduct) {
            handleMessage({
                type: 'error',
                message: errorProduct.message,
            });

            return;
        }

        if (product) {
            const { data: boxPack, error: errorBoxPack } = await supabase
                .from('box_packs')
                .insert({
                    product_id: product.id,
                    slots_per_box: slots_per_box,
                })
                .select('id')
                .single();

            if (errorBoxPack) {
                handleMessage({
                    type: 'error',
                    message: errorBoxPack.message,
                });

                return;
            }

            if (boxPack) {
                const boxPackId = boxPack.id;

                const boxPacks = box_packs.map((box) => {
                    return {
                        ...box,
                        box_pack_id: boxPackId,
                        product_id: box.product_id,
                    };
                });

                const { error: errorBoxPackSlots } = await supabase
                    .from('box_pack_items')
                    .insert(boxPacks);

                if (errorBoxPackSlots) {
                    handleMessage({
                        type: 'error',
                        message: errorBoxPackSlots.message,
                    });

                    return;
                }
            }

            setShowModal(false);
            queryClient.invalidateQueries('productList');

            reset();
        }
    };

    const insertProductMutation = useMutation({
        mutationKey: ['insertBoxPack'],
        mutationFn: handleInsertBoxPack,
        onMutate: () => {
            setIsSubmitting(true);
        },
        onSuccess: () => {
            setIsSubmitting(false);
        },
        onError: (error: any) => {
            console.error(error);
            setIsSubmitting(false);
        },
    });

    const onSubmit: SubmitHandler<ValidationSchema> = (
        formValues: ModalAddBoxPackFormData,
    ) => {
        try {
            insertProductMutation.mutate(formValues);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <ModalWithForm
            showBtn={true}
            showModal={showModal}
            setShowModal={setShowModal}
            title={'add_box_pack'}
            btnTitle={'add_box_pack'}
            description={''}
            classIcon={''}
            classContainer={''}
            handler={handleSubmit(onSubmit)}
            handlerClose={() => {
                setActiveStep(0);
                setShowModal(false);
            }}
            form={form}
        >
            <form>
                <BoxPackStepper
                    activeStep={activeStep}
                    handleSetActiveStep={handleSetActiveStep}
                    isSubmitting={isSubmitting}
                >
                    <>
                        <p className="text-slate-500 my-4 sm:text-lg leading-relaxed">
                            {t('modal_product_description')}
                        </p>

                        {activeStep === 0 ? (
                            <BoxPackInfoSection form={form} />
                        ) : activeStep === 1 ? (
                            <BoxProductSlotsSection form={form} />
                        ) : activeStep === 2 ? (
                            <BoxMultimediaSection form={form} />
                        ) : (
                            <BoxSummary form={form} />
                        )}
                    </>
                </BoxPackStepper>
            </form>
        </ModalWithForm>
    );
}
