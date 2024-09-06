'use client';

import Billing from './Billing';
import Shipping from './Shipping';
import React from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { InfoTooltip } from '@/app/[locale]/components/common/InfoTooltip';

interface Props {
    formShipping: UseFormReturn<any, any>;
    formBilling: UseFormReturn<any, any>;
}

export default function ShippingBillingContainer({
    formShipping,
    formBilling,
}: Props) {
    const t = useTranslations();

    return (
        <section className="w-full flex flex-col items-center space-y-2 bg-gray-50 p-6 rounded-lg shadow-md dark:bg-gray-800">
            <div className="flex">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                    {t('shipping_and_billing_info')}
                </h2>

                <InfoTooltip
                    content={`${t('tooltips.shipping_logic_selected_info')}`}
                    delay={0}
                    width={'500px'}
                    direction={'top'}
                />
            </div>

            <div className="space-y-4 lg:space-y-8">
                {/* Shipping */}
                <Shipping formShipping={formShipping} />

                {/* Billing */}
                <Billing formBilling={formBilling} />
            </div>
        </section>
    );
}
