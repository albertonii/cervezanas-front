import MarketCartButtons from '@/app/[locale]/components/cart/MarketCartButtons';
import DisplayImageProduct from '@/app/[locale]/components/ui/DisplayImageProduct';
import React, { useMemo, useState } from 'react';
import { Weight } from 'lucide-react';
import { SupabaseProps } from '@/constants';
import { useTranslations } from 'next-intl';
import { formatCurrency } from '@/utils/formatCurrency';
import { calculateProductPacksWeight } from '@/utils/distribution';
import { useShoppingCart } from '@/app/context/ShoppingCartContext';
import { IProductPack, IProductPackCartItem } from '@/lib/types/types';
import Label from '@/app/[locale]/components/ui/Label';

const BASE_PRODUCTS_URL = SupabaseProps.BASE_PRODUCTS_URL;

interface Props {
    productPack: IProductPackCartItem;
    pack: IProductPack;
}

export default function CheckoutPackItem({ productPack, pack }: Props) {
    const t = useTranslations();

    const [animateRemove, setAnimateRemove] = useState(false);

    const packWeight = useMemo(
        () => calculateProductPacksWeight(productPack),
        [productPack],
    );

    const {
        removeFromCart,
        increaseOnePackCartQuantity,
        decreaseOnePackCartQuantity,
    } = useShoppingCart();

    const handleIncreaseCartQuantity = () => {
        increaseOnePackCartQuantity(productPack.product_id, pack.id);
    };

    const handleDecreaseCartQuantity = () => {
        decreaseOnePackCartQuantity(productPack.product_id, pack.id);
    };

    const handleRemoveFromCart = () => {
        setAnimateRemove(true);
        setTimeout(() => {
            removeFromCart(productPack.product_id, pack.id);
        }, 500);
    };

    return (
        <div className="flex flex-col md:flex-row items-center bg-white dark:bg-gray-900 rounded-lg shadow py-4">
            {/* Imagen del producto */}
            <figure className="w-full md:w-1/3 flex justify-center mb-4 md:mb-0">
                <DisplayImageProduct
                    imgSrc={
                        BASE_PRODUCTS_URL + decodeURIComponent(pack.img_url)
                    }
                    alt={pack.name}
                    width={600}
                    height={600}
                    class="h-24 w-24 md:h-32 md:w-32 lg:h-40 lg:w-40 rounded shadow"
                />
            </figure>

            {/* Detalles del producto */}
            <div className="w-full md:w-2/3 flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <Label size="large" color="black" font="semibold">
                        {pack.name}
                    </Label>

                    {/* Peso del pack */}
                    <div className="flex items-center mt-2">
                        <Weight className="text-gray-600 dark:text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {`${packWeight}${t('g')}`}
                        </span>
                    </div>
                </div>

                {/* Controles de cantidad y precio */}
                <div className="mt-4 md:mt-0 flex flex-col items-center md:items-end">
                    <MarketCartButtons
                        quantity={pack.quantity}
                        item={productPack}
                        handleIncreaseCartQuantity={handleIncreaseCartQuantity}
                        handleDecreaseCartQuantity={handleDecreaseCartQuantity}
                        handleRemoveFromCart={handleRemoveFromCart}
                        displayDeleteButton={true}
                    />
                    <div className="mt-2 text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatCurrency(pack.price)}/{t('unit')}
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(pack.price * pack.quantity)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
