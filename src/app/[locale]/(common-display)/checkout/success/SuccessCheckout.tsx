'use client';

import Spinner from '@/app/[locale]/components/ui/Spinner';
import PaymentInformationBox from '@/app/[locale]/components/PaymentInformationBox';
import BillingInformationBox from '@/app/[locale]/components/BillingInformationBox';
import BusinessOrderItem from '@/app/[locale]/components/common/BusinessOrderItem';
import ShippingInformationBox from '@/app/[locale]/components/ShippingInformationBox';
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { IOrder } from '@/lib/types/types';
import { useAuth } from '../../../(auth)/Context/useAuth';
import { useShoppingCart } from '@/app/context/ShoppingCartContext';

interface Props {
    isError?: boolean;
    order: IOrder;
    santanderResponse: string;
}

export default function SuccessCheckout({
    order,
    isError,
    santanderResponse,
}: Props) {
    const { business_orders: bOrders } = order;

    const t = useTranslations();

    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { clearCart } = useShoppingCart();

    useEffect(() => {
        if (santanderResponse === '0000' || santanderResponse === '9999') {
            clearCart();
        }
    }, [santanderResponse]);

    useEffect(() => {
        if (user) {
            setLoading(false);
        }

        return () => {
            setLoading(true);
        };
    }, [user]);

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
            {/* Product and packs information */}
            {bOrders &&
                bOrders.map((bOrder) => {
                    return (
                        <article key={bOrder.id} className="py-4">
                            <BusinessOrderItem bOrder={bOrder} />
                        </article>
                    );
                })}

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
