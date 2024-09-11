import Packs from './Packs';
import ProductsInsideBox from './ProductsInsideBox';
import ProductPropertiesTabs from './ProductPropertiesTabs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Type } from '@/lib//productEnum';
import { SupabaseProps } from '@/constants';
import { useTranslations } from 'next-intl';
import { handleProductLike } from '../actions';
import { formatCurrency } from '@/utils/formatCurrency';
import { ICarouselItem, IProduct } from '@/lib//types/types';
import { Rate } from '@/app/[locale]/components/reviews/Rate';
import { ProductGallery } from '@/app/[locale]/components/ProductGallery';

const productsUrl = `${SupabaseProps.BASE_URL}${SupabaseProps.STORAGE_PRODUCTS_IMG_URL}`;

interface Props {
    product: IProduct;
    reviewRef: React.MutableRefObject<any>;
}

export default function ProductDetails({ product, reviewRef }: Props) {
    const t = useTranslations();

    const [isLike, setIsLike] = useState<boolean>(
        Boolean(product.likes?.length),
    );
    const [gallery, setGallery] = useState<ICarouselItem[]>([]);

    const starColor = { filled: '#fdc300', unfilled: '#a87a12' };
    const reviews = product.reviews;
    const selectedMultimedia = product.product_multimedia;

    const handleSetIsLike = async (value: React.SetStateAction<boolean>) => {
        await handleLike()
            .then(() => setIsLike(value))
            .catch(() => console.error('Error setting like'));
    };

    const productStars = useMemo(() => {
        const sum =
            reviews?.reduce((acc, review) => acc + review.overall, 0) ?? 0;
        return reviews?.length ? sum / reviews.length : 0;
    }, [reviews]);

    const executeScroll = useCallback(
        () => reviewRef.current.scrollIntoView(),
        [reviewRef],
    );

    async function handleLike() {
        handleProductLike(product.id, product.owner_id, isLike);
    }

    useEffect(() => {
        if (!selectedMultimedia) return;

        const { p_principal, p_back, p_extra_1, p_extra_2, p_extra_3 } =
            selectedMultimedia;

        setGallery(
            [
                ...[
                    {
                        link: '/',
                        title: 'Principal',
                        imageUrl:
                            p_principal &&
                            productsUrl + decodeURIComponent(p_principal),
                    },
                ],
                ...[
                    {
                        link: '/',
                        title: 'Back',
                        imageUrl:
                            p_back && productsUrl + decodeURIComponent(p_back),
                    },
                ],
                ...[
                    {
                        link: '/',
                        title: 'Photo Extra 1',
                        imageUrl:
                            p_extra_1 &&
                            productsUrl + decodeURIComponent(p_extra_1),
                    },
                ],
                ...[
                    {
                        link: '/',
                        title: 'Photo Extra 2',
                        imageUrl:
                            p_extra_2 &&
                            productsUrl + decodeURIComponent(p_extra_2),
                    },
                ],
                ...[
                    {
                        link: '/',
                        title: 'Photo Extra 3',
                        imageUrl:
                            p_extra_3 &&
                            productsUrl + decodeURIComponent(p_extra_3),
                    },
                ],
            ].filter(
                ({ imageUrl }) => imageUrl && !imageUrl.includes('undefined'),
            ),
        );
    }, [selectedMultimedia, product.owner_id]);

    return (
        <>
            <div
                className="justify-center  md:overflow-hidden lg:col-span-4  col-span-12 rounded-lg 
                    bg-beer-softBlonde bg-[url('/assets/madera.webp')] bg-auto bg-top bg-repeat pb-2 h-[600px] max-w-[500px] m-auto lg:mx-6 lg:my-0 "
            >
                <section className="block">
                    <ProductGallery
                        gallery={gallery}
                        isLike={isLike}
                        handleSetIsLike={handleSetIsLike}
                    />
                </section>
                {/* Sobre el producto  */}
            </div>

            <section className="col-span-12 mx-6 space-y-4 bg-[url('/assets/rec-graf2b.webp')] bg-auto bg-top bg-no-repeat lg:col-span-8">
                <section className="flex flex-col sm:flex-row sm:justify-between">
                    <h2 className=" font-bold lowercase sm:pr-12 font-['NexaRust-script'] text-6xl md:text-7xl text-beer-draft bg-white md:bg-transparent pl-4 sm:pl-12 mb-4 md:-mb-8">
                        {product.name}
                    </h2>

                    {/* Reviews */}
                    <>
                        <h4 className="sr-only">{t('reviews')}</h4>

                        <div className="flex flex-col items-end justify-end">
                            <div className="flex items-center">
                                <Rate
                                    rating={productStars}
                                    onRating={() => void {}}
                                    count={5}
                                    color={starColor}
                                    editable={false}
                                />
                            </div>

                            <>
                                <p className="sr-only">
                                    {productStars} out of 5 stars
                                </p>
                                <p
                                    onClick={() => executeScroll()}
                                    className="ml-3 text-sm font-medium text-beer-draft hover:cursor-pointer hover:text-beer-dark"
                                >
                                    {reviews?.length} {t('reviews')}
                                </p>
                            </>
                        </div>
                    </>
                </section>

                <section
                    aria-labelledby="product-description-heading"
                    className={
                        'flex items-center justify-center rounded-lg bg-white bg-opacity-90 md:overflow-hidden px-0 py-4 sm:px-4 text-base'
                    }
                >
                    <h3 id="product-description-heading" className="sr-only">
                        {t('product_description')}
                    </h3>

                    <p className="text-gray-900 max-w-[90%]">
                        {product.description}
                    </p>
                </section>

                <section
                    aria-labelledby="information-heading"
                    className="hidden"
                >
                    <h3 id="information-heading" className="sr-only">
                        {t('product_information')}
                    </h3>

                    <p className="text-2xl font-semibold mt-14 bg-cerv-banana max-w-[140px] text-center p-5 rounded-full text-white shadow-xl  border-white border-4">
                        {formatCurrency(product.price)}
                    </p>
                    <div className="m-auto text-center">
                        <img
                            className="m-auto"
                            src="/assets/home/detalle.svg"
                            width="80"
                        ></img>
                    </div>
                </section>

                {/* Display Product Details if Type === BEER */}
                {product.type === Type.BEER && (
                    <section aria-labelledby="packs" className="space-y-8">
                        <Packs product={product} />
                        <ProductPropertiesTabs product={product} />
                    </section>
                )}

                {/* List of products if Type === BOX_PACK */}
                {product.type === Type.BOX_PACK && product.box_packs && (
                    <section aria-labelledby="packs" className="h-[20vh]">
                        <ProductsInsideBox
                            product={product}
                            boxPack={product.box_packs[0]}
                        />
                    </section>
                )}
            </section>
        </>
    );
}
