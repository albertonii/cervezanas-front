import BillingAddressItem from './BillingAddressItemInfo';
import ShippingAddressItem from './ShippingAddressItemInfo';
import React from 'react';
import { useTranslations } from 'next-intl';
import { IAddress, IBillingInfo } from '@/lib//types/types';
import { useShoppingCart } from '@/app/context/ShoppingCartContext';

interface Props {
    billingAddresses: IBillingInfo[];
    shippingAddresses: IAddress[];
}

const ShoppingBasketAddressesSummary = ({
    billingAddresses,
    shippingAddresses,
}: Props) => {
    const t = useTranslations();

    const { selectedShippingAddress, selectedBillingAddress } =
        useShoppingCart();

    return (
        <div className="mt-6 flex flex-shrink-0 flex-col items-start justify-start space-y-6 pb-4 md:mt-0">
            <address className="mb-6 flex w-full flex-col space-y-4 bg-gray-50 py-6 dark:bg-gray-800">
                <h3 className="text-xl font-semibold leading-5 text-gray-800 dark:text-white">
                    {t('addresses')}
                </h3>

                <div className="flex flex-col items-start justify-start space-y-4 md:space-y-3 lg:space-x-8 xl:flex-col xl:space-x-0 xl:space-y-8">
                    <div className="flex flex-col items-start justify-center space-y-4 md:justify-start xl:mt-8">
                        <p className=" text-base font-semibold leading-4 text-gray-800 dark:text-white md:text-left">
                            {t('shipping_address')}
                        </p>

                        <div className="w-48 text-start text-sm leading-5 text-gray-600 dark:text-gray-300 md:text-left lg:w-full xl:w-48">
                            {shippingAddresses?.map((address) => {
                                if (
                                    address.id === selectedShippingAddress?.id
                                ) {
                                    return (
                                        <div key={address.id}>
                                            <ShippingAddressItem
                                                address={address}
                                            />
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </div>

                    <div className="flex flex-col items-start justify-center space-y-4 md:justify-start">
                        <p className=" text-base font-semibold leading-4 text-gray-800 dark:text-white md:text-left">
                            {t('billing_address')}
                        </p>

                        <div className="w-48 text-start text-sm leading-5 text-gray-600 dark:text-gray-300 md:text-left lg:w-full xl:w-48">
                            {billingAddresses?.map((address) => {
                                if (address.id === selectedBillingAddress?.id)
                                    return (
                                        <div key={address.id}>
                                            <BillingAddressItem
                                                address={address}
                                            />
                                        </div>
                                    );
                            })}
                        </div>
                    </div>
                </div>
            </address>
        </div>
    );
};

export default ShoppingBasketAddressesSummary;
