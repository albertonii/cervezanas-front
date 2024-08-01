'use client';

import { useTranslations } from 'next-intl';
import { IEventOrder } from '@/lib//types/types';
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
                    className="font-['NexaRust-script'] text-5xl md:text-7xl text-white -rotate-2"
                >
                    {t('event_orders')}
                </span>
            </p>

            <EventOrderList eventOrders={eventOrders} />
        </div>
    );
}
