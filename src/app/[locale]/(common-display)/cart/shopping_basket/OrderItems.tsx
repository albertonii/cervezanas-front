import React from 'react';
import { useTranslations } from 'next-intl';
import { CheckoutItem } from './CheckoutItem';
import { formatCurrency } from '../../../../../utils/formatCurrency';
import { useShoppingCart } from '../../../../context/ShoppingCartContext';

interface Props {
    selectedShippingAddress: string;
    handleDeliveryCost: (deliveryCost: number) => void;
    subtotal: number;
    isShippingCostLoading: boolean;
}

const OrderItems = ({
    selectedShippingAddress,
    handleDeliveryCost,
    subtotal,
    isShippingCostLoading,
}: Props) => {
    const t = useTranslations();

    const { items } = useShoppingCart();

    return (
        <div
            className={`
                ${isShippingCostLoading && 'opacity-50'}
                w-full
            `}
        >
            {items.map((productPack) => (
                <div key={productPack.id}>
                    <CheckoutItem
                        productPack={productPack}
                        selectedShippingAddress={selectedShippingAddress}
                        handleDeliveryCost={handleDeliveryCost}
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
