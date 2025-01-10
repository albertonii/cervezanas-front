import Label from '@/app/[locale]/components/ui/Label';
import MarketCartButtons from '@/app/[locale]/components/cart/MarketCartButtons';
import DisplayImageProduct from '@/app/[locale]/components/ui/DisplayImageProduct';
import React, { useMemo, useState } from 'react';
import { Weight } from 'lucide-react';
import { SupabaseProps } from '@/constants';
import { useTranslations } from 'next-intl';
import { formatCurrency } from '@/utils/formatCurrency';
import { useShoppingCart } from '@/app/context/ShoppingCartContext';
import { IProductPack, IProductPackCartItem } from '@/lib/types/types';
import { calculateProductPacksWeight } from '@/app/services/shippingServices';

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
        <div
            className={`
        grid gap-4
        bg-white dark:bg-gray-900 
        rounded-lg shadow 
        p-4
        // Para móviles (1 columna) 
        grid-cols-1
        // Para pantallas md en adelante (3 columnas)
        md:grid-cols-3
      `}
        >
            {/* Imagen del producto */}
            <figure className="flex justify-center md:justify-start">
                <DisplayImageProduct
                    imgSrc={
                        BASE_PRODUCTS_URL + decodeURIComponent(pack.img_url)
                    }
                    alt={pack.name}
                    width={600}
                    height={600}
                    class="h-24 w-24 md:h-32 md:w-32 rounded shadow"
                />
            </figure>

            {/* Detalles del producto */}
            <div className="flex flex-col justify-center">
                <Label
                    size="large"
                    color="black"
                    font="semibold"
                    className="text-center md:text-left"
                >
                    {pack.name}
                </Label>

                {/* Peso del pack */}
                <div className="flex items-center justify-center md:justify-start mt-2">
                    <Weight className="text-gray-600 dark:text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {`${packWeight}${t('g')}`}
                    </span>
                </div>
            </div>

            {/* Controles de cantidad y precio */}
            <div className="flex flex-col items-center md:items-end justify-center">
                <MarketCartButtons
                    quantity={pack.quantity}
                    item={productPack}
                    handleIncreaseCartQuantity={handleIncreaseCartQuantity}
                    handleDecreaseCartQuantity={handleDecreaseCartQuantity}
                    handleRemoveFromCart={handleRemoveFromCart}
                    displayDeleteButton={true}
                />

                <div className="mt-2 text-center md:text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatCurrency(pack.price)}/{t('unit')}
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(pack.price * pack.quantity)}
                    </p>
                </div>
            </div>
        </div>
    );
}
