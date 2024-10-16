'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import Shipping from './Shipping';
import Billing from './Billing';
import { InfoTooltip } from '@/app/[locale]/components/ui/InfoTooltip';

interface Props {
    formShipping: UseFormReturn<any>;
    formBilling: UseFormReturn<any>;
}

export default function ShippingBillingContainer({
    formShipping,
    formBilling,
}: Props) {
    const t = useTranslations();

    return (
        <section className="w-full p-6 bg-white dark:bg-gray-900 rounded-lg shadow space-y-6">
            <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                    {t('shipping_and_billing_info')}
                </h2>
                <InfoTooltip
                    content={t('tooltips.shipping_logic_selected_info')}
                    delay={0}
                    width="400px"
                    direction="top"
                />
            </div>

            <div className="space-y-8">
                {/* Shipping */}
                <Shipping formShipping={formShipping} />

                {/* Billing */}
                <Billing formBilling={formBilling} />
            </div>
        </section>
    );
}
