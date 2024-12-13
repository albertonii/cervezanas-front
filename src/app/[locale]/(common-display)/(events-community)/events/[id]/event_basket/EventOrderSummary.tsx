// components/EventOrderSummary.tsx

import Title from '@/app/[locale]/components/ui/Title';
import Label from '@/app/[locale]/components/ui/Label';
import useEventCartStore from '@/app/store/eventCartStore';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { formatCurrency } from '@/utils/formatCurrency';
import InputLabelNoForm from '@/app/[locale]/components/form/InputLabelNoForm';
import { useAuth } from '@/app/[locale]/(auth)/Context/useAuth';
import { DisplayInputError } from '@/app/[locale]/components/ui/DisplayInputError';

interface Props {
    eventId: string;
    subtotal: number;
    total: number;
    onSubmit: (
        paymentMethod: 'online' | 'on-site',
        guestEmail?: string,
    ) => void;
}

const EventOrderSummary: React.FC<Props> = ({
    eventId,
    subtotal,
    total,
    onSubmit,
}) => {
    const t = useTranslations('event');
    const tError = useTranslations('errors');

    const { eventCarts } = useEventCartStore();
    const { user } = useAuth();

    const hasItems = (eventCarts[eventId] || []).length > 0;

    const [paymentMethod, setPaymentMethod] = useState<'online' | 'on-site'>(
        'online',
    );

    const [isGuest, setIsGuest] = useState(false);
    const [guestEmail, setGuestEmail] = useState('');
    const [guestEmailError, setGuestEmailError] = useState<string | null>(null);
    const [isProceedDisabled, setIsProceedDisabled] = useState(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    useEffect(() => {
        setIsGuest(!user && paymentMethod === 'on-site');
    }, [user, paymentMethod]);

    useEffect(() => {
        if (!hasItems) {
            setIsProceedDisabled(true);
        } else if (isGuest && guestEmail.trim() === '') {
            setIsProceedDisabled(true);
        } else {
            setIsProceedDisabled(false);
        }
    }, [hasItems, isGuest, guestEmail]);

    const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentMethod(e.target.value as 'online' | 'on-site');
    };

    const handleProceed = () => {
        if (isGuest && !emailRegex.test(guestEmail.trim())) {
            // Validación: correo requerido y formato válido para invitados
            setGuestEmailError(tError('guest_email_required'));
            return;
        }

        setGuestEmailError(null);
        onSubmit(paymentMethod, isGuest ? guestEmail : undefined);
    };

    const handleGuestEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGuestEmail(e.target.value);

        if (e.target.value === '') {
            setGuestEmailError(tError('guest_email_required'));
        } else if (!emailRegex.test(e.target.value.trim())) {
            setGuestEmailError(tError('invalid_email_format'));
        } else {
            setGuestEmailError(null);
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-lg space-y-4 px-4 py-6 md:p-6 xl:w-96 xl:p-4 text-center ">
            <Title size="large" color="gray">
                {t('summary')}
            </Title>

            <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <Label>{t('subtotal')}</Label>
                <Label>{formatCurrency(subtotal)}</Label>
            </div>

            {/* Puedes añadir más líneas para descuentos o impuestos si es necesario */}
            <div className="flex justify-between text-lg font-semibold text-gray-800 dark:text-white">
                <Label>{t('total')}</Label>
                <Label>{formatCurrency(total)}</Label>
            </div>

            {/* Campo de Correo Electrónico para Invitados */}
            {isGuest && (
                <div className="mt-4 text-left">
                    <InputLabelNoForm
                        inputType="email"
                        label={'guest_email'}
                        onChange={handleGuestEmailChange}
                        placeholder={t('enter_email')}
                    />

                    {guestEmailError && (
                        <DisplayInputError message={guestEmailError} />
                    )}
                </div>
            )}

            {/* Selección de método de pago */}
            <div className="mt-4 text-left">
                <Label className="block mb-2">{t('payment_method')}</Label>

                <div className="flex items-center mb-2">
                    <input
                        type="radio"
                        id="online"
                        name="paymentMethod"
                        value="online"
                        checked={paymentMethod === 'online'}
                        onChange={handlePaymentChange}
                        className="mr-2 hover:cursor-pointer h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                    />
                    <Label htmlFor="online">{t('pay_online')}</Label>
                </div>

                <div className="flex items-center">
                    <input
                        type="radio"
                        id="on-site"
                        name="paymentMethod"
                        value="on-site"
                        checked={paymentMethod === 'on-site'}
                        onChange={handlePaymentChange}
                        className="mr-2 hover:cursor-pointer h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                    />
                    <Label htmlFor="on-site">{t('pay_on_site')}</Label>
                </div>
            </div>

            <Button
                large
                primary
                disabled={isProceedDisabled}
                onClick={handleProceed}
            >
                {t('proceed_to_pay')}
            </Button>
        </div>
    );
};

export default EventOrderSummary;
