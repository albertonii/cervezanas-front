import React, { useEffect, useState } from 'react';
import DisplayImageProduct from '@/app/[locale]/components/common/DisplayImageProduct';
import MarketCartButtons from '@/app/[locale]/components/common/MarketCartButtons';
import { SupabaseProps } from '@/constants';
import {
    IProduct,
    IProductPack,
    IProductPackCartItem,
} from '@/lib//types/types';
import { formatCurrency } from '@/utils/formatCurrency';
import { Type } from '@/lib//productEnum';
import { useTranslations } from 'next-intl';
import { useShoppingCart } from '@/app/context/ShoppingCartContext';
import { calculateProductPacksWeight } from '../actions';
import Spinner from '@/app/[locale]/components/common/Spinner';

const BASE_PRODUCTS_URL = SupabaseProps.BASE_PRODUCTS_URL;

interface Props {
    productPack: IProductPackCartItem;
    productWithInfo: IProduct;
    pack: IProductPack;
}

export default function CheckoutPackItem({
    productPack,
    productWithInfo,
    pack,
}: Props) {
    const t = useTranslations();

    const [animateRemove, setAnimateRemove] = useState(false);
    const [packWeight, setPackWeight] = useState(0);
    const [isLoadingWeightCalculations, setIsLoadingWeightCalculations] =
        useState(false);

    useEffect(() => {
        setIsLoadingWeightCalculations(true);
        const getPackWeight = async () => {
            setPackWeight(await calculateProductPacksWeight(productPack));

            setIsLoadingWeightCalculations(false);
        };

        getPackWeight();
    }, [productPack]);

    const {
        removeFromCart,
        increaseOnePackCartQuantity,
        decreaseOnePackCartQuantity,
    } = useShoppingCart();

    const handleIncreaseCartQuantity = (
        item: IProductPackCartItem,
        pack: IProductPack,
    ) => {
        increaseOnePackCartQuantity(item.product_id, pack.id);
    };

    const handleDecreaseCartQuantity = (
        item: IProductPackCartItem,
        pack: IProductPack,
    ) => {
        decreaseOnePackCartQuantity(item.product_id, pack.id);
    };

    const handleRemoveFromCart = (itemId: string, packId: string) => {
        setAnimateRemove(true);
        setTimeout(() => {
            removeFromCart(itemId, packId);
        }, 500);
    };

    return (
        <section
            className={`${
                animateRemove ? 'animate-ping' : ''
            } mt-4 flex w-full flex-col items-start justify-start border-b border-gray-200 dark:border-gray-700 md:mt-6 md:flex-row md:items-center md:space-x-6 xl:space-x-8`}
        >
            <figure className="pb-2 md:pb-4">
                <DisplayImageProduct
                    imgSrc={
                        BASE_PRODUCTS_URL + decodeURIComponent(pack.img_url)
                    }
                    alt={pack.name}
                    width={600}
                    height={600}
                    class="h-24 w-24 rounded shadow-xl md:h-32 md:w-32 lg:h-40 lg:w-40"
                />
            </figure>

            <article className="flex w-full flex-col justify-between space-y-4 md:flex-row md:space-y-0 items-center">
                <div className="flex w-full flex-col items-start justify-start space-y-2">
                    <span className="text-xl font-semibold leading-6 text-gray-800 dark:text-white xl:text-2xl">
                        {pack.name}
                    </span>

                    {productWithInfo.type === Type.BEER &&
                        productWithInfo.beers && (
                            <div className="flex flex-col items-start justify-start space-y-2">
                                <p className="text-sm leading-none text-gray-800 dark:text-white">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {t('aroma')}:{' '}
                                    </span>
                                    {t(`${productWithInfo.beers?.aroma}`)}
                                </p>
                                <p className="text-sm leading-none text-gray-800 dark:text-white">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {t('family')}:{' '}
                                    </span>
                                    {t(`${productWithInfo.beers?.family}`)}
                                </p>
                                <p className="text-sm leading-none text-gray-800 dark:text-white">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {t('fermentation')}:{' '}
                                    </span>
                                    {t(
                                        `${productWithInfo.beers?.fermentation}`,
                                    )}
                                </p>
                            </div>
                        )}

                    {productWithInfo.type === Type.MERCHANDISING && (
                        <div className="flex flex-col items-start justify-start space-y-2">
                            <p className="text-sm leading-none text-gray-800 dark:text-white">
                                <span className="text-gray-300 dark:text-gray-400"></span>
                            </p>
                            <p className="text-sm leading-none text-gray-800 dark:text-white">
                                <span className="text-gray-300 dark:text-gray-400"></span>
                            </p>
                            <p className="text-sm leading-none text-gray-800 dark:text-white">
                                <span className="text-gray-300 dark:text-gray-400"></span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Peso del pack  */}
                <div className="flex w-full flex-col items-center justify-between space-x-2">
                    <p className="text-base leading-6 text-gray-800 dark:text-white xl:text-lg ">
                        {isLoadingWeightCalculations ? (
                            <Spinner color="beer-blonde" size="small" />
                        ) : (
                            <span>
                                <span className="text-gray-600 dark:text-gray-400">
                                    {t('weight')}:{' '}
                                </span>

                                <span className="text-gray-800 dark:text-white">
                                    {packWeight}
                                    {t('g')}
                                </span>
                            </span>
                        )}
                    </p>
                </div>

                <div className="flex w-full flex-col items-center justify-between space-y-2 sm:flex-row sm:space-x-8">
                    <div className="flex w-full items-center justify-between space-x-2">
                        <div className="text-base leading-6 text-gray-800 dark:text-white xl:text-lg">
                            <MarketCartButtons
                                quantity={pack.quantity}
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
                                        productPack.product_id,
                                        pack.id,
                                    )
                                }
                                displayDeleteButton={true}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col w-full items-center justify-between space-x-2">
                        <p className="text-base leading-6 text-gray-800 dark:text-white xl:text-lg">
                            {formatCurrency(pack.price)}/{t('unit')}
                        </p>

                        <p className="text-md text-base font-semibold leading-6 text-gray-800 dark:text-white xl:text-2xl">
                            {formatCurrency(pack.price * pack.quantity)}
                        </p>
                    </div>
                </div>
            </article>
        </section>
    );
}
