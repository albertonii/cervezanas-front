// components/EventOrderItems.tsx
import React from 'react';
import { useTranslations } from 'next-intl';
import { formatCurrency } from '@/utils/formatCurrency';
import useEventCartStore from '@/app/store/eventCartStore';
import { EventCheckoutItem } from './EventCheckoutItem';
import Label from '@/app/[locale]/components/ui/Label';

interface Props {
    eventId: string;
    subtotal: number;
}

const EventOrderItems: React.FC<Props> = ({ eventId, subtotal }) => {
    const t = useTranslations();
    const { eventCarts } = useEventCartStore();

    const cartItems = eventCarts[eventId] || [];

    return (
        <div className="space-y-4 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg shadow-md">
            {cartItems.map((productPack) => (
                <EventCheckoutItem
                    key={productPack.id}
                    eventId={eventId}
                    productPack={productPack}
                />
            ))}

            {/* Subtotal */}
            <div className="flex justify-between text-lg font-semibold text-gray-800 dark:text-white">
                <Label>{t('subtotal')}</Label>
                <Label font="bold">{formatCurrency(subtotal)}</Label>
            </div>
        </div>
    );
};

export default EventOrderItems;
