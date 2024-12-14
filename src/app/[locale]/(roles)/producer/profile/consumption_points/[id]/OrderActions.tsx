import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { EVENT_ORDER_CPS_STATUS, VIEW_STEPS } from '@/constants';
import { EventOrderConfirmationDialog } from '@/app/[locale]/components/CP/EventOrderConfirmationDialog';

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
    const t = useTranslations('event');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const getNextStatus = (currentStatus: string): string => {
        switch (currentStatus) {
            case 'pending': {
                if (viewConfiguration === VIEW_STEPS.one_step) {
                    return EVENT_ORDER_CPS_STATUS.COMPLETED;
                }
                return EVENT_ORDER_CPS_STATUS.PREPARING;
            }
            case 'preparing': {
                if (viewConfiguration === VIEW_STEPS.two_steps) {
                    return EVENT_ORDER_CPS_STATUS.COMPLETED;
                }
                return EVENT_ORDER_CPS_STATUS.READY;
            }
            case 'ready':
                return EVENT_ORDER_CPS_STATUS.COMPLETED;

            case 'pending_payment':
                return EVENT_ORDER_CPS_STATUS.PENDING;

            default:
                return currentStatus;
        }
    };

    const getButtonLabel = (currentStatus: string): string => {
        switch (currentStatus) {
            case 'cancelled':
                return t('cancelled_order_action');
            case 'pending_payment':
                return t('start_order_action');
            case 'pending':
                return viewConfiguration === 'one_step'
                    ? t('complete_order_action')
                    : t('prepare_order_action');
            case 'preparing':
                return viewConfiguration === 'two_steps'
                    ? t('complete_order_action')
                    : t('ready_order_action');
            case 'ready':
                return t('complete_order_action');
            default:
                return t('next_status_action'); // Texto genérico para estados no manejados
        }
    };

    const nextStatus = getNextStatus(status);
    const buttonLabel = getButtonLabel(status);

    return (
        <>
            <button
                onClick={() => handleUpdateStatus(orderId, nextStatus)}
                className="mb-2 bg-gray-700 text-white px-2 py-1 md:px-4 md:py-2 rounded-lg text-sm md:text-md font-semibold hover:bg-gray-800 transition-colors border-2 border-beer-blonde dark:border-gray-700"
            >
                {buttonLabel}
            </button>

            {status === 'pending_payment' && (
                <>
                    <button
                        onClick={() => setIsDialogOpen(true)}
                        className="bg-red-700 text-white px-2 py-1 md:px-4 md:py-2 rounded-lg text-sm md:text-md font-semibold hover:bg-red-800 transition-colors"
                    >
                        {t('cancelled_order_action')}
                    </button>

                    <EventOrderConfirmationDialog
                        isOpen={isDialogOpen}
                        onClose={() => setIsDialogOpen(false)}
                        onConfirm={() =>
                            handleUpdateStatus(
                                orderId,
                                EVENT_ORDER_CPS_STATUS.CANCELLED,
                            )
                        }
                        title={t('confirm_cancel_order')}
                        message={t('confirm_cancel_order_message')}
                    />
                </>
            )}
        </>
    );
};

export default OrderActions;
