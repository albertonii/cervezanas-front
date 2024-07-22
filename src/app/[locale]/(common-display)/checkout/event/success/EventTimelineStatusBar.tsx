import React from 'react';
import { EVENT_ORDER_STATUS } from '@/constants';

interface OrderTimelineProps {
    status: string;
}
export default function EventTimelineStatusBar({ status }: OrderTimelineProps) {
    return (
        <section className="mt-6" aria-hidden="true">
            <div className="flex w-full flex-row overflow-hidden rounded-full bg-gray-200">
                <div
                    className={`h-2 rounded-l-full ${
                        status === EVENT_ORDER_STATUS.ORDER_PLACED &&
                        'w-[10%] bg-beer-blonde'
                    }`}
                ></div>

                <div
                    className={`h-2  ${
                        status === EVENT_ORDER_STATUS.PAID &&
                        'w-[30%] bg-beer-blonde '
                    }`}
                ></div>

                <div
                    className={`h-2   ${
                        status ===
                            EVENT_ORDER_STATUS.WITH_SERVICES_TO_CONSUME &&
                        'w-[63%] bg-beer-blonde'
                    }`}
                ></div>

                <div
                    className={`h-2 rounded-r-full ${
                        status === EVENT_ORDER_STATUS.SERVED &&
                        'w-[100%] bg-beer-blonde'
                    }`}
                ></div>
            </div>
        </section>
    );
}
