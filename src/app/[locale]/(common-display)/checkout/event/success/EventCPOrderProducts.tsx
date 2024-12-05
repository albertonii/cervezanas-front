import EventCPProductDetails from './EventCPProductDetails';
import React from 'react';
import { IEventOrderCPS } from '@/lib/types/eventOrders';

interface Props {
    eventOrderCP: IEventOrderCPS;
    domain: string;
}

export default function EventCPOrderProducts({ eventOrderCP, domain }: Props) {
    return (
        <section className="relative border-separate space-y-8 rounded-lg border border-gray-200 dark:border-gray-700 p-2">
            <div className="space-y-8">
                {eventOrderCP.event_order_items?.map((product) => (
                    <EventCPProductDetails
                        key={product.id}
                        eventOrderCP={eventOrderCP}
                        eventOrderItem={product}
                        domain={domain}
                    />
                ))}
            </div>
        </section>
    );
}
