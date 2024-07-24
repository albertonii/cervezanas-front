import React from 'react';
import { useTranslations } from 'next-intl';
import { IBillingInfo } from '@/lib/types/types';

interface Props {
    billingInfo: IBillingInfo;
}

const BillingInformationBox = ({ billingInfo }: Props) => {
    const t = useTranslations();

    return (
        <dl className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-2 md:gap-x-8 lg:col-span-6">
            <address>
                <dt className="font-medium text-gray-900">
                    {t('billing_address')}
                </dt>

                <dd className="mt-3 text-gray-500">
                    <span className="block font-semibold">
                        {billingInfo.name} {billingInfo.lastname}
                    </span>

                    <span className="block">
                        {billingInfo.address}, {billingInfo.city},
                        {billingInfo.zipcode},{billingInfo.sub_region} -{' '}
                        {billingInfo.region}, {billingInfo.country}
                    </span>
                </dd>
            </address>
        </dl>
    );
};

export default BillingInformationBox;
