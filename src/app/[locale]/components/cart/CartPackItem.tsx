'use client';

import MarketCartButtons from './MarketCartButtons';
import DisplayImageProduct from '../ui/DisplayImageProduct';
import { useState } from 'react';
import { SupabaseProps } from '@/constants';
import { useTranslations } from 'next-intl';
import { formatCurrency } from '@/utils/formatCurrency';
import { useShoppingCart } from '../../../context/ShoppingCartContext';
import { IProductPack, IProductPackCartItem } from '@/lib//types/types';

type Props = {
    pack: IProductPack;
    item: IProductPackCartItem;
};

export function CartPackItem({ item, pack }: Props) {
    const t = useTranslations();
    const [animateRemove, setAnimateRemove] = useState(false);

    const {
        removeFromCart,
        increaseOnePackCartQuantity,
        decreaseOnePackCartQuantity,
    } = useShoppingCart();

    const handleIncreaseCartQuantity = () => {
        increaseOnePackCartQuantity(item.product_id, pack.id);
    };

    const handleDecreaseCartQuantity = () => {
        decreaseOnePackCartQuantity(item.product_id, pack.id);
    };

    const handleRemoveFromCart = () => {
        setAnimateRemove(true);
        setTimeout(() => {
            removeFromCart(item.product_id, pack.id);
        }, 500);
    };

    const formattedPrice = (packPrice: number) =>
        formatCurrency(packPrice ?? 0);

    return (
        <>
            {pack && (
                <>
                    <div
                        className={`flex flex-row ${
                            animateRemove && 'animate-ping overflow-hidden '
                        }`}
                        data-testid="cart-pack-item"
                    >
                        <>
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <DisplayImageProduct
                                    width={240}
                                    height={200}
                                    imgSrc={
                                        SupabaseProps.BASE_PRODUCTS_URL +
                                        decodeURIComponent(pack.img_url)
                                    }
                                    alt={'Cart Item display image'}
                                    class="h-full w-full object-cover object-center"
                                    data-testid="cart-item-image"
                                />
                            </div>

                            <div className="ml-4 flex flex-1 flex-col">
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                    <p className="md:text-md mt-1 text-gray-500 lg:text-lg">
                                        {pack.name}
                                    </p>

                                    <span>
                                        <p className="ml-4">
                                            {formattedPrice(pack.price)}
                                        </p>
                                    </span>
                                </div>

                                <div className="flex flex-col">
                                    {t('product_pack_name')}:
                                    <span>{pack.name}</span>
                                </div>

                                <div className="flex flex-1 items-end justify-between text-sm">
                                    <p className="text-gray-500">
                                        {t('quantity')} {pack.quantity}
                                    </p>

                                    <MarketCartButtons
                                        quantity={pack.quantity}
                                        item={item}
                                        handleIncreaseCartQuantity={() =>
                                            handleIncreaseCartQuantity()
                                        }
                                        handleDecreaseCartQuantity={() =>
                                            handleDecreaseCartQuantity()
                                        }
                                        handleRemoveFromCart={() =>
                                            handleRemoveFromCart()
                                        }
                                        displayDeleteButton={true}
                                    />
                                </div>
                            </div>
                        </>
                    </div>
                </>
            )}
        </>
    );
}
