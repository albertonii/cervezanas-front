// OrdersQueueColumnManager.tsx

'use client';

import React from 'react';
import OneStepColumnQueue from './OneStepColumnQueue';
import TwoStepColumnQueue from './TwoStepColumnQueue';
import ThreeStepColumnQueue from './ThreeStepColumnQueue';
import { IEventOrderCPS } from '@/lib/types/eventOrders';
import { PendingPaymentColumn } from './PendingPaymentColumn';

interface Props {
    isPendingPayment: boolean;
    viewConfig: 'one_step' | 'two_steps' | 'three_steps';
    pendingPaymentOrders: IEventOrderCPS[];
    pendingOrders: IEventOrderCPS[];
    preparingOrders: IEventOrderCPS[];
    readyOrders: IEventOrderCPS[];
    generateActionButton: (orderId: string, status: string) => React.ReactNode;
}

export const OrdersQueueColumnManager: React.FC<Props> = ({
    isPendingPayment,
    viewConfig,
    pendingPaymentOrders,
    pendingOrders,
    preparingOrders,
    readyOrders,
    generateActionButton,
}) => {
    // Determinar el número base de columnas según viewConfig
    let baseCols = 1;
    switch (viewConfig) {
        case 'one_step':
            baseCols = 1;
            break;
        case 'two_steps':
            baseCols = 2;
            break;
        case 'three_steps':
            baseCols = 3;
            break;
        default:
            baseCols = 1;
    }

    // Incrementar el número de columnas si hay pedidos pendientes de pago
    const totalCols = isPendingPayment ? baseCols + 1 : baseCols;

    // Asegurarse de que Tailwind reconozca las clases generadas
    const gridColsClass = `grid-cols-${totalCols}`;

    return (
        <div className={`grid ${gridColsClass} gap-4`}>
            {/* Columna de Pedidos Pendientes de Pago */}
            {isPendingPayment && (
                <PendingPaymentColumn
                    pendingPaymentOrders={pendingPaymentOrders}
                    generateActionButton={generateActionButton}
                />
            )}

            {/* Renderizar columnas según viewConfig */}
            {viewConfig === 'one_step' && (
                <OneStepColumnQueue
                    pendingOrders={pendingOrders}
                    generateActionButton={generateActionButton}
                />
            )}

            {viewConfig === 'two_steps' && (
                <TwoStepColumnQueue
                    pendingOrders={pendingOrders}
                    preparingOrders={preparingOrders}
                    generateActionButton={generateActionButton}
                />
            )}

            {viewConfig === 'three_steps' && (
                <ThreeStepColumnQueue
                    pendingOrders={pendingOrders}
                    preparingOrders={preparingOrders}
                    readyOrders={readyOrders}
                    generateActionButton={generateActionButton}
                />
            )}
        </div>
    );
};
