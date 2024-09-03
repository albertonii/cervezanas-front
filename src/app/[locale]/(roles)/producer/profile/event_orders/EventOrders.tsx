'use client';

import { useTranslations } from 'next-intl';
import { IEventOrder } from '@/lib//types/types';
import { EventOrderList } from './EventOrderList';
import ProfileSectionHeader from '@/app/[locale]/components/basic/ProfileSectionHeader';

interface Props {
    eventOrders: IEventOrder[];
}

export function EventOrders({ eventOrders }: Props) {
    const t = useTranslations();
    return (
        <div className="px-4 py-6" aria-label="Event Orders">
            <ProfileSectionHeader headerTitle="event_orders" />

            <EventOrderList eventOrders={eventOrders} />
        </div>
    );
}
