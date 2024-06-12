'use client';

import Image from 'next/image';
import Billing from './Billing';
import Shipping from './Shipping';
import { useTranslations } from 'next-intl';
import React, { ComponentProps } from 'react';
import { UseFormReturn } from 'react-hook-form';
import Button from '../../../components/common/Button';
import { IBillingAddress, IAddress } from '../../../../../lib/types/types';
import { formatCurrency } from '../../../../../utils/formatCurrency';
import CarrierDetails from './CarrierDetails';
import PromotionCode from './PromotionCode';

interface Props {
    shippingAddresses: IAddress[];
    billingAddresses: IBillingAddress[];
    handleOnClickShipping: ComponentProps<any>;
    handleOnClickBilling: ComponentProps<any>;
    selectedShippingAddress: string;
    selectedBillingAddress: string;
    formShipping: UseFormReturn<any, any>;
    formBilling: UseFormReturn<any, any>;
}

export default function ShippingBillingContainer({
    shippingAddresses,
    billingAddresses,
    selectedShippingAddress,
    selectedBillingAddress,
    handleOnClickShipping,
    handleOnClickBilling,
    formShipping,
    formBilling,
}: Props) {
    const t = useTranslations();

    return (
        <section className="w-full flex flex-col items-center space-y-6 bg-gray-50 p-6 rounded-lg shadow-md dark:bg-gray-800">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                {t('shipping_and_billing_info')}
            </h2>

            {/* Shipping */}
            <Shipping
                formShipping={formShipping}
                shippingAddresses={shippingAddresses}
                handleOnClickShipping={handleOnClickShipping}
                selectedShippingAddress={selectedShippingAddress}
            />

            {/* Billing */}
            <Billing
                formBilling={formBilling}
                selectedBillingAddress={selectedBillingAddress}
                billingAddresses={billingAddresses}
                handleOnClickBilling={handleOnClickBilling}
            />

            {/* Promotion Code  */}
            <PromotionCode />

            {/* <CarrierDetails /> */}
        </section>
    );
}
