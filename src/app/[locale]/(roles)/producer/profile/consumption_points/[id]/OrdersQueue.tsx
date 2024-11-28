'use client';

import OrderCard from './OrderCard';
import React, { useState } from 'react';
import { Play, CheckCircle2 } from 'lucide-react';
import { IEventOrder } from '@/lib/types/eventOrders';
import { useMessage } from '@/app/[locale]/components/message/useMessage';

// Example data - In a real app, this would come from your backend
const mockOrders: IEventOrder[] = [
    {
        id: '1',
        order_number: 'A001',
        items: [
            { id: '1', name: 'Cerveza Artesanal IPA', quantity: 2, price: 5.5 },
            { id: '2', name: 'Nachos con Queso', quantity: 1, price: 7.0 },
        ],
        status: 'pending',
        timestamp: new Date().toISOString(),
        vendor_id: 'v1',
        vendor_name: 'Cervezas Artesanales del Mundo',
        user_id: 'u1',
        username: 'Juan Pérez',
        user_phone: '666-555-444',
        total: 18.0,
        pickup_kocation: 'Stand 3 - Zona Craft Beer',
        estimated_time: 10,
        is_activated: false,
        notes: 'Se acercará una mujer con un sombrero rojo a buscar el pedido',
    },
    {
        id: '2',
        order_number: 'A002',
        items: [{ id: '3', name: 'Cerveza Rubia', quantity: 3, price: 5.0 }],
        // status: 'not_started',
        status: 'ready',
        timestamp: new Date().toISOString(),
        vendor_id: 'v2',
        vendor_name: 'Cervezas Nacionales',
        user_id: 'u1',
        username: 'Juan Pérez',
        user_phone: '666-555-444',
        total: 15.0,
        pickup_kocation: 'Stand 1 - Zona Principal',
        estimated_time: 5,
        is_activated: false,
    },
];

interface OrderQueueProps {
    orders_: IEventOrder[];
    // onUpdateStatus: (orderId: string, status: IEventOrder['status']) => void;
}

export function OrdersQueue({
    orders_ = mockOrders,
}: // onUpdateStatus,
OrderQueueProps) {
    const { handleMessage } = useMessage();
    const [orders, setOrders] = useState(mockOrders);

    const pendingOrders = orders.filter((order) => order.status === 'pending');
    const preparingOrders = orders.filter(
        (order) => order.status === 'preparing',
    );
    const readyOrders = orders.filter((order) => order.status === 'ready');

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
                            message: `¡Pedido #${order.order_number} listo para ${order.username}!`,
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
            {/* Pending Orders */}
            <div className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                    <h2 className="text-lg font-bold mb-4 text-yellow-800">
                        Pedidos Nuevos ({pendingOrders.length})
                    </h2>
                    {pendingOrders.map((order) => (
                        <OrderCard
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

            {/* Preparing Orders */}
            <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h2 className="text-lg font-bold mb-4 text-blue-800">
                        En Preparación ({preparingOrders.length})
                    </h2>
                    {preparingOrders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            actionButton={
                                <button
                                    onClick={() =>
                                        handleUpdateStatus(order.id, 'ready')
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

            {/* Ready Orders */}
            <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                    <h2 className="text-lg font-bold mb-4 text-green-800">
                        Listos para Entregar ({readyOrders.length})
                    </h2>
                    {readyOrders.map((order) => (
                        <OrderCard
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
    );
}
