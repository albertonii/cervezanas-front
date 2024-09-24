import React from 'react';
import Link from 'next/link';
import DistributorShipmentTrackingForm from './DistributorShipmentTrackingForm';
import DistributorShipmentTrackingMessageForm from './DistributorShipmentTrackingMessageForm';
import { IOrder } from '@/lib/types/types';
import { ONLINE_ORDER_STATUS } from '@/constants';
import { formatDateString } from '@/utils/formatDate';
import { useLocale, useTranslations } from 'next-intl';

interface Props {
    order: IOrder;
    orderStatus: string; // Puede ser un valor diferente al que venga desde order porque tiene en cuenta los Business Orders
}

const DistributorOrderStatusInformation = ({ order, orderStatus }: Props) => {
    const t = useTranslations();
    const locale = useLocale();

    const handleInvoicePdf = () => {
        const invoiceUrl = `/checkout/invoice/${order.order_number}`;
        window.open(invoiceUrl, '_blank');
    };

    const shipmentTracking = order.business_orders?.[0].shipment_tracking;

    return (
        <section className="px-4 py-6 sm:rounded-lg sm:px-6 space-y-2 px-4 sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0 bg-beer-foam">
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

                {/* Información del usuario que ha realizado la compra */}
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
                                {order.shipping_name} {order.shipping_lastname}
                            </h2>
                        </Link>
                    </span>

                    <span className="flex items-center gap-2 text-gray-900 ">
                        {t('phone')}:
                        <h2 className="font-extrabold tracking-tight">
                            {order.shipping_phone}
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

            {shipmentTracking && order.users?.email && order.users.username && (
                <div className="space-y-8">
                    <DistributorShipmentTrackingForm
                        emailTo={order.users?.email}
                        username={order.users?.username}
                        shipmentTracking={shipmentTracking}
                    />

                    <DistributorShipmentTrackingMessageForm
                        shipmentTracking={shipmentTracking}
                    />
                </div>
            )}
        </section>
    );
};

export default DistributorOrderStatusInformation;
