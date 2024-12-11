import React from 'react';
import { useTranslations } from 'next-intl';
import { formatCurrency } from '@/utils/formatCurrency';
import {
    IEventOrder,
    IEventOrderCPS,
    IEventOrderItem,
} from '@/lib/types/eventOrders';

interface Props {
    order: IEventOrder;
}

export default function PaymentInformation({ order }: Props) {
    const t = useTranslations();

    const { event_order_cps: eventOrderCPS } = order;

    // Calcular el subtotal sumando todos los productos de todos los event_order_cps
    const subtotal =
        eventOrderCPS?.reduce((accumulator, eventOrderCP: IEventOrderCPS) => {
            const cpSubtotal =
                eventOrderCP.event_order_items?.reduce(
                    (subtotalAcc, item: IEventOrderItem) =>
                        subtotalAcc +
                        (item.product_packs?.price ?? 0) * item.quantity,
                    0,
                ) ?? 0;
            return accumulator + cpSubtotal;
        }, 0) ?? 0;

    const { discount = 0, tax = 0 } = order;

    const total = subtotal + tax - discount;

    return (
        <div className="bg-gray-100 dark:bg-gray-800 px-4 py-6 sm:rounded-lg sm:px-6 lg:grid lg:grid-cols-1 lg:gap-x-8 lg:px-8 lg:py-8">
            <dl className="mt-8 items-center divide-y divide-gray-200 dark:divide-gray-700 text-sm lg:col-span-5 lg:mt-0">
                <div className="flex items-center justify-between pb-4">
                    <dt className="text-gray-600 dark:text-gray-300">
                        {t('subtotal')}
                    </dt>
                    <dd className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(subtotal)}
                    </dd>
                </div>

                {/* Mostrar descuento si existe */}
                {discount > 0 && (
                    <div className="flex items-center justify-between py-4">
                        <dt className="text-gray-600 dark:text-gray-300">
                            {t('discount')}
                        </dt>
                        <dd className="font-medium text-gray-900 dark:text-white">
                            -{formatCurrency(discount)}
                        </dd>
                    </div>
                )}

                <div className="flex items-center justify-between py-4">
                    <dt className="text-gray-600 dark:text-gray-300">
                        {t('tax')}
                    </dt>
                    <dd className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(tax)}
                    </dd>
                </div>

                <div className="flex items-center justify-between pt-4">
                    <dt className="font-medium text-gray-900 dark:text-white">
                        {t('total')}
                    </dt>
                    <dd className="font-bold text-beer-draft dark:text-beer-softBlonde">
                        {formatCurrency(total)}
                    </dd>
                </div>
            </dl>
        </div>
    );
}
