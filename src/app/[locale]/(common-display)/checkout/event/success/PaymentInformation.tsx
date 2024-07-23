import React from 'react';
import { useTranslations } from 'next-intl';
import { IEventOrder } from '@/lib//types/types';
import { formatCurrency } from '@/utils/formatCurrency';

interface Props {
    order: IEventOrder;
}

export default function PaymentInformation({ order }: Props) {
    const t = useTranslations();

    const { event_order_items: eventOrderItems } = order;

    const subtotal =
        eventOrderItems?.reduce(
            (subtotal, item) =>
                item.product_packs!.price * item.product_packs!.quantity +
                subtotal,
            0,
        ) ?? 0;

    const { discount_code, discount, tax } = order;
    const total = subtotal + order.tax - order.discount;

    return (
        <div className="bg-gray-100 px-4 py-6 sm:rounded-lg sm:px-6 lg:grid lg:grid-cols-1 lg:gap-x-8 lg:px-8 lg:py-8">
            <dl className="mt-8 items-center divide-y divide-gray-200 text-sm lg:col-span-5 lg:mt-0">
                <div className="flex items-center justify-between pb-4">
                    <dt className="text-gray-600">{t('subtotal')}</dt>
                    <dd className="font-medium text-gray-900">
                        {formatCurrency(subtotal)}
                    </dd>
                </div>

                {order.discount_code && order.discount && (
                    <div className="flex items-center justify-between pb-4">
                        <dt className="text-gray-600">{t('discount')}</dt>
                        <dd className="font-medium text-gray-900">
                            {t('discount_code')} {order.discount_code} {' - '}{' '}
                            {formatCurrency(order.discount)}
                        </dd>
                    </div>
                )}

                <div className="flex items-center justify-between py-4">
                    <dt className="text-gray-600">{t('tax')}</dt>
                    <dd className="font-medium text-gray-900">
                        {formatCurrency(tax)}
                    </dd>
                </div>
                <div className="flex items-center justify-between pt-4">
                    <dt className="font-medium text-gray-900">{t('total')}</dt>
                    <dd className="font-medium text-beer-draft">
                        {formatCurrency(total)}
                    </dd>
                </div>
            </dl>
        </div>
    );
}
