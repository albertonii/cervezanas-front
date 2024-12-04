'use client';

import Label from '@/app/[locale]/components/ui/Label';
import Spinner from '@/app/[locale]/components/ui/Spinner';
import useFetchEventOrdersByCPId from '@/hooks/useFetchEventOrdersByCPId';
import EventOrderCard from '../../../profile/consumption_points/[id]/EventOrderCard';
import React, { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { IEventOrderCPS } from '@/lib/types/eventOrders';
import { useMessage } from '@/app/[locale]/components/message/useMessage';

interface Props {
    cpId: string;
}

export function DisplayEventOrders({ cpId }: Props) {
    const { handleMessage } = useMessage();

    const { data, isError, isLoading, isFetchedAfterMount } =
        useFetchEventOrdersByCPId(cpId);

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

    useEffect(() => {
        if (orders) {
            setPendingOrders(
                orders.filter((order) => order.status === 'pending'),
            );
            setPreparingOrders(
                orders.filter((order) => order.status === 'preparing'),
            );
            setReadyOrders(orders.filter((order) => order.status === 'ready'));
        }
    }, [orders]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 ">
            {isError && (
                <div className="bg-red-50 p-4 rounded-lg">
                    <Label size="medium" color="red" font="bold">
                        Error al cargar los pedidos
                    </Label>
                </div>
            )}

            {isLoading ? (
                <Spinner color="blonde" size="large" />
            ) : (
                <>
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
                                        actionButton={undefined}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Preparing Orders */}
                    <div className="space-y-4 bg-beer-foam p-4 rounded-lg">
                        <Label size="medium" color="beer-blonde" font="bold">
                            En Preparación ({preparingOrders.length})
                        </Label>

                        <div className="space-y-4">
                            {preparingOrders.map((order) => (
                                <EventOrderCard
                                    key={order.id}
                                    order={order}
                                    actionButton={
                                        <button className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600 transition-colors">
                                            <CheckCircle2 className="w-4 h-4 mr-2" />
                                            Listo
                                        </button>
                                    }
                                />
                            ))}
                        </div>
                    </div>

                    {/* Ready Orders */}
                    <div className="space-y-4 bg-green-50 p-4 rounded-lg">
                        <Label size="medium" color="green" font="bold">
                            Listos para Entregar ({readyOrders.length})
                        </Label>

                        <div className="space-y-4">
                            {readyOrders.map((order) => (
                                <EventOrderCard
                                    key={order.id}
                                    order={order}
                                    actionButton={
                                        <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
                                            Entregado
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
