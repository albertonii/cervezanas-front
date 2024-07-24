import { ONLINE_ORDER_STATUS } from '@/constants';
import { IOrder } from '@/lib/types/types';
import { formatDateString } from '@/utils/formatDate';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';

interface Props {
    order: IOrder;
    orderStatus: string;
}

const OrderStatusInformation = ({ order, orderStatus }: Props) => {
    const t = useTranslations();
    const locale = useLocale();

    return (
        <section className="px-4 py-6 sm:rounded-lg sm:px-6 space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0 bg-beer-foam">
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
    );
};

export default OrderStatusInformation;
