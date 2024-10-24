'use client';

import Spinner from '@/app/[locale]/components/ui/Spinner';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import InputLabel from '@/app/[locale]/components/form/InputLabel';
import React, { useState } from 'react';
import { z, ZodType } from 'zod';
import { useMutation } from 'react-query';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuth } from '../../../(auth)/Context/useAuth';
import { faTicketAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { DisplayInputError } from '@/app/[locale]/components/ui/DisplayInputError';
import { useShoppingCart } from '@/app/context/ShoppingCartContext';

const promoCodeSchema: ZodType<{ code: string }> = z.object({
    code: z.string().nonempty({ message: 'errors.input_required' }),
});

type PromoCodeValidationSchema = z.infer<typeof promoCodeSchema>;

export default function PromoCode() {
    const t = useTranslations();

    const { handleMessage } = useMessage();
    const { user } = useAuth();
    const [isFetching, setIsFetching] = useState(false);
    const { applyDiscount } = useShoppingCart();

    const form = useForm<PromoCodeValidationSchema>({
        resolver: zodResolver(promoCodeSchema),
    });

    const {
        handleSubmit,
        formState: { errors },
        reset,
    } = form;

    const validatePromoCode = async (code: string) => {
        setIsFetching(true);
        try {
            const response = await fetch('/api/shopping_basket/promo_code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, user_id: user.id }),
            });

            const data = await response.json();

            if (response.ok && data.isValid) {
                applyDiscount(data);
                handleMessage({
                    type: 'success',
                    message: t('promo_code_applied'),
                });
                reset();
            } else {
                handleMessage({
                    type: 'error',
                    message: data.message || t('invalid_promo_code'),
                });
            }
        } catch (error) {
            console.error(error);
            handleMessage({
                type: 'error',
                message: t('errors.validating_promo_code'),
            });
        } finally {
            setIsFetching(false);
        }
    };

    const validatePromoMutation = useMutation({
        mutationFn: validatePromoCode,
        onError: (error: any) => {
            console.error(error);
            handleMessage({
                type: 'error',
                message: 'errors.validating_promo_code',
            });
        },
    });

    const onSubmit: SubmitHandler<PromoCodeValidationSchema> = async (data) => {
        try {
            validatePromoMutation.mutate(data.code);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <section className="w-full p-6 bg-white dark:bg-gray-900 rounded-lg shadow space-y-6">
            <div className="relative w-full space-y-6 p-6 rounded-lg shadow-md bg-gray-50 dark:bg-gray-800">
                <FontAwesomeIcon
                    icon={faTicketAlt}
                    title={'Promo Code Icon'}
                    className="text-beer-blonde absolute -top-4 -left-4 bg-white p-2 rounded-full shadow-lg"
                    size="2xl"
                />

                {isFetching && (
                    <Spinner
                        class=" top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                        size="xxLarge"
                        absolute
                    />
                )}

                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                    {t('promo_code')}
                </h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <InputLabel
                        label="code"
                        form={form}
                        registerOptions={{ required: true }}
                        placeholder={t('enter_promo_code')}
                        disabled={isFetching}
                    />

                    {errors.code && (
                        <DisplayInputError message={errors.code.message} />
                    )}

                    <Button
                        title={t('apply_promo_code')}
                        primary
                        large
                        btnType="submit"
                        disabled={isFetching}
                    >
                        {t('apply_promo_code')}
                    </Button>
                </form>
            </div>
        </section>
    );
}
