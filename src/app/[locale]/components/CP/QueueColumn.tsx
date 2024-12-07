import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IEventOrderCPS } from '@/lib/types/eventOrders';
import EventOrderCard from '../cards/EventOrderCard';

interface QueueColumnProps {
    title: string;
    icon: React.ReactNode;
    orders: IEventOrderCPS[];
    bgColor: string;
    textColor: string;
    cardVariants: any;
    actionButtonGenerator?: (order: IEventOrderCPS) => React.ReactNode;
}

export function QueueColumn({
    title,
    icon,
    orders,
    bgColor,
    textColor,
    cardVariants,
    actionButtonGenerator,
}: QueueColumnProps) {
    return (
        <div className={`flex flex-col ${bgColor} rounded-lg p-6`}>
            <h2
                className={`text-xl font-bold flex items-center gap-2 mb-4 ${textColor}`}
            >
                {icon} {title}
            </h2>
            <div className="flex flex-col gap-4 overflow-auto">
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
                                    actionButtonGenerator
                                        ? actionButtonGenerator(order)
                                        : undefined
                                }
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
