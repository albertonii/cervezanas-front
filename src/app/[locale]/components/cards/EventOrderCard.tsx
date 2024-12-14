'use client';

import React from 'react';
import Label from '@/app/[locale]/components/ui/Label';
import { User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { IEventOrderCPS } from '@/lib/types/eventOrders';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
    order: IEventOrderCPS;
    actionButton?: React.ReactNode;
}

const EventOrderCard = ({ order, actionButton }: Props) => {
    const t = useTranslations('event');
    const [isOpen, setIsOpen] = React.useState(false);

    const toggleDetails = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start sm:items-center">
                <Label className="font-medium text-lg text-gray-800 dark:text-white">
                    #{order.order_number}
                </Label>
                {actionButton && (
                    <div className="mt-2 sm:mt-0">{actionButton}</div>
                )}
            </div>

            {/* User Info */}
            <div className="flex items-center mt-2">
                <User className="w-5 h-5 text-gray-500 dark:text-gray-300 mr-2" />
                <Label
                    size="small"
                    color="gray"
                    className="text-sm text-gray-600 dark:text-gray-400"
                >
                    {order.event_orders?.users?.username ?? t('guest')}
                </Label>
            </div>

            {/* Products List */}
            <div className="mt-4">
                <Label
                    color="gray"
                    size="small"
                    font="medium"
                    className="text-sm text-gray-700 dark:text-gray-300"
                >
                    {t('products')}:
                </Label>
                <ul className="mt-1 space-y-1">
                    {order.event_order_items?.map((item) => (
                        <li
                            key={item.id}
                            className="flex justify-between items-center text-sm text-gray-700 dark:text-gray-300"
                        >
                            <Label size="small" font="medium">
                                {item.quantity} x {item.product_packs?.name} -{' '}
                                {item.product_packs?.products?.name}
                            </Label>
                            <Label
                                size="small"
                                color="gray"
                                className="text-sm"
                            >
                                €
                                {(
                                    item.product_packs?.price! * item.quantity
                                ).toFixed(2)}
                            </Label>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Notes Section */}
            {order.notes && (
                <div className="mt-4">
                    <button
                        onClick={toggleDetails}
                        className="flex items-center w-full text-left focus:outline-none"
                        aria-expanded={isOpen}
                    >
                        <Label
                            size="small"
                            color="yellow"
                            className="text-sm font-medium text-yellow-700 dark:text-yellow-300"
                        >
                            {t('note')}
                        </Label>
                        {isOpen ? (
                            <ChevronUp className="w-5 h-5 ml-auto text-yellow-700 dark:text-yellow-300" />
                        ) : (
                            <ChevronDown className="w-5 h-5 ml-auto text-yellow-700 dark:text-yellow-300" />
                        )}
                    </button>
                    {isOpen && (
                        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md transition-all duration-200">
                            <Label
                                size="small"
                                color="yellow"
                                className="text-sm text-gray-800 dark:text-gray-100"
                            >
                                {order.notes}
                            </Label>
                        </div>
                    )}
                </div>
            )}

            {/* Total */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <Label
                    size="small"
                    className="text-sm text-gray-700 dark:text-gray-300"
                >
                    {t('total')}:
                </Label>
                <Label
                    size="small"
                    color="beer-draft"
                    font="semibold"
                    className="text-sm text-green-600 dark:text-green-400"
                >
                    €{order.event_orders?.total.toFixed(2)}
                </Label>
            </div>
        </div>
    );
};

export default EventOrderCard;
