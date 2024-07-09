import { useTranslations } from 'next-intl';
import React from 'react';
import { IAddress, IBillingInfo } from '../../../../../lib/types/types';
import { formatCurrency } from '../../../../../utils/formatCurrency';
import Button from '../../../components/common/Button';
import ShoppingBasketAddressesSummary from './ShoppingBasketAddressesSummary';

interface Props {
    canMakeThePayment: boolean;
    subtotal: number;
    deliveryCost: number;
    tax: number;
    total: number;
    billingAddresses: IBillingInfo[];
    shippingAddresses: IAddress[];
    selectedBillingAddress: string;
    selectedShippingAddress: string;
    onSubmit: () => void;
}

const ShoppingBasketOrderSummary = ({
    canMakeThePayment,
    subtotal,
    deliveryCost,
    tax,
    total,
    billingAddresses,
    shippingAddresses,
    selectedBillingAddress,
    selectedShippingAddress,
    onSubmit,
}: Props) => {
    const t = useTranslations();

    return (
        <div className="border-product-softBlonde flex w-full flex-col items-center justify-between gap-4 border bg-gray-50 px-4 py-6 dark:bg-gray-800 md:items-start md:p-6 xl:w-96 xl:p-8">
            <h3 className="text-xl font-semibold leading-5 text-gray-800 dark:text-white">
                {t('customer')}
            </h3>
            <div className="flex h-full w-full flex-col items-stretch justify-start md:flex-col lg:space-x-8 xl:flex-col xl:space-x-0">
                {/* Summary */}
                <div className="flex flex-shrink-0 flex-col items-start justify-start">
                    <div className="flex w-full flex-col space-y-6 bg-gray-50 dark:bg-gray-800">
                        <h3 className="text-xl font-semibold leading-5 text-gray-800 dark:text-white">
                            {t('summary')}
                        </h3>
                        <div className="flex w-full flex-col items-center justify-center space-y-6 border-b border-gray-200 pb-4">
                            <div className="flex w-full justify-between">
                                <p className="text-base leading-4 text-gray-800 dark:text-white">
                                    {t('subtotal')}
                                </p>
                                <p className="text-base leading-4 text-gray-600 dark:text-gray-300">
                                    {formatCurrency(subtotal)}
                                </p>
                            </div>
                            <div className="flex w-full items-center justify-between">
                                <p className="text-base leading-4 text-gray-800 dark:text-white">
                                    {t('shipping')}
                                </p>
                                <p className="text-base leading-4 text-gray-600 dark:text-gray-300">
                                    {formatCurrency(deliveryCost)}
                                </p>
                            </div>
                            {/* taxes */}
                            <div className="flex w-full items-center justify-between">
                                <p className="text-base leading-4 text-gray-800 dark:text-white">
                                    {t('tax')}
                                </p>
                                <p className="text-base leading-4 text-gray-600 dark:text-gray-300">
                                    {formatCurrency(tax)}
                                </p>
                            </div>
                        </div>
                        <div className="flex w-full items-start justify-between">
                            <div className="flex flex-col items-start">
                                <p className="text-base font-semibold leading-4 text-gray-800 dark:text-white">
                                    {t('total')}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    ({t('with_taxes_included')})
                                </p>
                            </div>
                            <p className="text-base font-semibold leading-4 text-gray-600 dark:text-gray-300">
                                {formatCurrency(total)}
                            </p>
                        </div>
                        {/* Proceed to pay */}
                        <div className="flex w-full items-center justify-center md:items-start md:justify-start">
                            <Button
                                large
                                primary
                                class="font-semibold"
                                title={t('proceed_to_pay')}
                                disabled={!canMakeThePayment}
                                onClick={onSubmit}
                            >
                                {t('proceed_to_pay')}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Addresses */}
                {billingAddresses && shippingAddresses && (
                    <ShoppingBasketAddressesSummary
                        billingAddresses={billingAddresses}
                        selectedBillingAddress={selectedBillingAddress}
                        shippingAddresses={shippingAddresses}
                        selectedShippingAddress={selectedShippingAddress}
                    />
                )}
            </div>
        </div>
    );
};

export default ShoppingBasketOrderSummary;
