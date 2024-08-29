import React from 'react';
import { IOrder } from '@/lib/types/types';
import { formatCurrency } from '@/utils/formatCurrency';
import { useTranslations } from 'next-intl';

interface Props {
    order: IOrder;
}

const PaymentInformationBox = ({ order }: Props) => {
    const t = useTranslations();

    return (
        <dl className="mt-8 divide-y divide-gray-200 text-sm lg:col-span-12 lg:mt-0">
            <div className="flex items-center justify-between pb-4">
                <dt className="text-gray-600">{t('subtotal')}</dt>
                <dd className="font-medium text-gray-900">
                    {formatCurrency(order.subtotal)}
                </dd>
            </div>

            {order.discount_code && order.discount_code !== 'none' && (
                <div className="flex items-center justify-between pb-4">
                    <dt className="text-gray-600">{t('discount')}</dt>
                    <dd className="font-medium text-gray-900">
                        {t('discount_code')} {order.discount_code} {' - '}{' '}
                        {formatCurrency(order.discount)}
                    </dd>
                </div>
            )}

            <div className="flex items-center justify-between py-4">
                <dt className="text-gray-600">{t('shipping')}</dt>
                <dd className="font-medium text-gray-900">
                    {formatCurrency(order.shipping)}
                </dd>
            </div>

            <div className="flex items-center justify-between py-4">
                <dt className="text-gray-600">{t('tax')}</dt>
                <dd className="font-medium text-gray-900">
                    {formatCurrency(order.tax)}
                </dd>
            </div>

            <div className="flex items-center justify-between pt-4">
                <dt className="font-medium text-gray-900">{t('total')}</dt>
                <dd className="font-medium text-beer-draft">
                    {formatCurrency(order.total)}
                </dd>
            </div>
        </dl>
    );
};

export default PaymentInformationBox;
