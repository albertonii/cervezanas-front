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

            <div className="flex w-full items-center justify-between bg-white p-4 rounded-lg shadow-md dark:bg-gray-700">
                <div className="flex items-center space-x-4">
                    <figure className="h-10 w-10">
                        <Image
                            width={40}
                            height={40}
                            className="h-full w-full"
                            alt="logo"
                            src="https://i.ibb.co/L8KSdNQ/image-3.png"
                            loader={() =>
                                'https://i.ibb.co/L8KSdNQ/image-3.png'
                            }
                        />
                    </figure>
                    <div className="flex flex-col">
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">
                            DPD Delivery
                        </p>
                        <span className="text-sm text-gray-500 dark:text-gray-300">
                            {t('delivery_24h')}
                        </span>
                    </div>
                </div>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    {formatCurrency(0)}
                </p>
            </div>

            <div className="flex w-full justify-center">
                <Button
                    title={t('view_carrier_details') ?? 'View details'}
                    accent
                    medium
                    class="w-full text-base font-medium"
                >
                    {t('view_carrier_details')}
                </Button>
            </div>
        </section>
    );
}
