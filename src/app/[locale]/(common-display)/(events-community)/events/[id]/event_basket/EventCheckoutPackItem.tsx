import useEventCartStore from '@/app/store/eventCartStore';
import MarketCartButtons from '@/app/[locale]/components/cart/MarketCartButtons';
import DisplayImageProduct from '@/app/[locale]/components/ui/DisplayImageProduct';
import Label from '@/app/[locale]/components/ui/Label';
import React, { useEffect, useState } from 'react';
import { Type } from '@/lib/productEnum';
import { useTranslations } from 'next-intl';
import { SupabaseProps } from '@/constants';
import { formatCurrency } from '@/utils/formatCurrency';
import {
    IProduct,
    IProductPack,
    IProductPackEventCartItem,
} from '@/lib/types/types';

const BASE_PRODUCTS_URL = SupabaseProps.BASE_PRODUCTS_URL;

interface Props {
    eventId: string;
    productPack: IProductPackEventCartItem;
    productWithInfo: IProduct;
    pack: IProductPack;
}

export default function EventCheckoutPackItem({
    eventId,
    productPack,
    productWithInfo,
    pack,
}: Props) {
    const t = useTranslations();
    const cpId = productPack.cp_id;
    const [animateRemove, setAnimateRemove] = useState(false);
    const [packQuantity, setPackQuantity] = React.useState(0);

    const {
        eventCarts,
        getPackQuantity,
        removeFromCart,
        increaseOnePackCartQuantity,
        decreaseOnePackCartQuantity,
    } = useEventCartStore();

    useEffect(() => {
        setPackQuantity(
            getPackQuantity(eventId, pack.product_id, cpId, pack.id),
        );
    }, [eventCarts, eventId, pack.product_id, cpId, pack.id, getPackQuantity]);

    const handleIncreaseCartQuantity = () => {
        increaseOnePackCartQuantity(
            eventId,
            productPack.product_id,
            cpId,
            pack.id,
        );
    };

    const handleDecreaseCartQuantity = () => {
        decreaseOnePackCartQuantity(
            eventId,
            productPack.product_id,
            cpId,
            pack.id,
        );
    };

    const handleRemoveFromCart = () => {
        setAnimateRemove(true);
        setTimeout(() => {
            removeFromCart(eventId, productPack.product_id, cpId, pack.id);
        }, 500);
    };

    return (
        <div
            className={`bg-white dark:bg-gray-800 rounded-lg shadow p-2 sm:p-3 
            transition-opacity ${
                animateRemove ? 'opacity-0 translate-x-4' : ''
            }`}
        >
            {/* Contenedor principal flexible */}
            <div
                className="flex flex-wrap items-center 
                           justify-center gap-2 
                           sm:justify-start sm:gap-3 
                           md:gap-4"
            >
                {/* Imagen del producto */}
                <figure className="flex-shrink-0">
                    <DisplayImageProduct
                        imgSrc={
                            BASE_PRODUCTS_URL + decodeURIComponent(pack.img_url)
                        }
                        alt={pack.name}
                        width={600}
                        height={600}
                        class="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 rounded shadow object-cover"
                    />
                </figure>

                {/* Nombre del producto */}
                <Label
                    size="small"
                    color="black"
                    font="semibold"
                    className="truncate max-w-[100px] sm:max-w-[150px] md:max-w-[200px]"
                >
                    {pack.name}
                </Label>

                {/* Precio Unitario */}
                <Label
                    color="black"
                    size="small"
                    font="semibold"
                    className="whitespace-nowrap"
                >
                    {formatCurrency(pack.price)}
                </Label>

                {/* Botones de cantidad */}
                <MarketCartButtons
                    quantity={packQuantity}
                    item={productPack}
                    handleIncreaseCartQuantity={handleIncreaseCartQuantity}
                    handleDecreaseCartQuantity={handleDecreaseCartQuantity}
                    handleRemoveFromCart={handleRemoveFromCart}
                    displayDeleteButton={true}
                />

                {/* Precio total */}
                <Label
                    size="small"
                    font="semibold"
                    className="whitespace-nowrap"
                >
                    {formatCurrency(pack.price * packQuantity)}
                </Label>

                {/* Información adicional (sólo en pantallas medianas o mayores) */}
                {productWithInfo.type === Type.BEER && productWithInfo.beers && (
                    <div className="hidden md:flex flex-row flex-wrap gap-2 items-center w-full mt-1 md:mt-2">
                        <div className="flex items-center gap-1">
                            <Label size="xsmall" color="gray">
                                {t('aroma')}:
                            </Label>
                            <Label size="xsmall" color="black">
                                {t(`${productWithInfo.beers?.aroma}`)}
                            </Label>
                        </div>
                        <div className="flex items-center gap-1">
                            <Label size="xsmall" color="gray">
                                {t('family')}:
                            </Label>
                            <Label size="xsmall" color="black">
                                {t(`${productWithInfo.beers?.family}`)}
                            </Label>
                        </div>
                        <div className="flex items-center gap-1">
                            <Label size="xsmall" color="gray">
                                {t('fermentation')}:
                            </Label>
                            <Label size="xsmall" color="black">
                                {t(`${productWithInfo.beers?.fermentation}`)}
                            </Label>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
