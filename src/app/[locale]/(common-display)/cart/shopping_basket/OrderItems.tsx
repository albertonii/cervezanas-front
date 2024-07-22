import React from 'react';
import { useTranslations } from 'next-intl';
import { CheckoutItem } from './CheckoutItem';
import { formatCurrency } from '@/utils/formatCurrency';
import { useShoppingCart } from '@/app/context/ShoppingCartContext';

interface Props {
    subtotal: number;
    isShippingCostLoading: boolean;
}

const OrderItems = ({ subtotal, isShippingCostLoading }: Props) => {
    const t = useTranslations();

    const { items } = useShoppingCart();

    return (
        <div
            className={`
                ${isShippingCostLoading && 'opacity-50'}
                w-full dark:bg-gray-800 bg-white p-4 rounded-lg shadow-md
            `}
        >
            {items.map((productPack) => (
                <div key={productPack.id}>
                    <CheckoutItem
                        productPack={productPack}
                        isShippingCostLoading={isShippingCostLoading}
                    />
                </div>
            ))}

            {/* Subtotal */}
            <div className="mt-4 flex w-full flex-row items-center justify-between">
                <div className="flex flex-col items-start justify-start space-y-2">
                    <p className="text-2xl text-gray-500">
                        {t('subtotal')}
                        <span className="ml-6 font-semibold text-gray-800">
                            {formatCurrency(subtotal)}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderItems;
