'use client';

import Spinner from '@/app/[locale]/components/ui/Spinner';
import DistributorCard from '@/app/[locale]/components/cards/DistributorCard';
import BillingInformationBox from '@/app/[locale]/components/BillingInformationBox';
import PaymentInformationBox from '@/app/[locale]/components/PaymentInformationBox';
import ShippingInformationBox from '@/app/[locale]/components/ShippingInformationBox';
import BusinessOrderItem from '../../../../../../components/common/BusinessOrderItem';
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { IBusinessOrder, IOrder } from '@/lib/types/types';
import { useAuth } from '../../../../../../(auth)/Context/useAuth';

interface Props {
    isError?: boolean;
    order: IOrder;
}

export default function SuccessCheckout({ order, isError }: Props) {
    const t = useTranslations();
    const [orderByDistributorBOrders, setOrderByDistributorBOrders] = useState(
        [],
    );

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
        if (order) {
            const { business_orders: bOrders } = order;

            if (!bOrders) return;

            const orderByDistributorBOrders = bOrders.reduce(
                (acc: any, bOrder: any) => {
                    if (!acc[bOrder.distributor_id]) {
                        acc[bOrder.distributor_id] = [];
                    }

                    acc[bOrder.distributor_id].push(bOrder);

                    return acc;
                },
                {},
            );

            setOrderByDistributorBOrders(orderByDistributorBOrders);
        }
    }, [order]);

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
        <section className="m-4 sm:py-4 lg:py-6 w-full">
            {orderByDistributorBOrders &&
                Object.values(orderByDistributorBOrders).map(
                    (bOrders: IBusinessOrder[], index) => {
                        return (
                            <article
                                key={index}
                                className="relative border-separate space-y-8 rounded-lg border bg-beer-foam p-2 py-4 my-4"
                            >
                                {bOrders.map((bOrder) => (
                                    <BusinessOrderItem
                                        key={bOrder.id}
                                        bOrder={bOrder}
                                    />
                                ))}
                            </article>
                        );
                    },
                )}

            <section className="bg-gray-100 px-4 py-6 sm:rounded-lg sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-8">
                <div className="col-span-6 space-y-8">
                    {/* <!-- Shipping --> */}
                    {order && <ShippingInformationBox order={order} />}

                    {/* <!-- Billing --> */}
                    {order && <BillingInformationBox order={order} />}
                </div>

                <div className="col-span-6">
                    <PaymentInformationBox order={order} />
                </div>
            </section>
        </section>
    );
}
