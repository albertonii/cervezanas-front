import React from 'react';
import { useTranslations } from 'next-intl';
import { IShippingInfo } from '@/lib/types/types';

interface Props {
    shippingInfo: IShippingInfo;
}

const ShippingInformationBox = ({ shippingInfo }: Props) => {
    const t = useTranslations();

    return (
        <dl className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-2 md:gap-x-8 lg:col-span-6">
            <address>
                <dt className="font-medium text-gray-900">
                    {t('shipping_address')}
                </dt>

                <dd className="mt-3 text-gray-500">
                    <span className="block font-semibold">
                        {shippingInfo.name} {shippingInfo.lastname}
                    </span>
                    <span className="block">
                        {shippingInfo.address}, {shippingInfo.city},
                        {shippingInfo.sub_region} - {shippingInfo.region},{' '}
                        {shippingInfo.zipcode},{shippingInfo.country}
                    </span>

                    {shippingInfo.address_extra && (
                        <>
                            <span className="block">
                                {shippingInfo.address_extra}
                            </span>
                            <span className="block">
                                {shippingInfo.address_observations}
                            </span>
                        </>
                    )}
                </dd>
            </address>
        </dl>
    );
};

export default ShippingInformationBox;
