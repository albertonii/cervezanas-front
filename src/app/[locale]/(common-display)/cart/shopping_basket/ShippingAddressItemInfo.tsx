'use client';

import React from 'react';
import { IAddress } from '@/lib/types/types';
import { useTranslations } from 'next-intl';

interface Props {
    address: IAddress;
}

export default function ShippingAddressItem({ address }: Props) {
    const t = useTranslations();
    return (
        <>
            <label className=" text-product-dark w-full dark:bg-gray-800 dark:text-gray-400">
                <address className="block">
                    <span className="w-full text-md font-semibold">
                        {address.name} {address.lastname}
                    </span>
                    <span className="text-md w-full">
                        {address.address}, {address.city}, {address.region} -{' '}
                        {address.sub_region}, {address.zipcode},{' '}
                        {`${t('countries.' + address.country)}`}
                    </span>
                </address>
            </label>
        </>
    );
}
