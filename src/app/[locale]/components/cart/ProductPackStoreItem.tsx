'use client';

import Link from 'next/link';
import Spinner from '../ui/Spinner';
import MarketCartButtons2 from './MarketCartButtons2';
import DisplayImageProduct from '../ui/DisplayImageProduct';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AddCartButton } from './AddCartButton';
import { useMessage } from '../message/useMessage';
import { useAuth } from '../../(auth)/Context/useAuth';
import { useLocale, useTranslations } from 'next-intl';
import { IconButton } from '../ui/buttons/IconButton';
import { formatCurrency } from '@/utils/formatCurrency';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { IProduct, IProductPack } from '@/lib/types/types';
import { useShoppingCart } from '../../../context/ShoppingCartContext';
import Label from '../ui/Label';

type StoreItemProps = { product: IProduct; products: IProduct[] };

export function ProductPackStoreItem({ product }: StoreItemProps) {
    const t = useTranslations();
    const locale = useLocale();
    const { handleMessage } = useMessage();
    const [isNotificationVisible, setIsNotificationVisible] = useState(false);

    const { isLoading, supabase, isLoggedIn } = useAuth();
    const productId = product.id;
    const router = useRouter();

    const src =
        product.product_media?.find((media) => media.is_primary)?.url ?? '';

    const [packs, setPacks] = useState<IProductPack[]>();
    const [selectedPack, setSelectedPack] = useState<IProductPack>();

    useEffect(() => {
        if (product.product_packs) {
            setPacks(product.product_packs);
        }
    }, [product]);

    useEffect(() => {
        if (packs) {
            const lowestPack = packs.sort(
                (a, b) => a.quantity - b.quantity,
            )[0] as IProductPack;

            setSelectedPack(lowestPack);
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
        setIsNotificationVisible(true);

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
        <section className="bg-[url('/assets/rec-graf4c.png')] dark:bg-[url('/assets/rec-graf4b.webp')]  bg-contain bg-top bg-no-repeat  m-auto w-[250px] lg:w-[245px] 2xl:w-[280px] bg-white dark:bg-cerv-coffee rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 p-4 h-[auto] sm:h-[490px] border-2 border-gray-100">
            {isLoading ? (
                <Spinner color="beer-blonde" size="medium" />
            ) : (
                <>
                    <article className="relative mb-1 flex justify-center bg-white border-gray-200 border-2 rounded-3xl shadow-md overflow-hidden">
                        <header className="absolute right-0 top-0 p-3 z-10">
                            <IconButton
                                icon={faHeart}
                                onClick={handleLike}
                                isActive={isLike}
                                color={heartColor}
                                classContainer="bg-white shadow hover:shadow-md text-gray-500 w-auto h-9 text-center p-2 rounded-full"
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
                            <figure className="flex w-full items-center text-sm text-gray-600 ">
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
                                <h2 className="hover:text-purple-500 m-auto mr-auto cursor-pointer truncate py-2 text-2xl font-bold text-beer-draft dark:text-beer-blonde transition-all hover:text-beer-blonde ">
                                    <Link
                                        href={`/products/${product.id}`}
                                        locale={locale}
                                    >
                                        {product.name}
                                    </Link>
                                </h2>
                            </div>
                        </div>

                        <Label size="small">
                            {selectedPack?.quantity}{' '}
                            {selectedPack && selectedPack?.quantity > 1
                                ? t('units')
                                : t('unit')}
                            /{formatCurrency(selectedPack?.price ?? 0)}
                        </Label>

                        <div className="mt-2 flex flex-col items-start space-y-2 text-sm font-medium text-gray-800">
                            <select
                                className="w-full rounded border-gray-300 px-2 py-1 focus:border-yellow-400 focus:outline-none bg-gray-100"
                                onChange={(e) => {
                                    const pack = packs?.find(
                                        (pack) => pack.id === e.target.value,
                                    );
                                    setSelectedPack(pack as IProductPack);
                                }}
                            >
                                {packs &&
                                    packs
                                        .sort((a, b) => a.quantity - b.quantity)
                                        .map((pack) => (
                                            <option
                                                key={pack.id}
                                                value={pack.id}
                                            >
                                                {pack.name}
                                            </option>
                                        ))}
                            </select>

                            <div className="mt-4 flex w-full justify-between space-x-2">
                                {product.product_packs && (
                                    <MarketCartButtons2
                                        item={product.product_packs[0]}
                                        quantity={packQuantity}
                                        handleIncreaseCartQuantity={
                                            handleIncreasePackQuantity
                                        }
                                        handleDecreaseCartQuantity={
                                            handleDecreasePackQuantity
                                        }
                                        handleRemoveFromCart={() => void 0}
                                    />
                                )}

                                <AddCartButton
                                    withText={true}
                                    onClick={handleAddToCart}
                                    isVisible={isNotificationVisible}
                                    onClose={() =>
                                        setIsNotificationVisible(false)
                                    }
                                />
                            </div>
                        </div>
                    </section>
                </>
            )}
        </section>
    );
}
