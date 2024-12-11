'use client';

import ProfileSectionHeader from '@/app/[locale]/components/ui/ProfileSectionHeader';
import { useTranslations } from 'next-intl';
import { EventOrderList } from './EventOrderList';
import { IEventOrder } from '@/lib/types/eventOrders';

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
