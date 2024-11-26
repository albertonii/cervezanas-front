import Title from '@/app/[locale]/components/ui/Title';
import Label from '@/app/[locale]/components/ui/Label';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import ShoppingBasketAddressesSummary from './ShoppingBasketAddressesSummary';
import React from 'react';
import { useTranslations } from 'next-intl';
import { formatCurrency } from '@/utils/formatCurrency';
import { useShoppingCart } from '@/app/context/ShoppingCartContext';

interface Props {
    subtotal: number;
    deliveryCost: number;
    total: number;
    checkCanDeliveryToAddress: () => void;
    onSubmit: () => void;
}

const ShoppingBasketOrderSummary = ({
    subtotal,
    deliveryCost,
    total,
    checkCanDeliveryToAddress,
    onSubmit,
}: Props) => {
    const t = useTranslations();

    const {
        canMakeThePayment,
        selectedShippingAddress,
        needsToCheckDelivery,
        discountAmount,
        promoCode,
    } = useShoppingCart();

    return (
        <div className="flex h-full w-full flex-col items-stretch justify-start md:flex-col lg:space-x-8 xl:flex-col xl:space-x-0 gap-4 dark:bg-gray-900 rounded-lg shadow bg-gray-50 px-4 py-6 dark:bg-gray-800 md:items-start md:p-6 xl:w-96 xl:p-4">
            {/* Summary */}
            <div className="rounded-lg p-2 flex flex-shrink-0 w-full items-start justify-start flex-col space-y-6 bg-gray-50 dark:bg-gray-800">
                <Title>{t('summary')}</Title>

                <div className="flex w-full flex-col items-center justify-center space-y-6 border-b border-gray-200 pb-4">
                    <div className="flex w-full justify-between">
                        <Label>{t('subtotal')}</Label>
                        <Label>{formatCurrency(subtotal)}</Label>
                    </div>
                    <div className="flex w-full items-center justify-between">
                        <Label>{t('shipping')}</Label>
                        <Label>{formatCurrency(deliveryCost)}</Label>
                    </div>

                    {promoCode && (
                        <div className="flex w-full items-center justify-between">
                            <p className="text-base leading-4 text-gray-800 dark:text-white">
                                {t('discount')} "{promoCode}"
                            </p>
                            <p className="text-base leading-4 text-gray-600 dark:text-gray-300">
                                -{formatCurrency(discountAmount)}
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex w-full items-start justify-between">
                    <div className="flex flex-col items-start">
                        <Label>{t('total')}</Label>
                        <Label>({t('with_taxes_included')})</Label>
                    </div>
                    <Label>{formatCurrency(total)}</Label>
                </div>

                {/* Proceed to pay */}
                <div className="flex flex-col w-full items-center justify-center md:items-start md:justify-start gap-2">
                    <Button
                        large
                        primary
                        title={t('check_can_delivery_to_address')}
                        onClick={checkCanDeliveryToAddress}
                        disabled={
                            !selectedShippingAddress || !selectedShippingAddress
                        }
                        warningIfDisabled={t(
                            'need_to_select_shipping_and_billing_address',
                        )}
                    >
                        {t('check_can_delivery_to_address')}
                    </Button>

                    <Button
                        large
                        primary
                        title={t('proceed_to_pay')}
                        disabled={!canMakeThePayment || needsToCheckDelivery}
                        onClick={onSubmit}
                    >
                        {t('proceed_to_pay')}
                    </Button>
                </div>
            </div>

            {/* Addresses */}
            <ShoppingBasketAddressesSummary />
        </div>
    );
};

export default ShoppingBasketOrderSummary;
