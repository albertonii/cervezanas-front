'use client';

import PaymentInformation from './PaymentInformation';
import Label from '@/app/[locale]/components/ui/Label';
import Title from '@/app/[locale]/components/ui/Title';
import EventCPOrderProducts from './EventCPOrderProducts';
import Spinner from '@/app/[locale]/components/ui/Spinner';
import useEventCartStore from '@/app/store/eventCartStore';
import OrderCPEventInstructions from '@/app/[locale]/components/CP/OrderCPEventInstructions';
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { EVENT_ORDER_STATUS } from '@/constants';
import { formatDateString } from '@/utils/formatDate';
import { IEventOrder } from '@/lib/types/eventOrders';
import { useAuth } from '../../../../(auth)/Context/useAuth';

interface Props {
    isError?: boolean;
    order: IEventOrder;
    santanderResponse: string;
    domain: string;
}

export default function SuccessCheckout({
    order,
    isError,
    santanderResponse,
    domain,
}: Props) {
    const { event_order_cps: eventOrderCPs } = order;
    const { clearCart } = useEventCartStore();

    const t = useTranslations();

    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            setLoading(false);
        }

        return () => {
            setLoading(true);
        };
    }, [user]);

    useEffect(() => {
        if (santanderResponse === '0000' || santanderResponse === '9999') {
            clearCart(order.event_id);
        }
    }, [santanderResponse]);

    const handleInvoicePdf = () => {
        const invoiceUrl = `/checkout/invoice/${order.order_number}`;
        window.open(invoiceUrl, '_blank');
    };

    if (isError) {
        return (
            <section className="container mx-auto flex flex-col space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0 sm:py-4 lg:py-6">
                <span className="sm:items-baseline sm:space-x-4">
                    <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                        {t('order_erorr')}
                    </h1>
                </span>
            </section>
        );
    }

    if (loading) return <Spinner color="beer-blonde" size="fullScreen" />;

    return (
        <section className="m-4 sm:py-4 lg:py-6 w-full">
            <OrderCPEventInstructions />

            <div className="space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:p-2 bg-beer-foam dark:bg-gray-800 rounded-lg border border-gray-700">
                <header className="flex flex-col">
                    <span className="flex sm:items-baseline sm:space-x-4">
                        <Title size="large" color="beer-draft" font="bold">
                            {t('order_number')} #{order.order_number}
                        </Title>

                        <Label
                            onClick={() => handleInvoicePdf()}
                            font="link"
                            size="small"
                            className="dark:text-beer-amber"
                        >
                            {t('view_invoice')}
                            <span aria-hidden="true"> &rarr;</span>
                        </Label>
                    </span>

                    {/* Estado del Pedido */}
                    <div className="right-0 flex md:mt-2">
                        <Label className="dark:text-gray-300">
                            {t('order_status')}:
                        </Label>
                        <Label
                            color="beer-draft"
                            font="medium"
                            className={`ml-2 ${
                                order.status === EVENT_ORDER_STATUS.SERVED
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-beer-draft dark:text-beer-amber'
                            }`}
                        >
                            {t(order.status)}
                        </Label>
                    </div>
                </header>

                <div className="flex items-center justify-center gap-4">
                    <Label
                        size="xsmall"
                        color="gray"
                        className="dark:text-gray-400"
                    >
                        {t('status_order_placed')}
                    </Label>
                    <Label
                        color="beer-draft"
                        font="medium"
                        className="dark:text-white"
                    >
                        <time dateTime="2021-03-22">
                            {formatDateString(order.created_at.toString())}
                        </time>
                    </Label>
                </div>
            </div>

            {/* Información de Productos y Packs */}
            {eventOrderCPs &&
                eventOrderCPs.map((eventOrderCP) => (
                    <article key={eventOrderCP.id} className="py-4">
                        <EventCPOrderProducts
                            eventOrderCP={eventOrderCP}
                            domain={domain}
                        />
                    </article>
                ))}

            {/* Información de Pago */}
            <div className="mt-16 w-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg sm:border">
                <PaymentInformation order={order} />
            </div>
        </section>
    );
}
