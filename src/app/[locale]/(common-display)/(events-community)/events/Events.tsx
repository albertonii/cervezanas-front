'use client';

import React from 'react';
import { IEvent } from '@/lib//types/types';
import EventCard from './EventCard';

interface Props {
    events: IEvent[];
}
export default function Events({ events }: Props) {
    return (
        <>
            <EventList events={events} />
        </>
    );
}

interface EventListProps {
    events: IEvent[];
}

const EventList = ({ events }: EventListProps) => {
    return (
        <div className="flex w-full flex-col items-center justify-between">
            {events?.map((event) => (
                <EventCard key={event.id} event={event} />
            ))}
        </div>
    );
};
