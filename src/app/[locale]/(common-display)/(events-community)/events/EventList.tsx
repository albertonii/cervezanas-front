import { IEvent } from '@/lib/types/eventOrders';
import EventCard from './EventCard';

interface EventListProps {
    events: IEvent[];
}

export default function EventList({ events }: EventListProps) {
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
}
