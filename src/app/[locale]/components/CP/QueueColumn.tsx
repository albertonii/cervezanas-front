import Label, { LabelColor } from '../ui/Label';
import EventOrderCard from '../cards/EventOrderCard';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IEventOrder, IEventOrderCPS } from '@/lib/types/eventOrders';

interface QueueColumnProps {
    title: string;
    icon: React.ReactNode;
    orders: IEventOrderCPS[];
    bgColor: string;
    textColor: LabelColor;
    actionButtonGenerator?: (
        orderId: string,
        status: IEventOrder['status'],
    ) => React.ReactNode;
    actionButtonStatus?: IEventOrder['status'];
}

// Variantes de animación
const cardVariants = {
    initial: { opacity: 0, y: -20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 20, scale: 0.95 },
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
        <div className={`flex flex-col ${bgColor} rounded-lg p-6 space-y-2`}>
            <Label size="large" font="bold" color={textColor}>
                {icon} {title}
            </Label>
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
        </div>
    );
}
