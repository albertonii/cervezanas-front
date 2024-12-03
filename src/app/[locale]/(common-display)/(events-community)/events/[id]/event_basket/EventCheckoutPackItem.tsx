import useEventCartStore from '@/app/store//eventCartStore';
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
    }, [eventCarts]);

    const handleIncreaseCartQuantity = (
        item: IProductPackEventCartItem,
        pack: IProductPack,
    ) => {
        increaseOnePackCartQuantity(eventId, item.product_id, cpId, pack.id);
    };

    const handleDecreaseCartQuantity = (
        item: IProductPackEventCartItem,
        pack: IProductPack,
    ) => {
        decreaseOnePackCartQuantity(eventId, item.product_id, cpId, pack.id);
    };

    const handleRemoveFromCart = (itemId: string, packId: string) => {
        setAnimateRemove(true);
        setTimeout(() => {
            removeFromCart(eventId, itemId, cpId, packId);
        }, 500);
    };

    return (
        <div className="flex flex-col md:flex-row items-center bg-white dark:bg-gray-900 rounded-lg shadow p-4 mb-6">
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

                    {/* Product Type Beer */}
                    {productWithInfo.type === Type.BEER &&
                        productWithInfo.beers && (
                            <div className="flex flex-col items-start justify-start space-y-2">
                                <div className="flex items-center gap-2">
                                    <Label size="small" color="gray">
                                        {t('aroma')}:{' '}
                                    </Label>

                                    <Label size="small" color="black">
                                        {t(`${productWithInfo.beers?.aroma}`)}
                                    </Label>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Label size="small" color="gray">
                                        {t('family')}:{' '}
                                    </Label>

                                    <Label size="small" color="black">
                                        {t(`${productWithInfo.beers?.family}`)}
                                    </Label>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Label size="small" color="gray">
                                        {t('fermentation')}:{' '}
                                    </Label>

                                    <Label size="small" color="black">
                                        {t(
                                            `${productWithInfo.beers?.fermentation}`,
                                        )}
                                    </Label>
                                </div>
                            </div>
                        )}
                </div>

                <div className="flex w-full flex-col items-center justify-between space-y-2 sm:flex-row sm:space-x-8">
                    <div className="flex w-full items-center justify-between space-x-2 justify-center">
                        <Label color="black" size="large">
                            {formatCurrency(pack.price)}
                            {/* <span className="text-red-300 line-through">
                                {' '}
                                45.00€
                            </span> */}
                        </Label>

                        <div className="text-base leading-6 text-gray-800 dark:text-white xl:text-lg mt-6 flex w-full justify-between space-x-2">
                            <MarketCartButtons
                                quantity={packQuantity}
                                item={productPack}
                                handleIncreaseCartQuantity={() =>
                                    handleIncreaseCartQuantity(
                                        productPack,
                                        pack,
                                    )
                                }
                                handleDecreaseCartQuantity={() =>
                                    handleDecreaseCartQuantity(
                                        productPack,
                                        pack,
                                    )
                                }
                                handleRemoveFromCart={() =>
                                    handleRemoveFromCart(
                                        productPack.id,
                                        pack.id,
                                    )
                                }
                                displayDeleteButton={true}
                            />
                        </div>
                    </div>

                    <div className="flex w-full items-center justify-between space-x-2">
                        <Label size="xlarge" font="semibold">
                            {formatCurrency(pack.price * packQuantity)}
                        </Label>
                    </div>
                </div>
            </div>
        </div>
    );
}
