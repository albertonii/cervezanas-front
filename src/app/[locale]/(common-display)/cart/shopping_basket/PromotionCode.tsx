'use client';

import InputLabel from '../../../components/common/InputLabel';
import Button from '../../../components/common/Button';
import React from 'react';
import { useTranslations } from 'next-intl';
import { useMutation } from 'react-query';
import { useMessage } from '../../../components/message/useMessage';
import { validatePromoCode } from '../actions'; // Asegúrate de crear esta función en tu backend
import { faTicketAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DisplayInputError } from '../../../components/common/DisplayInputError';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const promoCodeSchema: ZodType<{ code: string }> = z.object({
    code: z.string().nonempty({ message: 'errors.input_required' }),
});

type PromoCodeValidationSchema = z.infer<typeof promoCodeSchema>;

interface Props {
    applyDiscount: (discount: number) => void;
}

export default function PromoCode() {
    const t = useTranslations();
    const { handleMessage } = useMessage();
    // const queryClient = useQueryClient();

    const form = useForm<PromoCodeValidationSchema>({
        resolver: zodResolver(promoCodeSchema),
    });

    const {
        handleSubmit,
        formState: { errors },
    } = form;

    const validatePromo = async (code: string) => {
        // Aquí puedes hacer la llamada a tu backend para validar el código promocional
        const response = await validatePromoCode(code); // Reemplaza con tu función real
        return response;
    };

    const validatePromoMutation = useMutation({
        mutationFn: validatePromo,
        onSuccess: (data) => {
            console.log(data);
            // if (data.isValid) {
            //     applyDiscount(data.discount);
            //     handleMessage({
            //         type: 'success',
            //         message: t('promo_code_applied', {
            //             discount: data.discount,
            //         }),
            //     });
            // } else {
            //     handleMessage({
            //         type: 'error',
            //         message: t('invalid_promo_code'),
            //     });
            // }
        },
        onError: (error: any) => {
            console.error(error);
            handleMessage({
                type: 'error',
                message: t('errors.validating_promo_code'),
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
        <section className="relative w-full space-y-6 p-6 rounded-lg shadow-md bg-gray-50 dark:bg-gray-800">
            <FontAwesomeIcon
                icon={faTicketAlt}
                title={'Promo Code Icon'}
                className="text-beer-blonde absolute -top-4 -left-4 bg-white p-2 rounded-full shadow-lg"
                size="2xl"
            />

            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                {t('promo_code')}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <InputLabel
                    label="code"
                    form={form}
                    registerOptions={{ required: true }}
                    placeholder={t('enter_promo_code')}
                />

                {errors.code && (
                    <DisplayInputError message={errors.code.message} />
                )}

                <Button
                    title={t('apply_promo_code')}
                    primary
                    large
                    btnType="submit"
                >
                    {t('apply_promo_code')}
                </Button>
            </form>
        </section>
    );
}
