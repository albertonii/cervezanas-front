'use client';

import Link from 'next/link';
import MarketCartButtons2 from './MarketCartButtons2';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SupabaseProps } from '@/constants';
import { useLocale, useTranslations } from 'next-intl';
import { AddCardButton } from './AddCartButton';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { IProduct, IProductPack } from '@/lib//types/types';
import { formatCurrency } from '@/utils/formatCurrency';
import { useShoppingCart } from '../../../context/ShoppingCartContext';
import { useAuth } from '../../(auth)/Context/useAuth';
import { useMessage } from '../message/useMessage';
import { IconButton } from '../ui/buttons/IconButton';
import DisplayImageProduct from '../ui/DisplayImageProduct';
import Spinner from '../ui/Spinner';

type StoreItemProps = { product: IProduct; products: IProduct[] };

const BASE_PRODUCTS_URL = SupabaseProps.BASE_PRODUCTS_URL;

export function BoxPackStoreItem({ product }: StoreItemProps) {
    const t = useTranslations();
    const locale = useLocale();
    const { handleMessage } = useMessage();

    const { isLoading, supabase, isLoggedIn } = useAuth();
    const productId = product.id;
    const router = useRouter();

    const src = `${BASE_PRODUCTS_URL}${decodeURIComponent(
        product.product_multimedia?.p_principal ?? '',
    )}`;

    const [pack, setPack] = useState<IProductPack>();

    useEffect(() => {
        if (
            !product.product_packs ||
            product.product_packs[0] === undefined ||
            !product.product_packs[0].id
        ) {
            handleMessage({
                type: 'error',
                message: 'no_product_packs',
            });

            return;
        }

        const newPack: IProductPack = {
            id: product.product_packs[0].id,
            product_id: product.id,
            created_at: product.created_at,
            quantity: 1,
            price: product.price,
            img_url: product.product_multimedia?.p_principal,
            name: product.name,
            randomUUID: '',
        };

        setPack(newPack);
    }, [product]);

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

    const heartColor = { filled: '#ff4d4f', unfilled: '#d9d9d9' };

    async function handleLike() {
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
            id: pack?.id ?? '',
            created_at: pack?.created_at ?? '',
            quantity: packQuantity,
            price: pack?.price ?? 0,
            img_url: pack?.img_url ?? '',
            name: pack?.name ?? '',
            randomUUID: pack?.randomUUID ?? '',
            product_id: pack?.product_id ?? '',
        };

        addPackToCart(product, packCartItem);
        setPackQuantity(1);
    };

    return (
        <section className="bg-[url('/assets/rec-graf4c.png')] bg-contain bg-top bg-no-repeat  m-auto max-w-sm bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
            {isLoading ? (
                <Spinner color="beer-blonde" size="medium" />
            ) : (
                <>
                    <article className="relative mb-4 flex justify-center">
                        <header className="absolute right-0 top-0 p-3 z-10">
                            <IconButton
                                icon={faHeart}
                                onClick={handleLike}
                                isActive={isLike}
                                color={heartColor}
                                classContainer="bg-white shadow hover:shadow-md text-gray-500 w-auto h-9 text-center p-2 rounded-full"
                                classIcon=""
                                title={t('add_to_favs')}
                            />
                        </header>

                        <DisplayImageProduct
                            width={220}
                            height={220}
                            alt="Principal Product Image store item"
                            imgSrc={src}
                            class="h-[220px] w-[220px] rounded-lg object-cover cursor-pointer transition-transform transform hover:scale-105"
                            onClick={() =>
                                router.push(`/${locale}/products/${product.id}`)
                            }
                        />
                    </article>

                    <section className="flex flex-col justify-between">
                        <div className="flex flex-wrap">
                            <figure className="flex w-full items-center text-sm text-gray-600">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-1 h-4 w-4 text-yellow-500"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-gray-400">{overAll}</span>
                            </figure>

                            <div className="flex w-full min-w-0 items-center justify-between ">
                                <h2 className="hover:text-purple-500 m-auto mr-auto cursor-pointer truncate py-2 text-2xl font-bold text-beer-draft transition-all hover:text-beer-blonde">
                                    <Link
                                        href={`/products/${product.id}`}
                                        locale={locale}
                                    >
                                        {product.name}
                                    </Link>
                                </h2>
                            </div>
                        </div>

                        <div className="text-lg font-semibold text-gray-800">
                            {pack?.quantity} {t('unit')} /
                            {formatCurrency(pack?.price ?? 0)}
                        </div>

                        <div className="mt-10 flex flex-col items-start space-y-2 text-sm font-medium text-gray-800">
                            <div className="w-full"></div>

                            <div className="mt-4 flex w-full justify-between space-x-2">
                                <MarketCartButtons2
                                    item={product}
                                    quantity={packQuantity}
                                    handleIncreaseCartQuantity={
                                        handleIncreasePackQuantity
                                    }
                                    handleDecreaseCartQuantity={
                                        handleDecreasePackQuantity
                                    }
                                    handleRemoveFromCart={() => void 0}
                                />
                                <AddCardButton
                                    withText={true}
                                    onClick={handleAddToCart}
                                />
                            </div>
                        </div>
                    </section>
                </>
            )}
        </section>
    );
}
