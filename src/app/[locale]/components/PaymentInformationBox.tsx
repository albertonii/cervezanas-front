import React from 'react';
import { IOrder } from '@/lib/types/types';
import { formatCurrency } from '@/utils/formatCurrency';
import { useTranslations } from 'next-intl';
import { ONLINE_ORDER_STATUS } from '@/constants';

interface Props {
    order: IOrder;
}

const PaymentInformationBox = ({ order }: Props) => {
    const t = useTranslations();

    return (
        <dl className="mt-8 divide-y divide-gray-200 text-sm lg:col-span-12 lg:mt-0 space-y-1">
            <div className="flex items-center justify-between py-2">
                <dt className="text-gray-600">{t('order_status')}</dt>
                <dd
                    className={`
                        ${
                            order.status === ONLINE_ORDER_STATUS.PAID &&
                            'text-green-700'
                        } 
                        ${
                            order.status === ONLINE_ORDER_STATUS.CANCELLED &&
                            'text-red-700'
                        }
                        ${
                            order.status ===
                                ONLINE_ORDER_STATUS.CANCELLED_BY_EXPIRATION &&
                            'text-red-700'
                        }
                        ${
                            order.status === ONLINE_ORDER_STATUS.ERROR &&
                            'text-red-700'
                        }  
                    font-medium`}
                >
                    {t(`${order.status}`)}
                </dd>
            </div>

            <div className="flex items-center justify-between py-2">
                <dt className="text-gray-600">{t('subtotal')}</dt>
                <dd className="font-medium text-gray-900">
                    {formatCurrency(order.subtotal)}
                </dd>
            </div>

            <div className="flex items-center justify-between py-2">
                <dt className="text-gray-600">{t('shipping')}</dt>
                <dd className="font-medium text-gray-900">
                    {formatCurrency(order.shipping)}
                </dd>
            </div>

            {order.promo_code && order.discount && (
                <div className="flex items-center justify-between py-2">
                    <dt className="text-gray-600">{t('discount')}</dt>
                    <dd className="font-medium text-green-700">
                        {t('promo_code')} {order.promo_code} {' - '}{' '}
                        {formatCurrency(order.discount)}{' '}
                    </dd>
                </div>
            )}

            <div className="flex items-center justify-between py-2">
                <dt className="font-medium text-gray-900">{t('total')}</dt>
                <dd className="font-medium text-beer-draft">
                    {formatCurrency(order.total)}
                </dd>
            </div>
        </dl>
    );
};

export default PaymentInformationBox;
