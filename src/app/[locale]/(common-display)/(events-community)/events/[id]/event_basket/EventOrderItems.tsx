// components/EventOrderItems.tsx
import React from 'react';
import { useTranslations } from 'next-intl';
import { formatCurrency } from '@/utils/formatCurrency';
import useEventCartStore from '@/app/store/eventCartStore';
import { EventCheckoutItem } from './EventCheckoutItem';

interface Props {
    eventId: string;
    subtotal: number;
}

const EventOrderItems: React.FC<Props> = ({ eventId, subtotal }) => {
    const t = useTranslations();
    const { eventCarts } = useEventCartStore();

    const cartItems = eventCarts[eventId] || [];

    return (
        <div className="space-y-4 bg-gray-700 p-2 rounded-lg">
            {cartItems.map((productPack) => (
                <EventCheckoutItem
                    key={productPack.id}
                    eventId={eventId}
                    productPack={productPack}
                />
            ))}

            {/* Subtotal */}
            <div className="flex justify-between text-lg font-semibold text-gray-800 dark:text-white">
                <span>{t('subtotal')}</span>
                <span>{formatCurrency(subtotal)}</span>
            </div>
        </div>
    );
};

export default EventOrderItems;
