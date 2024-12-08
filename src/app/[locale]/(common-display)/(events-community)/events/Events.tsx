'use client';

import React from 'react';
import EventCard from './EventCard';
import Title from '@/app/[locale]/components/ui/Title';
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

interface EventListProps {
    events: IEvent[];
}

const EventList = ({ events }: EventListProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.length > 0 ? (
                events.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))
            ) : (
                <div className="col-span-full text-center text-gray-500 dark:text-gray-400">
                    No hay eventos disponibles en este momento.
                </div>
            )}
        </div>
    );
};
