import BillingAddressItem from './BillingAddressItemInfo';
import ShippingAddressItem from './ShippingAddressItemInfo';
import React from 'react';
import { useTranslations } from 'next-intl';
import { useShoppingCart } from '@/app/context/ShoppingCartContext';

const ShoppingBasketAddressesSummary = () => {
    const t = useTranslations();

    const { selectedShippingAddress, selectedBillingAddress } =
        useShoppingCart();

    return (
        <section className="p-2 mt-6 flex w-full flex-col items-start justify-start lg:space-y-4 bg-gray-50 py-6 dark:bg-gray-800 md:mt-0 rounded-lg">
            <h3 className="text-xl font-semibold leading-5 text-gray-800 dark:text-white">
                {t('addresses')}
            </h3>

            <div className="flex flex-col items-start justify-start space-y-4 md:space-y-3 lg:space-x-8 xl:flex-col xl:space-x-0 xl:space-y-8">
                <div className="flex flex-col items-start justify-center space-y-4 md:justify-start xl:mt-2">
                    <p className=" text-base font-semibold leading-4 text-gray-800 dark:text-white md:text-left">
                        {t('shipping_address')}
                    </p>

                    {selectedShippingAddress && (
                        <address className="w-48 text-start text-sm leading-5 text-gray-600 dark:text-gray-300 md:text-left w-full xl:w-48">
                            <div key={selectedShippingAddress.id}>
                                <ShippingAddressItem
                                    address={selectedShippingAddress}
                                />
                            </div>
                        </address>
                    )}
                </div>

                <div className="flex flex-col items-start justify-center space-y-4 md:justify-start">
                    <p className=" text-base font-semibold leading-4 text-gray-800 dark:text-white md:text-left">
                        {t('billing_address')}
                    </p>

                    {selectedBillingAddress && (
                        <address className="w-48 text-start text-sm leading-5 text-gray-600 dark:text-gray-300 md:text-left w-full xl:w-48">
                            <div key={selectedBillingAddress.id}>
                                <BillingAddressItem
                                    address={selectedBillingAddress}
                                />
                            </div>
                        </address>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ShoppingBasketAddressesSummary;
