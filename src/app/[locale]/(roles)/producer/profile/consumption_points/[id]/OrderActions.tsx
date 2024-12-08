import { EVENT_ORDER_CPS_STATUS } from '@/constants';
import React from 'react';

interface Props {
    orderId: string;
    status: string;
    handleUpdateStatus: (orderId: string, newStatus: string) => Promise<void>;
    viewConfiguration: 'one_step' | 'two_steps' | 'three_steps';
}

export const OrderActions: React.FC<Props> = ({
    orderId,
    status,
    handleUpdateStatus,
    viewConfiguration,
}) => {
    const getNextStatus = (currentStatus: string): string => {
        switch (currentStatus) {
            case 'pending': {
                if (viewConfiguration === 'one_step') {
                    return EVENT_ORDER_CPS_STATUS.COMPLETED;
                }
                return EVENT_ORDER_CPS_STATUS.PREPARING;
            }
            case 'preparing': {
                if (viewConfiguration === 'two_steps') {
                    return EVENT_ORDER_CPS_STATUS.COMPLETED;
                }
                return EVENT_ORDER_CPS_STATUS.READY;
            }
            case 'ready':
                return EVENT_ORDER_CPS_STATUS.COMPLETED;
            default:
                return currentStatus;
        }
    };

    const nextStatus = getNextStatus(status);

    return (
        <button
            onClick={() => handleUpdateStatus(orderId, nextStatus)}
            className="bg-gray-700 text-white px-2 py-1 md:px-6 md:py-3 rounded-lg text-sm md:text-lg font-semibold hover:bg-gray-800 transition-colors"
        >
            {nextStatus}
        </button>
    );
};
