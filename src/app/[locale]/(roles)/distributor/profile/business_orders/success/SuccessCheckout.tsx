'use client';

import BusinessOrderItem from './BusinessOrderItem';
import ShippingInformationBox from '@/app/[locale]/components/ShippingInformationBox';
import BillingInformationBox from '@/app/[locale]/components/BillingInformationBox';
import PaymentInformationBox from '@/app/[locale]/components/PaymentInformationBox';
import React, { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { IBusinessOrder, IOrder } from '@/lib/types/types';
import { useAuth } from '../../../../../(auth)/Context/useAuth';
import OrderStatusInformation from '@/app/[locale]/components/common/OrderStatusInformation';
import BusinessOrderStatusInformation from '@/app/[locale]/components/common/BussinessOrderStatusInformation';

interface Props {
    isError?: boolean;
    order: IOrder;
}

export default function SuccessCheckout({ order, isError }: Props) {
    const { business_orders: bOrders } = order;

    const t = useTranslations();
    const { supabase } = useAuth();

    const [packStatusArray, setPackStatusArray] = useState<string[]>(
        bOrders?.map((bOrder: IBusinessOrder) => bOrder.status) ?? [],
    );

    const [orderStatus, setOrderStatus] = useState<string>(order.status);

    useEffect(() => {
        // Dependiendo del estado de los business orders, el estado del pedido será:
        // El orden de prioridades que debe seguir los estados es 1. pending, 2. processing, 3. shipped 4. delivered
        // Por lo que, si todos los business_orders alcanzan el mismo estado, lo mostrarán. Pero si hay alguno que tenga un estado "inferior" la orden de compra tendrá el estado inferior de todos ellos.
        // Por ejemplo, si hay 3 business_orders con estado "processing" y 1 con estado "pending", el estado de la orden de compra será "pending"
        // Si hay 3 business_orders con estado "proccessing" y 1 con estado "shipped", el estado de la orden de compra será "processing"
        // Si hay 3 business_orders con estado "shipped" y 1 con estado "delivered", el estado de la orden de compra será "shipped"
        // Si hay 3 business_orders con estado "delivered" y 1 con estado "processing", el estado de la orden de compra será "processing"

        // Diccionario al que se pueda acceder para consultar el peso de cada estado
        const statusWeight = new Map([
            ['pending', 1],
            ['processing', 2],
            ['shipped', 3],
            ['delivered', 4],
            ['cancelled', 5],
            ['error', 6],
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
                        <h1 className="text-4xl font-['NexaRust-script'] font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                            {t('order_erorr')}
                        </h1>
                    </span>
                </div>
            </section>
        );
    }

    return (
        <section className="m-4 space-y-8 sm:py-4 lg:py-6">
            <OrderStatusInformation order={order} orderStatus={orderStatus} />

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
                    {order && <ShippingInformationBox order={order} />}
                </div>

                <div className="col-span-6">
                    <PaymentInformationBox order={order} />
                </div>
            </section>
        </section>
    );
}
