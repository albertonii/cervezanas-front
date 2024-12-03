import React from 'react';
import EmptyCart from './EmptyCart';
import OrderItems from './OrderItems';
import { useTranslations } from 'next-intl';
import { IProductPackCartItem } from '@/lib/types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Title from '@/app/[locale]/components/ui/Title';

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
        <section className="relative w-full p-6 bg-white dark:bg-gray-900 rounded-lg shadow space-y-6">
            <FontAwesomeIcon
                icon={faShoppingCart}
                title={'Shipping Info Icon'}
                className="text-beer-blonde absolute top-4 left-4 lg:-top-1 lg:-left-1 bg-white p-2 rounded-full shadow-lg"
                size="2xl"
            />

            <Title size="large" color="black" fontFamily="NexaRust-sans">
                {t('customer_s_cart')}
            </Title>

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
