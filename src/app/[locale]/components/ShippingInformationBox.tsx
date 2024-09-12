import React from 'react';
import { useTranslations } from 'next-intl';
import { IOrder } from '@/lib/types/types';

interface Props {
    order: IOrder;
}

const ShippingInformationBox = ({ order }: Props) => {
    const t = useTranslations();

    return (
        <dl className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-2 md:gap-x-8 lg:col-span-6">
            <address>
                <dt className="font-medium text-gray-900">
                    {t('shipping_address')}
                </dt>

                <dd className="mt-3 text-gray-500">
                    <span className="block font-semibold">
                        {order.shipping_name} {order.shipping_lastname}
                    </span>

                    <span className="block">{order.shipping_document_id}</span>
                    <span className="block">{order.shipping_phone}</span>

                    <span className="block">
                        {order.shipping_address}, {order.shipping_city},
                        {order.shipping_sub_region} - {order.shipping_region},{' '}
                        {order.shipping_zipcode},{order.shipping_country}
                    </span>

                    {order.shipping_address_extra && (
                        <span className="block">
                            {order.shipping_address_extra}
                        </span>
                    )}
                </dd>
            </address>
        </dl>
    );
};

export default ShippingInformationBox;
