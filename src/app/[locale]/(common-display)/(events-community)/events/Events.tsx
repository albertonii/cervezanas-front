'use client';

import EventList from './EventList';
import Title from '@/app/[locale]/components/ui/Title';
import React from 'react';
import { useTranslations } from 'next-intl';
import { IEvent } from '@/lib/types/eventOrders';

interface Props {
    events: IEvent[];
}

export default function Events({ events }: Props) {
    const t = useTranslations('event');

    return (
        <section className="py-8 px-4 bg-gray-100/50 dark:bg-gray-900/50 min-h-screen w-full">
            <div className="w-full flex text-center justify-center my-8">
                <Title size="xlarge" font="semibold" color="beer-blonde">
                    {t('events_in_cervezanas')}
                </Title>
            </div>

            <EventList events={events} />
        </section>
    );
}
