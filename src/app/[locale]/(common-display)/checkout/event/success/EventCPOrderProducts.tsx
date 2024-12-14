import EventCPOrderCard from './EventCPOrderCard';
import Title from '@/app/[locale]/components/ui/Title';
import Label from '@/app/[locale]/components/ui/Label';
import React from 'react';
import { Store } from 'lucide-react';
import { IEventOrderCPS } from '@/lib/types/eventOrders';

interface Props {
    eventOrderCP: IEventOrderCPS;
    domain?: string;
}

export default function EventCPOrderProducts({ eventOrderCP, domain }: Props) {
    return (
        <section className="relative border-separate space-y-8 rounded-lg border border-gray-200 dark:border-gray-700 p-2">
            <div className="flex items-center mb-4">
                <Store className="w-6 h-6 text-beer-draft dark:text-white mr-2" />
                <div>
                    <Title
                        size="medium"
                        font="bold"
                        color="gray"
                        fontFamily="NexaRust-sans"
                    >
                        {eventOrderCP?.cp_events?.cp_name}
                    </Title>
                    <Label
                        size="medium"
                        color="gray"
                        className="dark:text-gray-300"
                    >
                        {eventOrderCP.cp_events?.cp?.address}
                    </Label>
                </div>
            </div>

            <div className="space-y-8">
                <EventCPOrderCard orderCP={eventOrderCP} />
            </div>
        </section>
    );
}
