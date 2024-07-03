import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { formatCurrency } from '../../../../../utils/formatCurrency';
import { useShoppingCart } from '../../../../context/ShoppingCartContext';
import { CheckoutItem } from './CheckoutItem';

interface Props {
    selectedShippingAddress: string;
    handleDeliveryCost: (deliveryCost: number) => void;
    subtotal: number;
}

const OrderItems = ({
    selectedShippingAddress,
    handleDeliveryCost,
    subtotal,
}: Props) => {
    const t = useTranslations();

    const { items } = useShoppingCart();

    return (
        <div className="w-full">
            {items.map((productPack) => (
                <div key={productPack.id}>
                    <CheckoutItem
                        productPack={productPack}
                        selectedShippingAddress={selectedShippingAddress}
                        handleDeliveryCost={handleDeliveryCost}
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
