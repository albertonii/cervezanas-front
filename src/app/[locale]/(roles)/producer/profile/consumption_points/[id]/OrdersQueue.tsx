'use client';

import React, { useEffect, useState } from 'react';
import Label from '@/app/[locale]/components/ui/Label';
import Spinner from '@/app/[locale]/components/ui/Spinner';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import useFetchEventOrdersByCPId from '@/hooks/useFetchEventOrdersByCPId';
import EventOrderCard from '../../../../../components/cards/EventOrderCard';
import { CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { EventOrderCPSStatus, EVENT_ORDER_CPS_STATUS } from '@/constants';
import { useAuth } from '@/app/[locale]/(auth)/Context/useAuth';
import { IEventOrder, IEventOrderCPS } from '@/lib/types/eventOrders';
import { IConsumptionPointEvent } from '@/lib/types/consumptionPoints';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { QueueColumn } from '@/app/[locale]/components/CP/QueueColumn';

interface Props {
    cp: IConsumptionPointEvent;
}

export function OrdersQueue({ cp }: Props) {
    const t = useTranslations('event');
    const { handleMessage } = useMessage();

    const { supabase } = useAuth();

    // Hook personalizado con soporte para actualizaciones en tiempo real
    const { data, isError, isLoading } = useFetchEventOrdersByCPId(cp.id);

    // Estados para pedidos por categoría
    const [orders, setOrders] = useState<IEventOrderCPS[]>([]);
    const [pendingOrders, setPendingOrders] = useState<IEventOrderCPS[]>([]);
    const [preparingOrders, setPreparingOrders] = useState<IEventOrderCPS[]>(
        [],
    );
    const [readyOrders, setReadyOrders] = useState<IEventOrderCPS[]>([]);

    // Actualizar categorías de pedidos cuando cambien los datos
    useEffect(() => {
        if (data) {
            setOrders(data as IEventOrderCPS[]);
        }
    }, [data]);

    useEffect(() => {
        setPendingOrders(orders.filter((order) => order.status === 'pending'));
        setPreparingOrders(
            orders.filter((order) => order.status === 'preparing'),
        );
        setReadyOrders(orders.filter((order) => order.status === 'ready'));
    }, [orders]);

    const handleUpdateStatus = async (
        orderId: string,
        newStatus: IEventOrder['status'],
    ) => {
        try {
            // Actualizar el estado localmente
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId
                        ? { ...order, status: newStatus as EventOrderCPSStatus }
                        : order,
                ),
            );

            // Actualizar en Supabase
            const { error } = await supabase
                .from('event_order_cps')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) {
                handleMessage({
                    message: 'Error al actualizar el pedido',
                    type: 'error',
                });
            } else if (newStatus === 'ready') {
                handleMessage({
                    message: `¡Pedido actualizado a listo!`,
                    type: 'success',
                });
            }
        } catch (err) {
            handleMessage({
                message: 'Error al actualizar el pedido',
                type: 'error',
            });
        }
    };

    const generateActionButton = (
        orderId: string,
        status: IEventOrder['status'],
    ) => {
        let nextStatus: IEventOrder['status'];

        switch (status) {
            case 'pending':
                nextStatus = 'preparing';
                break;
            case 'preparing':
                nextStatus = 'ready';
                break;
            case 'ready':
                nextStatus = 'completed';
                break;
            default:
                nextStatus = status;
        }

        return (
            <button
                onClick={async () => {
                    try {
                        await handleUpdateStatus(orderId, nextStatus);
                    } catch (error) {
                        handleMessage({
                            message: 'Error al actualizar el pedido',
                            type: 'error',
                        });
                    }
                }}
                className="bg-gray-700 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors"
            >
                {t(nextStatus)}
            </button>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 ">
            {isError && (
                <div className="bg-red-50 p-4 rounded-lg">
                    <Label size="medium" color="red" font="bold">
                        {t('error_loading_orders')}
                    </Label>
                </div>
            )}

            {isLoading ? (
                <Spinner color="blonde" size="large" />
            ) : (
                <>
                    {/* Pedidos Nuevos */}
                    <QueueColumn
                        title={t('new_orders', {
                            numberOfOrders: pendingOrders.length,
                        })}
                        icon={<>🍺</>}
                        orders={
                            data?.filter(
                                (order) =>
                                    order.status ===
                                    EVENT_ORDER_CPS_STATUS.PENDING,
                            ) as IEventOrderCPS[]
                        }
                        bgColor={`bg-yellow-50 dark:bg-yellow-700`}
                        textColor={'yellow'}
                        actionButtonGenerator={generateActionButton} // Pasamos la función generadora de botones
                        actionButtonStatus={EVENT_ORDER_CPS_STATUS.PENDING}
                    />

                    {/* Preparing Orders */}
                    <QueueColumn
                        title={t('preparing_orders', {
                            numberOfOrders: preparingOrders.length,
                        })}
                        icon={<>🍺</>}
                        orders={
                            data?.filter(
                                (order) =>
                                    order.status ===
                                    EVENT_ORDER_CPS_STATUS.PREPARING,
                            ) as IEventOrderCPS[]
                        }
                        bgColor={`bg-beer-foam dark:bg-beer-draft`}
                        textColor={'yellow'}
                        actionButtonGenerator={generateActionButton} // Pasamos la función generadora de botones
                        actionButtonStatus={EVENT_ORDER_CPS_STATUS.PREPARING}
                    />

                    {/* Ready Orders */}
                    <QueueColumn
                        title={t('ready_orders', {
                            numberOfOrders: readyOrders.length,
                        })}
                        icon={<>🍺</>}
                        orders={
                            data?.filter(
                                (order) =>
                                    order.status ===
                                    EVENT_ORDER_CPS_STATUS.READY,
                            ) as IEventOrderCPS[]
                        }
                        bgColor={`bg-green-50 dark:bg-green-800`}
                        textColor={'green'}
                        actionButtonGenerator={generateActionButton} // Pasamos la función generadora de botones
                        actionButtonStatus={EVENT_ORDER_CPS_STATUS.READY} // Status relevante para el botón
                    />
                </>
            )}
        </div>
    );
}
