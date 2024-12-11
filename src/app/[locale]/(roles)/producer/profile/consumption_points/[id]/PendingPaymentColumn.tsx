import React from 'react';
import { useTranslations } from 'next-intl';
import { IEventOrderCPS } from '@/lib/types/eventOrders';
import { QueueColumn } from '@/app/[locale]/components/CP/QueueColumn';

interface Props {
    pendingPaymentOrders: IEventOrderCPS[];
    generateActionButton: (orderId: string, status: string) => React.ReactNode;
}

export const PendingPaymentColumn: React.FC<Props> = ({
    pendingPaymentOrders,
    generateActionButton,
}) => {
    const t = useTranslations('event');

    return (
        <QueueColumn
            title={t('pending_payment', {
                numberOfOrders: pendingPaymentOrders.length,
            })}
            icon={<>💰</>}
            orders={pendingPaymentOrders}
            bgColor={`bg-gray-50 dark:bg-gray-700`}
            textColor={'white'}
            actionButtonGenerator={generateActionButton}
            actionButtonStatus={'pending_payment'}
        />
    );
};
