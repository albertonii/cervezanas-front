'use client';

import BusinessOrderDetails from './BusinessOrderDetails';
import Spinner from '@/app/[locale]/components/common/Spinner';
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { IOrder } from '@/lib//types/types';
import { ONLINE_ORDER_STATUS } from '@/constants';
import { formatDateString } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import { useAuth } from '../../../(auth)/Context/useAuth';
import BillingInformationBox from '@/app/[locale]/components/BillingInformationBox';
import ShippingInformationBox from '@/app/[locale]/components/ShippingInformationBox';
import PaymentInformationBox from '@/app/[locale]/components/PaymentInformationBox';

interface Props {
    isError?: boolean;
    order: IOrder;
}

export default function SuccessCheckout({ order, isError }: Props) {
    const { business_orders: bOrders } = order;

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

    const handleInvoicePdf = () => {
        // Get current url
        const currentUrl = window.location.href;

        window.open(
            `/${currentUrl}/checkout/invoice/${order.order_number}`,
            '_ blank',
        );
    };

    if (isError) {
        return (
            <section className="container mx-auto flex flex-col space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0 sm:py-4 lg:py-6">
                <span className="sm:items-baseline sm:space-x-4">
                    <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                        {t('order_erorr')}
                    </h1>
                </span>
            </section>
        );
    }

    if (loading) return <Spinner color="beer-blonde" size="fullScreen" />;

    return (
        <section className="m-4 sm:py-4 lg:py-6">
            <div className="space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0 bg-beer-foam">
                <header className="flex flex-col">
                    <span className="flex sm:items-baseline sm:space-x-4">
                        <h1 className="text-xl font-extrabold tracking-tight text-beer-dark sm:text-2xl">
                            {t('order_number')} #{order.order_number}
                        </h1>

                        <p
                            onClick={() => handleInvoicePdf()}
                            className="mt-4 hidden text-sm font-medium tracking-wide text-gray-500 hover:cursor-pointer hover:text-beer-blonde sm:ml-2 sm:mt-0 sm:block"
                        >
                            {t('view_invoice')}
                            <span aria-hidden="true"> &rarr;</span>
                        </p>
                    </span>

                    {/* Order Status  */}
                    <div className="right-0 col-span-12 pr-12 md:col-span-4 md:mt-2 ">
                        <span className="text-lg font-medium text-beer-dark sm:text-xl">
                            {t('order_status')}:
                            <span
                                className={`ml-2 ${
                                    order.status ===
                                    ONLINE_ORDER_STATUS.DELIVERED
                                        ? 'text-green-600'
                                        : 'text-beer-draft'
                                } `}
                            >
                                {t(order.status)}
                            </span>
                        </span>
                    </div>
                </header>

                <p className="text-sm text-gray-600">
                    {t('status_order_placed')}
                    <time
                        dateTime="2021-03-22"
                        className="font-medium text-gray-900"
                    >
                        {formatDateString(order.issue_date.toString())}
                    </time>
                </p>
                <a
                    href="#"
                    className="text-sm font-medium hover:text-beer-blonde sm:hidden"
                >
                    {t('view_invoice')}
                    <span aria-hidden="true"> &rarr;</span>
                </a>
            </div>

            {/* Product and packs information */}
            {bOrders &&
                bOrders.map((bOrder) => {
                    return (
                        <article key={bOrder.id} className="py-4">
                            <BusinessOrderDetails bOrder={bOrder} />
                        </article>
                    );
                })}

            <section className="bg-gray-100 px-4 py-6 sm:rounded-lg sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-8">
                <div className="col-span-6 space-y-8">
                    {/* <!-- Shipping --> */}
                    {order.shipping_info && (
                        <ShippingInformationBox
                            shippingInfo={order.shipping_info}
                        />
                    )}

                    {/* <!-- Billing --> */}
                    {order.billing_info && (
                        <BillingInformationBox
                            billingInfo={order.billing_info}
                        />
                    )}
                </div>

                <div className="col-span-6">
                    <PaymentInformationBox order={order} />
                </div>
            </section>
        </section>
    );
}
