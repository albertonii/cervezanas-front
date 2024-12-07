'use client';

import Label from '@/app/[locale]/components/ui/Label';
import Spinner from '@/app/[locale]/components/ui/Spinner';
import useFetchEventOrdersByCPId from '@/hooks/useFetchEventOrdersByCPId';
import EventOrderCard from '../../../../../components/cards/EventOrderCard';
import React, { useEffect, useState } from 'react';
import { CheckCircle2, Beer, MapPin } from 'lucide-react';
import { IEventOrderCPS } from '@/lib/types/eventOrders';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { IConsumptionPointEvent } from '@/lib/types/consumptionPoints';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    cpId: string;
}

// Variantes de animación (opcional) para personalizar aún más
const cardVariants = {
    initial: { opacity: 0, y: -20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 20, scale: 0.95 },
};

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
            {/* Información del punto de consumo */}
            {cpInfo && (
                <div className="p-4 bg-black bg-opacity-80 text-beer-blonde flex flex-col items-start justify-center gap-2 shadow-md">
                    <h2 className="text-2xl font-bold uppercase tracking-wide flex items-center gap-2">
                        <Beer className="w-6 h-6 text-beer-blonde" />
                        {cpInfo.cp?.cp_name}
                    </h2>
                    <div className="flex items-center gap-2 text-beer-blonde">
                        <MapPin className="w-5 h-5" />
                        <span className="text-lg">{cpInfo.cp?.address}</span>
                    </div>
                    <span className="text-md italic text-beer-blonde">
                        {cpInfo.cp?.cp_description}
                    </span>
                </div>
            )}

            {/* Encabezado principal */}
            <div className="p-4 bg-black bg-opacity-70 text-beer-blonde flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <Beer className="w-8 h-8 text-beer-blonde" />
                    <h1 className="text-3xl font-bold uppercase tracking-wider">
                        Cola de Pedidos - Cervezanas
                    </h1>
                    <Beer className="w-8 h-8 text-beer-blonde" />
                </div>
            </div>

            {/* Columna extra de últimos pedidos entregados */}
            <div className="p-4 bg-black bg-opacity-90 text-beer-blonde flex items-center justify-center gap-4">
                <h3 className="text-xl font-semibold uppercase tracking-wide">
                    Últimos Entregados:
                </h3>
                {lastThreeDelivered.length === 0 ? (
                    <span className="text-beer-blonde italic text-lg">
                        Ninguno
                    </span>
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

            {isError && (
                <div className="bg-red-700 text-white p-4 text-center">
                    <h2 className="text-xl font-bold">
                        Error al cargar los pedidos
                    </h2>
                </div>
            )}

            {isLoading ? (
                <div className="flex-grow flex items-center justify-center">
                    <Spinner color="blonde" size="large" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 h-full overflow-auto bg-black bg-opacity-40">
                    {/* Pedidos Nuevos */}
                    <div className="flex flex-col bg-[#f9e79f] bg-opacity-90 rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-yellow-800 flex items-center gap-2 mb-4">
                            <span role="img" aria-label="cerveza">
                                🍺
                            </span>{' '}
                            Pedidos Nuevos ({pendingOrders.length})
                        </h2>
                        <div className="flex flex-col gap-4 overflow-auto">
                            <AnimatePresence>
                                {pendingOrders.map((order) => (
                                    <motion.div
                                        key={order.id}
                                        variants={cardVariants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        transition={{ duration: 0.3 }}
                                    >
                                        <EventOrderCard
                                            order={order}
                                            actionButton={undefined}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* En Preparación */}
                    <div className="flex flex-col bg-[#f4d03f] bg-opacity-90 rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-yellow-900 flex items-center gap-2 mb-4">
                            🍻 En Preparación ({preparingOrders.length})
                        </h2>
                        <div className="flex flex-col gap-4 overflow-auto">
                            <AnimatePresence>
                                {preparingOrders.map((order) => (
                                    <motion.div
                                        key={order.id}
                                        variants={cardVariants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        transition={{ duration: 0.3 }}
                                    >
                                        <EventOrderCard
                                            order={order}
                                            actionButton={undefined}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Listos para Entregar */}
                    <div className="flex flex-col bg-[#82e0aa] bg-opacity-90 rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-green-900 flex items-center gap-2 mb-4">
                            ✅ Listos para Entregar ({readyOrders.length})
                        </h2>
                        <div className="flex flex-col gap-4 overflow-auto">
                            <AnimatePresence>
                                {readyOrders.map((order) => (
                                    <motion.div
                                        key={order.id}
                                        variants={cardVariants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        transition={{ duration: 0.3 }}
                                    >
                                        <EventOrderCard
                                            order={order}
                                            actionButton={undefined}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
