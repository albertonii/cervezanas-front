import React from 'react';
import { EVENT_ORDER_CPS_STATUS } from '@/constants';
import { QueueColumn } from '@/app/[locale]/components/CP/QueueColumn';
import { IEventOrderCPS } from '@/lib/types/eventOrders';
import { useTranslations } from 'next-intl';

interface Props {
    pendingOrders: IEventOrderCPS[];
    generateActionButton: (orderId: string, status: string) => React.ReactNode;
}

const OneStepColumnQueue = ({ pendingOrders, generateActionButton }: Props) => {
    const t = useTranslations('event');

    return (
        <QueueColumn
            title={t('new_orders', { numberOfOrders: pendingOrders.length })}
            icon={<>🍺</>}
            orders={pendingOrders}
            bgColor={`bg-yellow-50 dark:bg-yellow-700`}
            textColor={'yellow'}
            actionButtonGenerator={generateActionButton}
            actionButtonStatus={EVENT_ORDER_CPS_STATUS.PENDING}
        />
    );
};

export default OneStepColumnQueue;
