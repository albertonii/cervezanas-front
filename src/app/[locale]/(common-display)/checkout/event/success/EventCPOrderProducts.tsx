import EventCPProductDetails from './EventCPProductDetails';
import React from 'react';
import { IEventOrderCPS } from '@/lib/types/eventOrders';

interface Props {
    eventOrderCP: IEventOrderCPS;
    domain: string;
}

export default function EventCPOrderProducts({ eventOrderCP, domain }: Props) {
    return (
        <section className="relative border-separate space-y-8 rounded-lg border p-2">
            <div className="space-y-8">
                {eventOrderCP.event_order_items?.map((product) => (
                    <EventCPProductDetails
                        eventOrderCP={eventOrderCP}
                        eventOrderItem={product}
                        domain={domain}
                    />
                ))}
            </div>
        </section>
    );
}
