'use client';

import { useTranslations } from 'next-intl';
import { IEventOrder } from '../../../../../../lib/types';
import { EventOrderList } from './EventOrderList';

interface Props {
    eventOrders: IEventOrder[];
}

export function EventOrders({ eventOrders }: Props) {
    const t = useTranslations();
    return (
        <div className="px-4 py-6" aria-label="Event Orders">
            <p className="flex justify-between py-4" id="header">
                <span
                    id="title"
                    className="text-5xl font-semibold text-beer-blonde"
                >
                    {t('event_orders')}
                </span>
            </p>

            {eventOrders && eventOrders.length > 0 && (
                <EventOrderList eventOrders={eventOrders} />
            )}
        </div>
    );
}
