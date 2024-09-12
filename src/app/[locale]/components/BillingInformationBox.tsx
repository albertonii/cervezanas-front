import React from 'react';
import { useTranslations } from 'next-intl';
import { IOrder } from '@/lib/types/types';

interface Props {
    order: IOrder;
}

const BillingInformationBox = ({ order }: Props) => {
    const t = useTranslations();

    return (
        <dl className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-2 md:gap-x-8 lg:col-span-6">
            <address>
                <dt className="font-medium text-gray-900">
                    {t('billing_address')}
                </dt>

                <dd className="mt-3 text-gray-500">
                    <span className="block font-semibold">
                        {order.billing_name} {order.billing_lastname}
                    </span>

                    <span className="block">{order.billing_document_id}</span>

                    <span className="block"> {order.billing_phone}</span>

                    <span className="block">
                        {order.billing_address}, {order.billing_city},
                        {order.billing_zipcode},{order.billing_sub_region} -{' '}
                        {order.billing_region}, {order.billing_country}
                    </span>
                </dd>
            </address>
        </dl>
    );
};

export default BillingInformationBox;
