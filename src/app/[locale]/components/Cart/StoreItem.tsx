'use client';

import Link from 'next/link';
import DisplayImageProduct from '../common/DisplayImageProduct';
import MarketCartButtons2 from '../common/MarketCartButtons2';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Spinner from '../common/Spinner';
import { IconButton } from '../common/IconButton';
import { SupabaseProps } from '../../../../constants';
import { useLocale, useTranslations } from 'next-intl';
import { AddCardButton } from '../common/AddCartButton';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { IProduct, IProductPack } from '../../../../lib/types/types';
import { formatCurrency } from '../../../../utils/formatCurrency';
import { useShoppingCart } from '../../../context/ShoppingCartContext';
import { useAuth } from '../../(auth)/Context/useAuth';
import { useMessage } from '../message/useMessage';

type StoreItemProps = { product: IProduct; products: IProduct[] };

const BASE_PRODUCTS_URL = SupabaseProps.BASE_PRODUCTS_URL;

export function StoreItem({ product }: StoreItemProps) {
    const t = useTranslations();
    const locale = useLocale();
    const { handleMessage } = useMessage();

    const { isLoading, supabase, isLoggedIn } = useAuth();
    const productId = product.id;
    const router = useRouter();

    const src = `${BASE_PRODUCTS_URL}${decodeURIComponent(
        product.product_multimedia?.p_principal ?? '',
    )}`;

    const [packs, setPacks] = useState<IProductPack[]>();
    const [selectedPack, setSelectedPack] = useState<IProductPack>();

    useEffect(() => {
        if (product.product_packs) {
            setPacks(product.product_packs);
        }
    }, [product]);

    useEffect(() => {
        if (packs) {
            // const lowestPack = packs.sort(
            //     (a, b) => a.quantity - b.quantity,
            // )[0] as IProductPack;
            // setSelectedPack(lowestPack);
            setSelectedPack(packs[0]);
        }
    }, [packs]);

    const overAllCalculation = () => {
        let overAll_sum = 0;
        const reviewsCount = product.reviews;
        if (!reviewsCount) return t('no_reviews');

        reviewsCount.map((review) => (overAll_sum += review.overall));
        const overAll_avg = overAll_sum / reviewsCount.length;
        const overAll_toFixed: string = overAll_avg.toFixed(1);
        return overAll_toFixed.toString();
    };

    const overAll =
        product.reviews && product.reviews.length > 0
            ? overAllCalculation()
            : t('no_reviews');

    const [isLike, setIsLike] = useState<boolean>(
        product.likes && product.likes.length > 0 ? true : false,
    );

    const { addPackToCart } = useShoppingCart();

    const [packQuantity, setPackQuantity] = useState(1);

    const heartColor = { filled: '#fdc300', unfilled: 'grey' };

    async function handleLike() {
        // Notification if user is not logged in
        if (!isLoggedIn) {
            handleMessage({
                type: 'info',
                message: 'must_be_logged_in_favs',
            });
            return;
        }

        if (!isLike) {
            const { error } = await supabase
                .from('likes')
                .insert([
                    { product_id: productId, owner_id: product.owner_id },
                ]);

            if (error) throw error;

            setIsLike(true);
        } else {
            const { error } = await supabase
                .from('likes')
                .delete()
                .match({ product_id: productId, owner_id: product.owner_id });

            if (error) throw error;

            setIsLike(false);
        }
    }

    const handleIncreasePackQuantity = () => {
        setPackQuantity(packQuantity + 1);
    };

    const handleDecreasePackQuantity = () => {
        if (packQuantity > 1) setPackQuantity(packQuantity - 1);
    };

    const handleAddToCart = () => {
        if (!isLoggedIn) {
            handleMessage({
                type: 'info',
                message: 'must_be_logged_in_add_store',
            });
            return;
        }

        const packCartItem: IProductPack = {
            id: selectedPack?.id ?? '',
            created_at: selectedPack?.created_at ?? '',
            quantity: packQuantity,
            price: selectedPack?.price ?? 0,
            img_url: selectedPack?.img_url ?? '',
            name: selectedPack?.name ?? '',
            randomUUID: selectedPack?.randomUUID ?? '',
            product_id: selectedPack?.product_id ?? '',
        };

        addPackToCart(product, packCartItem);
        setPackQuantity(1);
    };

    return (
        <section className="m-auto max-w-[300px] border-2 bg-[url('/assets/rec-graf4c.png')] bg-contain bg-top bg-no-repeat p-6 shadow-md md:max-w-full">
            {isLoading ? (
                <Spinner color="beer-blonde" size="medium"></Spinner>
            ) : (
                <>
                    <article className="relative mb-1 flex justify-center">
                        <header className="absolute right-0 top-0 p-3">
                            <IconButton
                                icon={faHeart}
                                onClick={() => handleLike()}
                                isActive={isLike}
                                color={heartColor}
                                classContainer={
                                    ' bg-white shadow hover:shadow-md text-gray-500 w-auto h-9 text-center p-2 !rounded-full !m-0'
                                }
                                classIcon={''}
                                title={t('add_to_favs')}
                            ></IconButton>
                        </header>

                        <DisplayImageProduct
                            width={120}
                            height={120}
                            alt="Principal Product Image store item"
                            imgSrc={src}
                            class={
                                ' h-[220px] w-[220px]  border-2 object-contain hover:cursor-pointer'
                            }
                            onClick={() =>
                                router.push(`/${locale}/products/${product.id}`)
                            }
                        />
                    </article>

                    <section className="flex flex-col justify-between ">
                        <div className="flex flex-wrap ">
                            <figure className="flex w-full flex-none items-center text-sm text-gray-600">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-1 h-4 w-4 text-beer-blonde"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="mr-3 mt-2 whitespace-nowrap text-gray-400">
                                    {overAll}
                                </span>
                            </figure>

                            <div className="flex w-full min-w-0 items-center justify-between ">
                                <h2 className="hover:text-purple-500 m-auto mr-auto cursor-pointer truncate py-2 text-2xl font-semibold text-beer-draft transition-all hover:text-beer-blonde">
                                    <Link
                                        href={`/products/${product.id}`}
                                        locale={locale}
                                    >
                                        {product.name}
                                    </Link>
                                </h2>
                                {/* {beer.product_inventory?.quantity > 0 ? (
                                    <div className="flex items-center bg-green-400 text-white text-sm px-2 py-1 ml-3 rounded-lg">
                                        {t('instock')}
                                    </div>
                                ) : (
                                    <div className="flex items-center bg-red-400 text-white text-sm px-2 py-1 ml-3 rounded-lg">
                                        {t('outstock')}
                                    </div>
                                )} */}
                            </div>
                        </div>

                        {/* Información sobre el pack seleccionado detallada y minimalista  */}
                        <div className="m-auto mt-1 text-base font-semibold text-bear-dark">
                            {selectedPack?.quantity}{' '}
                            {selectedPack && selectedPack?.quantity > 1
                                ? t('units')
                                : t('unit')}
                            /{formatCurrency(selectedPack?.price ?? 0)}
                        </div>

                        <div className="mt-1 text-lg font-semibold text-bear-dark"></div>

                        <div className="w mt-2 flex flex-col items-start justify-between space-y-2 overflow-x-hidden text-sm font-medium">
                            <select
                                className="text-md w-full  border-beer-softBlondeBubble px-2 py-1 focus:border-beer-blonde focus:outline-none"
                                id="is_external_organizer"
                                onClick={(e: any) => {
                                    const value = e.target.value;
                                    const pack = packs?.find(
                                        (pack) => pack.id === value,
                                    );
                                    setSelectedPack(pack as IProductPack);
                                }}
                            >
                                {packs &&
                                    packs
                                        .sort((a, b) => a.quantity - b.quantity)
                                        .map((pack: IProductPack) => (
                                            <option
                                                key={pack.id}
                                                value={pack.id}
                                            >
                                                {pack.name}
                                            </option>
                                        ))}
                            </select>

                            {/* Añadir al carrito */}
                            {product.product_packs && (
                                <div className="mt-6 flex w-full justify-between space-x-2">
                                    <MarketCartButtons2
                                        item={product.product_packs[0]}
                                        quantity={packQuantity}
                                        handleIncreaseCartQuantity={() =>
                                            handleIncreasePackQuantity()
                                        }
                                        handleDecreaseCartQuantity={() =>
                                            handleDecreasePackQuantity()
                                        }
                                        handleRemoveFromCart={() => void 0}
                                    />

                                    <AddCardButton
                                        withText={true}
                                        onClick={() => handleAddToCart()}
                                    />
                                </div>
                            )}
                        </div>
                    </section>
                </>
            )}
        </section>
    );
}
