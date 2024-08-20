import React from 'react';
import { DISTRIBUTOR_ONLINE_ORDER_STATUS } from '@/constants';

interface OrderTimelineProps {
    status: string;
}
export default function DistributorOnlineTimelineStatusBar({
    status,
}: OrderTimelineProps) {
    return (
        <section
            className={`${
                status === DISTRIBUTOR_ONLINE_ORDER_STATUS.DELIVERED &&
                'animate-neon_beer'
            } mt-6 flex w-full flex-row overflow-hidden rounded-full bg-gray-200`}
        >
            {(status === DISTRIBUTOR_ONLINE_ORDER_STATUS.ERROR ||
                status === DISTRIBUTOR_ONLINE_ORDER_STATUS.CANCELLED) && (
                <div className={`h-2 w-[100%] rounded-l-full bg-red-700`}></div>
            )}

            <div
                className={`h-2 rounded-l-full ${
                    status === DISTRIBUTOR_ONLINE_ORDER_STATUS.PENDING &&
                    'w-[10%] bg-beer-blonde'
                }`}
            ></div>

            <div
                className={`h-2  ${
                    status === DISTRIBUTOR_ONLINE_ORDER_STATUS.PROCESSING &&
                    'w-[40%] bg-beer-blonde '
                }`}
            ></div>

            <div
                className={`h-2 rounded-r-full ${
                    status === DISTRIBUTOR_ONLINE_ORDER_STATUS.SHIPPED &&
                    'w-[65%] bg-beer-blonde'
                }`}
            ></div>

            <div
                className={`h-2 rounded-r-full ${
                    status === DISTRIBUTOR_ONLINE_ORDER_STATUS.DELIVERED &&
                    'w-[100%] bg-beer-gold'
                }`}
            ></div>
        </section>
    );
}
