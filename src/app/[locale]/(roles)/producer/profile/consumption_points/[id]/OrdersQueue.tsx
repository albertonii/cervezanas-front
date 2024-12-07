'use client';

import React, { useEffect, useState } from 'react';
import Label from '@/app/[locale]/components/ui/Label';
import Spinner from '@/app/[locale]/components/ui/Spinner';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import EventOrderCard from '../../../../../components/cards/EventOrderCard';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/app/[locale]/(auth)/Context/useAuth';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { useTranslations } from 'next-intl';
import useFetchEventOrdersByCPId from '@/hooks/useFetchEventOrdersByCPId';
import { IConsumptionPointEvent } from '@/lib/types/consumptionPoints';
import { IEventOrder, IEventOrderCPS } from '@/lib/types/eventOrders';
import { EventOrderCPSStatus } from '@/constants';

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
                    {/* Pending Orders */}
                    <div className="space-y-4">
                        <div className="bg-yellow-50 p-4 rounded-lg dark:bg-yellow-700">
                            <Label size="medium" color="yellow" font="bold">
                                {t('new_orders', {
                                    numberOfOrders: pendingOrders.length,
                                })}
                            </Label>
                            <div className="space-y-4">
                                {pendingOrders.map((order) => (
                                    <EventOrderCard
                                        key={order.id}
                                        order={order}
                                        actionButton={
                                            <Button
                                                title={'start'}
                                                primary
                                                medium
                                                onClick={() =>
                                                    handleUpdateStatus(
                                                        order.id,
                                                        'preparing',
                                                    )
                                                }
                                            >
                                                {t('start')}
                                            </Button>
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Preparing Orders */}
                    <div className="space-y-4 bg-beer-foam p-4 rounded-lg dark:bg-beer-draft">
                        <Label size="medium" color="beer-blonde" font="bold">
                            {t('preparing_orders', {
                                numberOfOrders: preparingOrders.length,
                            })}
                        </Label>
                        <div className="space-y-4">
                            {preparingOrders.map((order) => (
                                <EventOrderCard
                                    key={order.id}
                                    order={order}
                                    actionButton={
                                        <button
                                            onClick={() =>
                                                handleUpdateStatus(
                                                    order.id,
                                                    'ready',
                                                )
                                            }
                                            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600 transition-colors"
                                        >
                                            <CheckCircle2 className="w-4 h-4 mr-2" />
                                            {t('ready')}
                                        </button>
                                    }
                                />
                            ))}
                        </div>
                    </div>

                    {/* Ready Orders */}
                    <div className="space-y-4 bg-green-50 p-4 rounded-lg bg-green-800">
                        <Label size="medium" color="green" font="bold">
                            {t('ready_orders', {
                                numberOfOrders: readyOrders.length,
                            })}
                        </Label>
                        <div className="space-y-4">
                            {readyOrders.map((order) => (
                                <EventOrderCard
                                    key={order.id}
                                    order={order}
                                    actionButton={
                                        <button
                                            onClick={() =>
                                                handleUpdateStatus(
                                                    order.id,
                                                    'completed',
                                                )
                                            }
                                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                        >
                                            {t('delivered')}
                                        </button>
                                    }
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
