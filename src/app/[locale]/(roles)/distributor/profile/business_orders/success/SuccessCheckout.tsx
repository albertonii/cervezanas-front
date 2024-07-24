'use client';

import Link from 'next/link';
import BusinessOrderItem from './BusinessOrderItem';
import ShippingInformationBox from '@/app/[locale]/components/ShippingInformationBox';
import BillingInformationBox from '@/app/[locale]/components/BillingInformationBox';
import PaymentInformationBox from '@/app/[locale]/components/PaymentInformationBox';
import React, { useState, useEffect } from 'react';
import { ONLINE_ORDER_STATUS } from '@/constants';
import { formatDateString } from '@/utils/formatDate';
import { useLocale, useTranslations } from 'next-intl';
import { IBusinessOrder, IOrder } from '@/lib/types/types';
import { useAuth } from '../../../../../(auth)/Context/useAuth';

interface Props {
    isError?: boolean;
    order: IOrder;
}

export default function SuccessCheckout({ order, isError }: Props) {
    const { business_orders: bOrders } = order;

    const t = useTranslations();
    const locale = useLocale();
    const { supabase } = useAuth();

    const [packStatusArray, setPackStatusArray] = useState<string[]>(
        bOrders?.map((bOrder: IBusinessOrder) => bOrder.status) ?? [],
    );

    const [orderStatus, setOrderStatus] = useState<string>(order.status);

    useEffect(() => {
        // Dependiendo del estado de los business orders, el estado del pedido será:
        // El orden de prioridades que debe seguir los estados es 1. pending, 2. processing, 3. in_transit, 4. shipped 5. delivered
        // Por lo que, si todos los business_orders alcanzan el mismo estado, lo mostrarán. Pero si hay alguno que tenga un estado "inferior" la orden de compra tendrá el estado inferior de todos ellos.
        // Por ejemplo, si hay 3 business_orders con estado "processing" y 1 con estado "pending", el estado de la orden de compra será "pending"
        // Si hay 3 business_orders con estado "in_transit" y 1 con estado "shipped", el estado de la orden de compra será "in_transit"
        // Si hay 3 business_orders con estado "shipped" y 1 con estado "delivered", el estado de la orden de compra será "shipped"
        // Si hay 3 business_orders con estado "delivered" y 1 con estado "processing", el estado de la orden de compra será "processing"

        // Diccionario al que se pueda acceder para consultar el peso de cada estado
        const statusWeight = new Map([
            ['pending', 1],
            ['processing', 2],
            ['in_transit', 3],
            ['shipped', 4],
            ['delivered', 5],
            ['cancelled', 6],
            ['error', 7],
        ]);

        // Obtenemos el estado de la orden de compra
        const orderStatus = packStatusArray?.reduce((prev, curr) => {
            // Devolvemos el estado con menor peso y teniendo en cuenta que puede ser undefined
            const prevStatus = statusWeight.get(prev);
            const currStatus = statusWeight.get(curr);

            if (prevStatus === undefined && currStatus === undefined)
                return prev;

            if (prevStatus === undefined) return curr;

            if (currStatus === undefined) return prev;

            if (prevStatus === 6 || currStatus === 6) return 'cancelled';

            if (prevStatus === 7 || currStatus === 7) return 'error';

            return prevStatus < currStatus ? prev : curr;
        });

        setOrderStatus(orderStatus);
    }, [packStatusArray]);

    useEffect(() => {
        const updateOrderStatus = async () => {
            const { error } = await supabase
                .from('orders')
                .update({ status: orderStatus })
                .eq('id', order.id)
                .select();

            if (error) console.error(error);
        };

        if (orderStatus !== order.status) updateOrderStatus();
    }, [orderStatus]);

    if (isError) {
        return (
            <section className="mx-auto sm:py-4 lg:py-6">
                <div className="flex flex-col space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0">
                    <span className="flex sm:items-baseline sm:space-x-4">
                        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                            {t('order_erorr')}
                        </h1>
                    </span>
                </div>
            </section>
        );
    }

    return (
        <section className="m-4 space-y-8 sm:py-4 lg:py-6">
            <section className="space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0 bg-beer-foam">
                <div className="flex flex-col">
                    <span className="flex sm:items-baseline sm:space-x-4">
                        <h1 className="text-xl font-extrabold tracking-tight text-beer-dark sm:text-2xl">
                            {t('order_number')} #{order.order_number}
                        </h1>
                    </span>

                    {/* Order Status  */}
                    <div className="right-0 col-span-12 pr-12 md:col-span-4 md:mt-2 ">
                        <span className="text-lg font-medium text-beer-dark sm:text-xl">
                            {t('order_status')}:
                            <span
                                className={`ml-2 ${
                                    orderStatus ===
                                    ONLINE_ORDER_STATUS.DELIVERED
                                        ? 'text-green-600'
                                        : 'text-beer-draft'
                                } `}
                            >
                                {t(orderStatus)}
                            </span>
                        </span>
                    </div>

                    {/* Información del usuario que ha realizado la compra de manera minimalista y UX/UI friendly */}
                    <div className="mt-4 grid grid-cols-2 gap-2 space-y-2 sm:items-baseline sm:space-y-0">
                        <h1 className="col-span-3 text-lg tracking-tight text-gray-900 sm:text-xl">
                            {t('customer_info')}
                        </h1>

                        <span className="flex items-center gap-2 text-gray-900 ">
                            {t('name')}:
                            <Link
                                href={`/c-info/${order.owner_id}`}
                                locale={locale}
                                target={'_blank'}
                            >
                                <h2 className="font-extrabold tracking-tight hover:cursor-pointer hover:text-beer-draft ">
                                    {order.shipping_info?.name}{' '}
                                    {order.shipping_info?.lastname}
                                </h2>
                            </Link>
                        </span>

                        <span className="flex items-center gap-2 text-gray-900 ">
                            {t('phone')}:
                            <h2 className="font-extrabold tracking-tight">
                                {order.shipping_info?.phone}
                            </h2>
                        </span>
                    </div>
                </div>

                <p className="text-sm text-gray-600">
                    {t('status_order_placed')}
                    <time
                        dateTime="2021-03-22"
                        className="font-medium text-gray-900"
                    >
                        {formatDateString(order.issue_date.toString())}
                    </time>
                </p>
            </section>

            {/* Product and packs information */}
            {bOrders &&
                bOrders.map((bOrder: IBusinessOrder, index: number) => (
                    <article key={bOrder.id} className="py-4">
                        <BusinessOrderItem
                            bOrder={bOrder}
                            setPackStatusArray={setPackStatusArray}
                            index={index}
                        />
                    </article>
                ))}

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
