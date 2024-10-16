import MarketCartButtons from '@/app/[locale]/components/cart/MarketCartButtons';
import DisplayImageProduct from '@/app/[locale]/components/ui/DisplayImageProduct';
import React, { useMemo, useState } from 'react';
import { Beer } from 'lucide-react';
import { SupabaseProps } from '@/constants';
import { useTranslations } from 'next-intl';
import { formatCurrency } from '@/utils/formatCurrency';
import { calculateProductPacksWeight } from '@/utils/distribution';
import { useShoppingCart } from '@/app/context/ShoppingCartContext';
import { IProductPack, IProductPackCartItem } from '@/lib//types/types';

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
        updateCanMakeThePayment,
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
        <section
            className={`${
                animateRemove ? 'animate-ping' : ''
            } grid grid-cols-3  bg-amber-50 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg mb-4`}
        >
            <figure className="col-span-1 sm:col-span-1 p-4 items-center">
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

            <article className="col-span-2 sm:col-span-1 flex w-full flex-col space-y-4 lg:flex-row md:space-y-0 justify-center items-center">
                <div className="flex w-full flex-col items-center sm:items-start justify-start space-y-2">
                    <span className="text-xl font-semibold leading-6 text-gray-800 dark:text-white xl:text-2xl">
                        {pack.name}
                    </span>

                    {/* Peso del pack  */}
                    <div className="flex w-full flex-col items-center sm:items-start justify-start space-x-2">
                        <p className="text-base leading-6 text-gray-800 dark:text-white xl:text-lg ">
                            <div className="flex items-center mb-4">
                                <Beer className="text-amber-600 mr-2" />
                                <span className="text-amber-700 font-semibold">
                                    {`${packWeight}${t('g')}`}
                                </span>
                            </div>
                        </p>
                    </div>
                </div>
            </article>

            {/* Botones de cantidad y precio */}
            <div className="col-span-3 sm:col-span-1 flex flex-col items-center justify-center sm:space-x-8">
                <div className="flex flex-col w-full items-center justify-between space-x-2 text-base leading-6 text-gray-800 dark:text-white xl:text-lg">
                    <MarketCartButtons
                        quantity={pack.quantity}
                        item={productPack}
                        handleIncreaseCartQuantity={() =>
                            handleIncreaseCartQuantity()
                        }
                        handleDecreaseCartQuantity={() =>
                            handleDecreaseCartQuantity()
                        }
                        handleRemoveFromCart={() => handleRemoveFromCart()}
                        displayDeleteButton={true}
                    />
                </div>

                <div className="w-full items-center justify-center flex sm:flex-col space-x-4 py-2">
                    <p className="text-lg text-amber-700">
                        {formatCurrency(pack.price)}/{t('unit')}
                    </p>
                    <p className="text-xl font-bold text-amber-800">
                        {formatCurrency(pack.price * pack.quantity)}
                    </p>
                </div>
            </div>
        </section>
    );
}
