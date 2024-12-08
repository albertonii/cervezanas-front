import React from 'react';
import { EVENT_ORDER_CPS_STATUS } from '@/constants';
import { QueueColumn } from '@/app/[locale]/components/CP/QueueColumn';
import { IEventOrderCPS } from '@/lib/types/eventOrders';
import { useTranslations } from 'next-intl';

interface Props {
    pendingOrders: IEventOrderCPS[];
    preparingOrders: IEventOrderCPS[];
    readyOrders: IEventOrderCPS[];
    generateActionButton: (orderId: string, status: string) => React.ReactNode;
}

const ThreeStepColumnQueue = ({
    pendingOrders,
    preparingOrders,
    readyOrders,
    generateActionButton,
}: Props) => {
    const t = useTranslations('event');

    return (
        <>
            <QueueColumn
                title={t('new_orders', {
                    numberOfOrders: pendingOrders.length,
                })}
                icon={<>🍺</>}
                orders={pendingOrders}
                bgColor={`bg-yellow-50 dark:bg-yellow-700`}
                textColor={'yellow'}
                actionButtonGenerator={generateActionButton}
                actionButtonStatus={EVENT_ORDER_CPS_STATUS.PENDING}
            />

            <QueueColumn
                title={t('preparing_orders', {
                    numberOfOrders: pendingOrders.length,
                })}
                icon={<>👨‍🍳</>}
                orders={preparingOrders}
                bgColor={`bg-beer-foam dark:bg-beer-draft`}
                textColor={'yellow'}
                actionButtonGenerator={generateActionButton}
                actionButtonStatus={EVENT_ORDER_CPS_STATUS.PREPARING}
            />

            <QueueColumn
                title={t('ready_orders', {
                    numberOfOrders: pendingOrders.length,
                })}
                icon={<>✅</>}
                orders={readyOrders}
                bgColor={`bg-green-50 dark:bg-green-800`}
                textColor={'green'}
                actionButtonGenerator={generateActionButton}
                actionButtonStatus={EVENT_ORDER_CPS_STATUS.READY}
            />
        </>
    );
};

export default ThreeStepColumnQueue;
