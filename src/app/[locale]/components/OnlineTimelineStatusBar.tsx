import React from 'react';
import { ONLINE_ORDER_STATUS } from '@/constants';

interface OrderTimelineProps {
    status: string;
}
export default function OnlineTimelineStatusBar({
    status,
}: OrderTimelineProps) {
    return (
        <section className="mt-6" aria-hidden="true">
            <div className="flex w-full flex-row overflow-hidden rounded-full bg-gray-200">
                <div
                    className={`h-2 rounded-l-full ${
                        status === ONLINE_ORDER_STATUS.ORDER_PLACED &&
                        'w-[10%] bg-beer-blonde'
                    }`}
                ></div>

                <div
                    className={`h-2  ${
                        status === ONLINE_ORDER_STATUS.PROCESSING &&
                        'w-[30%] bg-beer-blonde '
                    }`}
                ></div>

                <div
                    className={`h-2   ${
                        status === ONLINE_ORDER_STATUS.SHIPPED &&
                        'w-[63%] bg-beer-blonde'
                    }`}
                ></div>

                <div
                    className={`h-2 rounded-r-full ${
                        status === ONLINE_ORDER_STATUS.DELIVERED &&
                        'w-[100%] bg-beer-blonde'
                    }`}
                ></div>
            </div>
        </section>
    );
}
