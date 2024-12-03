import useEventCartStore from '@/app/store/eventCartStore';
import React from 'react';
import { useTranslations } from 'next-intl';
import { EventCheckoutItem } from './EventCheckoutItem';
import { formatCurrency } from '@/utils/formatCurrency';

interface Props {
    eventId: string;
    subtotal: number;
}

const EventOrderItems = ({ eventId, subtotal }: Props) => {
    const t = useTranslations();

    const { eventCarts } = useEventCartStore();

    return (
        <div className="w-full">
            {eventCarts[eventId].map((productPack) => {
                return (
                    <div key={productPack.id}>
                        <EventCheckoutItem
                            eventId={eventId}
                            productPack={productPack}
                        />
                    </div>
                );
            })}

            {/* Subtotal */}
            <div className="mt-4 flex w-full flex-row items-center justify-between">
                <div className="flex flex-col items-start justify-start space-y-2">
                    <div className="text-2xl text-gray-500">
                        {t('subtotal')}

                        <span className="ml-6 font-semibold text-gray-800">
                            {formatCurrency(subtotal)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventOrderItems;
