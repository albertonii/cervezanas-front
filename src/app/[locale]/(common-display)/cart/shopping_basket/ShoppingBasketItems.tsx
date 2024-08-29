import React from 'react';
import EmptyCart from './EmptyCart';
import OrderItems from './OrderItems';
import { useTranslations } from 'next-intl';
import { IProductPackCartItem } from '@/lib/types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

interface Props {
    items: IProductPackCartItem[];
    subtotal: number;
    isShippingCostLoading: boolean;
}

const ShoppingBasketItems = ({
    items,
    subtotal,
    isShippingCostLoading,
}: Props) => {
    const t = useTranslations();

    return (
        <section className="relative w-full space-y-6 p-6 rounded-lg shadow-md bg-gray-50 dark:bg-gray-800">
            <FontAwesomeIcon
                icon={faShoppingCart}
                title={'Shipping Info Icon'}
                className="text-beer-blonde absolute top-4 left-4 lg:-top-1 lg:-left-1 bg-white p-2 rounded-full shadow-lg"
                size="2xl"
            />

            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                {t('customer_s_cart')}
            </h2>

            {items?.length > 0 ? (
                <OrderItems
                    subtotal={subtotal}
                    isShippingCostLoading={isShippingCostLoading}
                />
            ) : (
                <EmptyCart />
            )}
        </section>
    );
};

export default ShoppingBasketItems;
