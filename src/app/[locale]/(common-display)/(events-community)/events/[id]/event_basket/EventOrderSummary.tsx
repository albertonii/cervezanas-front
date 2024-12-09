import Title from '@/app/[locale]/components/ui/Title';
import Label from '@/app/[locale]/components/ui/Label';
import useEventCartStore from '@/app/store/eventCartStore';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { formatCurrency } from '@/utils/formatCurrency';

interface Props {
    eventId: string;
    subtotal: number;
    total: number;
    onSubmit: (paymentMethod: 'online' | 'on-site') => void;
}

const EventOrderSummary: React.FC<Props> = ({
    eventId,
    subtotal,
    total,
    onSubmit,
}) => {
    const t = useTranslations();
    const { eventCarts } = useEventCartStore();

    const hasItems = (eventCarts[eventId] || []).length > 0;

    const [paymentMethod, setPaymentMethod] = useState<'online' | 'on-site'>(
        'online',
    );

    const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentMethod(e.target.value as 'online' | 'on-site');
    };

    const handleProceed = () => {
        onSubmit(paymentMethod);
    };

    return (
        <div className=" bg-gray-50 dark:bg-gray-900 rounded-lg shadow space-y-4 px-4 py-6 md:p-6 xl:w-96 xl:p-4 text-center">
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
                        className="mr-2"
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
                        className="mr-2"
                    />
                    <Label htmlFor="on-site">{t('pay_on_site')}</Label>
                </div>
            </div>

            <Button large primary disabled={!hasItems} onClick={handleProceed}>
                {t('proceed_to_pay')}
            </Button>
        </div>
    );
};

export default EventOrderSummary;
