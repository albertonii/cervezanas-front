'use client';

import Title from '@/app/[locale]/components/ui/Title';
import Label from '@/app/[locale]/components/ui/Label';
import Spinner from '@/app/[locale]/components/ui/Spinner';
import useFetchEventOrdersByCPId from '@/hooks/useFetchEventOrdersByCPId';
import React, { useEffect, useState } from 'react';
import { Beer, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { EVENT_ORDER_CPS_STATUS } from '@/constants';
import { IEventOrderCPS } from '@/lib/types/eventOrders';
import { IConsumptionPointEvent } from '@/lib/types/consumptionPoints';
import { QueueColumn } from '@/app/[locale]/components/CP/QueueColumn';
import QueueColumnOnlyView from '@/app/[locale]/components/CP/QueueColumnOnlyView';

interface Props {
    cpId: string;
}

export function DisplayEventOrders({ cpId }: Props) {
    const t = useTranslations('event');
    const { data, isError, isLoading, isFetchedAfterMount } =
        useFetchEventOrdersByCPId(cpId);

    const [orders, setOrders] = useState<IEventOrderCPS[]>([]);
    const [pendingOrders, setPendingOrders] = useState<IEventOrderCPS[]>([]);
    const [preparingOrders, setPreparingOrders] = useState<IEventOrderCPS[]>(
        [],
    );
    const [readyOrders, setReadyOrders] = useState<IEventOrderCPS[]>([]);

    const [cpInfo, setCpInfo] = useState<IConsumptionPointEvent>();

    useEffect(() => {
        if (isFetchedAfterMount && data) {
            setCpInfo(data[0]?.cp_events);
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
        if (orders.length > 0) {
            setPendingOrders(
                orders.filter((order) => order.status === 'pending'),
            );
            setPreparingOrders(
                orders.filter((order) => order.status === 'preparing'),
            );
            setReadyOrders(orders.filter((order) => order.status === 'ready'));
        }
    }, [orders]);

    // Últimos 3 pedidos completados (entregados)
    const lastThreeDelivered = orders
        .filter((order) => order.status === 'completed')
        .slice(-3);

    return (
        <div
            className="h-screen w-screen overflow-hidden flex flex-col bg-[url('/path-to-your-beer-background.jpg')] bg-cover bg-center"
            style={{ backgroundColor: '#1b1b1b' }}
        >
            <div className="flex items-between w-full justify-around">
                {/* Encabezado principal */}
                <div className="flex flex-col p-4 text-beer-blonde items-center justify-center">
                    <div className="flex items-center gap-3">
                        <Beer className="w-8 h-8 text-beer-blonde" />
                        <Title size="xlarge" font="bold">
                            {t('order_queue')}
                        </Title>
                        <Beer className="w-8 h-8 text-beer-blonde" />
                    </div>

                    {/* Información del punto de consumo */}
                    {cpInfo && (
                        <div className="p-4  text-beer-blonde flex flex-col items-center justify-center gap-2 shadow-md">
                            <Label size="xlarge" font="bold" color="beer-gold">
                                {cpInfo.cp?.cp_name}
                            </Label>
                            <div className="flex items-center gap-2 text-beer-blonde">
                                <MapPin className="w-5 h-5" />
                                <Label size="medium" color="gray" font="italic">
                                    {cpInfo.cp?.address}
                                </Label>
                            </div>
                            <Label size="medium" color="gray" font="italic">
                                {cpInfo.cp?.cp_description}
                            </Label>
                        </div>
                    )}
                </div>

                {/* Columna extra de últimos pedidos entregados */}
                <div className="p-4 text-beer-blonde flex items-center justify-center gap-4">
                    <Label size="large" font="semibold">
                        {t('last_delivered')}:
                    </Label>
                    {lastThreeDelivered.length === 0 ? (
                        <Label color="beer-blonde" size="large">
                            {t('none')}
                        </Label>
                    ) : (
                        <div className="flex gap-4">
                            {lastThreeDelivered.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-gray-800 text-white px-3 py-2 rounded-lg font-bold"
                                >
                                    #{order.order_number}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {isError && (
                <div className="bg-red-700 text-white p-4 text-center">
                    <Label size="large" font="bold">
                        {t('error_loading_orders')}
                    </Label>
                </div>
            )}

            {!isFetchedAfterMount || isLoading ? (
                <div className="flex-grow flex items-center justify-center">
                    <Spinner color="blonde" size="large" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 h-full overflow-auto ">
                    {/* Pedidos Nuevos */}
                    <QueueColumnOnlyView
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
                    />

                    {/* En Preparación */}
                    <QueueColumnOnlyView
                        title={t('preparing_orders', {
                            numberOfOrders: preparingOrders.length,
                        })}
                        icon={<>🍻</>}
                        orders={
                            data?.filter(
                                (order) =>
                                    order.status ===
                                    EVENT_ORDER_CPS_STATUS.PREPARING,
                            ) as IEventOrderCPS[]
                        }
                        bgColor={`bg-beer-foam dark:bg-beer-draft`}
                        textColor={'yellow'}
                    />

                    {/* Listos para Entregar */}
                    <QueueColumnOnlyView
                        title={t('ready_orders', {
                            numberOfOrders: readyOrders.length,
                        })}
                        icon={<>✅</>}
                        orders={
                            data?.filter(
                                (order) =>
                                    order.status ===
                                    EVENT_ORDER_CPS_STATUS.READY,
                            ) as IEventOrderCPS[]
                        }
                        bgColor={`bg-green-50 dark:bg-green-800`}
                        textColor={'green'}
                    />
                </div>
            )}
        </div>
    );
}
