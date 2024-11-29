'use client';

import EventOrderCard from './EventOrderCard';
import Label from '@/app/[locale]/components/ui/Label';
import useFetchEventOrdersByCPId from '@/hooks/useFetchEventOrdersByCPId';
import React, { useEffect, useState } from 'react';
import { Play, CheckCircle2 } from 'lucide-react';
import { IEventOrder, IEventOrderCPS } from '@/lib/types/eventOrders';
import { IConsumptionPointEvent } from '@/lib/types/consumptionPoints';
import { useMessage } from '@/app/[locale]/components/message/useMessage';

interface Props {
    cp: IConsumptionPointEvent;
}

export function OrdersQueue({ cp }: Props) {
    const { handleMessage } = useMessage();

    const { data, isError, isLoading, isFetchedAfterMount } =
        useFetchEventOrdersByCPId(cp.id);

    const [orders, setOrders] = useState<IEventOrderCPS[]>([]);
    const [pendingOrders, setPendingOrders] = useState<IEventOrderCPS[]>([]);
    const [preparingOrders, setPreparingOrders] = useState<IEventOrderCPS[]>(
        [],
    );
    const [readyOrders, setReadyOrders] = useState<IEventOrderCPS[]>([]);

    useEffect(() => {
        if (isFetchedAfterMount && data) {
            setOrders(data as IEventOrderCPS[]);
            setPendingOrders(
                data.filter((order) => order.status === 'pending'),
            );
            setPreparingOrders(
                data.filter((order) => order.status === 'preparing'),
            );
            setReadyOrders(data.filter((order) => order.status === 'ready'));
        }
    }, [isFetchedAfterMount, data]);

    const handleUpdateStatus = (
        orderId: string,
        newStatus: IEventOrder['status'],
    ) => {
        setOrders(
            orders.map((order) => {
                if (order.id === orderId) {
                    const updatedOrder = { ...order, status: newStatus };
                    if (newStatus === 'ready') {
                        // // Enviar notificación push cuando el pedido esté listo
                        // notificationService.sendNotification(
                        //     `¡Tu pedido está listo!`,
                        //     {
                        //         body: `Tu pedido #${order.orderNumber} está listo para recoger en ${order.pickupLocation}`,
                        //         vibrate: [200, 100, 200],
                        //         tag: `order-${order.id}`,
                        //         renotify: true,
                        //     },
                        // );

                        handleMessage({
                            message: `¡Pedido #${order.order_number} listo para ${order.event_orders?.username}!`,
                            type: 'success',
                        });
                    }
                    return updatedOrder;
                }
                return order;
            }),
        );
    };

    const handleActivateOrder = (orderId: string) => {
        setOrders(
            orders.map((order) => {
                if (order.id === orderId) {
                    handleMessage({
                        message: `Pedido #${order.order_number} activado correctamente`,
                        type: 'success',
                    });

                    return { ...order, status: 'pending', isActivated: true };
                }
                return order;
            }),
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 ">
            {/* Pending Orders */}
            <div className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                    <Label size="medium" color="yellow" font="bold">
                        Pedidos Nuevos ({pendingOrders.length})
                    </Label>

                    <div className="space-y-4">
                        {pendingOrders.map((order) => (
                            <EventOrderCard
                                key={order.id}
                                order={order}
                                actionButton={
                                    <button
                                        onClick={() =>
                                            handleUpdateStatus(
                                                order.id,
                                                'preparing',
                                            )
                                        }
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition-colors"
                                    >
                                        <Play className="w-4 h-4 mr-2" />
                                        Empezar
                                    </button>
                                }
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Preparing Orders */}
            <div className="space-y-4">
                <div className="bg-beer-foam p-4 rounded-lg">
                    <Label size="medium" color="beer-blonde" font="bold">
                        En Preparación ({preparingOrders.length})
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
                                        Listo
                                    </button>
                                }
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Ready Orders */}
            <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                    <Label size="medium" color="green" font="bold">
                        Listos para Entregar ({readyOrders.length})
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
                                        Entregado
                                    </button>
                                }
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
