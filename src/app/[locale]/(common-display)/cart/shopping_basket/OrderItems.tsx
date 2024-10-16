import React, { useMemo } from 'react';
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

    // Memoizamos los items renderizados para mejorar el rendimiento
    const renderedItems = useMemo(
        () =>
            items.map((productPack) => (
                <div key={productPack.id}>
                    <CheckoutItem
                        productPack={productPack}
                        isShippingCostLoading={isShippingCostLoading}
                    />
                </div>
            )),
        [items, isShippingCostLoading],
    );

    return (
        <div
            className={`w-full bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow ${
                isShippingCostLoading ? 'opacity-50' : ''
            }`}
        >
            {items.length > 0 ? (
                <>
                    {renderedItems}

                    {/* Subtotal */}
                    <div className="mt-6 border-t pt-4">
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-medium text-gray-700 dark:text-gray-200">
                                {t('subtotal')}
                            </span>
                            <span className="text-xl font-semibold text-gray-900 dark:text-white">
                                {formatCurrency(subtotal)}
                            </span>
                        </div>
                    </div>
                </>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">
                    {t('no_items_in_cart')}
                </p>
            )}
        </div>
    );
};

export default OrderItems;
