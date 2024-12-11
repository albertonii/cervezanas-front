'use client';

import React from 'react';
import EventOrderCard from '../cards/EventOrderCard';
import Label, { LabelColor } from '../ui/Label';
import { AnimatePresence, motion } from 'framer-motion';
import { IEventOrderCPS } from '@/lib/types/eventOrders';

// Tipos de Props para QueueColumn
interface QueueColumnProps {
    title: string;
    icon: React.ReactNode;
    orders: IEventOrderCPS[];
    bgColor: string;
    textColor: LabelColor;
    actionButtonGenerator?: (
        orderId: string,
        status: string,
    ) => React.ReactNode;
    actionButtonStatus?: string;
}

// Variantes de animación para las tarjetas
const cardVariants = {
    initial: { opacity: 0, y: 10, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.98 },
};

export function QueueColumn({
    title,
    icon,
    orders,
    bgColor,
    textColor,
    actionButtonGenerator,
    actionButtonStatus,
}: QueueColumnProps) {
    return (
        <div
            className={`flex flex-col ${bgColor} rounded-lg p-2 lg:p-4 shadow-sm hover:shadow-md transition-shadow duration-200`}
        >
            {/* Header de la columna */}
            <div className="flex items-center mb-4">
                <span className="mr-2">{icon}</span>
                <Label
                    size="large"
                    font="bold"
                    color={textColor}
                    className="text-lg"
                >
                    {title}
                </Label>
            </div>

            {/* Lista de órdenes */}
            <div className="flex flex-col gap-4 overflow-y-auto max-h-120">
                <AnimatePresence>
                    {orders.map((order) => (
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
                                actionButton={
                                    actionButtonStatus && actionButtonGenerator
                                        ? actionButtonGenerator(
                                              order.id,
                                              actionButtonStatus,
                                          )
                                        : undefined
                                }
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Mensaje cuando no hay órdenes */}
            {orders.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-4">
                    <Label size="small" color="gray">
                        {`No hay ${title.toLowerCase()}.`}
                    </Label>
                </div>
            )}
        </div>
    );
}

export default QueueColumn;
