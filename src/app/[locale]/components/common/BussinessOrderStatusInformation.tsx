import { ONLINE_ORDER_STATUS } from '@/constants';
import { IBusinessOrder, IOrder } from '@/lib/types/types';
import { formatDateString } from '@/utils/formatDate';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface Props {
    bOrders: IBusinessOrder[];
    order: IOrder;
}

const BusinessOrderStatusInformation = ({ bOrders, order }: Props) => {
    const t = useTranslations();
    const locale = useLocale();

    console.log(bOrders);

    const [packStatusArray, setPackStatusArray] = useState<string[]>(
        bOrders?.map((bOrder: IBusinessOrder) => bOrder.status) ?? [],
    );

    const [orderStatus, setOrderStatus] = useState<string>('pending');

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

    const handleInvoicePdf = () => {
        // Get current url
        const currentUrl = window.location.href;

        // window.open(
        //     `/${currentUrl}/checkout/invoice/${order.order_number}`,
        //     '_ blank',
        // );
    };

    return (
        <section className="px-4 py-6 sm:rounded-lg sm:px-6 space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0 bg-beer-foam">
            <div className="flex flex-col">
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
                                orderStatus === ONLINE_ORDER_STATUS.DELIVERED
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
                            href={`/user-info/${order.owner_id}`}
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
    );
};

export default BusinessOrderStatusInformation;