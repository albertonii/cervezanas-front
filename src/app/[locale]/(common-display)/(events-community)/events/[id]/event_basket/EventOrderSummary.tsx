// components/EventOrderSummary.tsx
import React from 'react';
import { useTranslations } from 'next-intl';
import { formatCurrency } from '@/utils/formatCurrency';
import Title from '@/app/[locale]/components/ui/Title';
import useEventCartStore from '@/app/store/eventCartStore';
import Label from '@/app/[locale]/components/ui/Label';
import Button from '@/app/[locale]/components/ui/buttons/Button';

interface Props {
    eventId: string;
    subtotal: number;
    total: number;
    onSubmit: () => void;
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

            <Button large primary disabled={!hasItems} onClick={onSubmit}>
                {t('proceed_to_pay')}
            </Button>
        </div>
    );
};

export default EventOrderSummary;
