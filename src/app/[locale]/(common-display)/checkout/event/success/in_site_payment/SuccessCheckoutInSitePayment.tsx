'use client';

import Label from '@/app/[locale]/components/ui/Label';
import Title from '@/app/[locale]/components/ui/Title';
import PaymentInformation from '../PaymentInformation';
import Spinner from '@/app/[locale]/components/ui/Spinner';
import useEventCartStore from '@/app/store/eventCartStore';
import EventCPOrderProducts from '../EventCPOrderProducts';
import OrderCPEventInstructions from '@/app/[locale]/components/CP/OrderCPEventInstructions';
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { EVENT_ORDER_STATUS } from '@/constants';
import { formatDateString } from '@/utils/formatDate';
import { IEventOrder } from '@/lib/types/eventOrders';

interface Props {
    isError?: boolean;
    order: IEventOrder;
    domain?: string;
}

export default function SuccessCheckoutInSitePayment({
    order,
    isError,
    domain,
}: Props) {
    const { event_order_cps: eventOrderCPs } = order;
    const { clearCart } = useEventCartStore();

    const t = useTranslations('event');

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        clearCart(order.event_id);
        setLoading(false);
    }, []);

    const handleInvoicePdf = () => {
        const invoiceUrl = `/checkout/event/invoice/${order.order_number}`;
        window.open(invoiceUrl, '_blank');
    };

    if (isError) {
        return (
            <section className="container mx-auto flex flex-col space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0 sm:py-4 lg:py-6 sm:items-baseline sm:space-x-4">
                <Title size="xlarge" font="bold" color="gray">
                    {t('order_erorr')}
                </Title>
            </section>
        );
    }

    if (loading)
        return <Spinner color="beer-blonde" size="fullScreen" absolute />;

    return (
        <section className="m-4 sm:py-4 lg:py-6 w-full">
            <OrderCPEventInstructions />

            <div className="space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:p-2 bg-beer-foam dark:bg-gray-800 rounded-lg border border-gray-700">
                <header className="flex flex-col">
                    <span className="flex sm:items-baseline sm:space-x-4">
                        <Title size="large" color="beer-draft" font="bold">
                            {t('order_number')} #{order.order_number}
                        </Title>

                        {order.status !== EVENT_ORDER_STATUS.PENDING_PAYMENT &&
                            order.status !== EVENT_ORDER_STATUS.ERROR && (
                                <Label
                                    onClick={() => handleInvoicePdf()}
                                    font="link"
                                    size="small"
                                    className="dark:text-beer-amber"
                                >
                                    {t('view_invoice')}
                                    <span aria-hidden="true"> &rarr;</span>
                                </Label>
                            )}
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
            <div className="w-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg sm:border">
                <PaymentInformation order={order} />
            </div>
        </section>
    );
}
