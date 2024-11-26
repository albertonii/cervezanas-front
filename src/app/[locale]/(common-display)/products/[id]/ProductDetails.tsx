import Packs from './Packs';
import ProductsInsideBox from './ProductsInsideBox';
import ProductPropertiesTabs from './ProductPropertiesTabs';
import React, { useState } from 'react';
import { Type } from '@/lib//productEnum';
import { useTranslations } from 'next-intl';
import { handleProductLike } from '../actions';
import { ICarouselItem, IProduct } from '@/lib//types/types';
import { Rate } from '@/app/[locale]/components/reviews/Rate';
import { ProductGallery } from '@/app/[locale]/components/gallery/ProductGallery';

interface Props {
    product: IProduct;
    reviewRef: React.MutableRefObject<any>;
}

export default function ProductDetails({ product, reviewRef }: Props) {
    const t = useTranslations();

    const [isLike, setIsLike] = useState<boolean>(
        Boolean(product.likes?.length),
    );

    const gallery: ICarouselItem[] =
        product.product_media?.map((media) => ({
            link: '/',
            title: media.alt_text,
            imageUrl: media.url,
        })) || [];

    const starColor = { filled: '#fdc300', unfilled: '#a87a12' };
    const reviews = product.reviews;

    const handleSetIsLike = async (value: React.SetStateAction<boolean>) => {
        try {
            await handleLike();
            setIsLike(value);
        } catch (error) {
            console.error('Error setting like');
        }
    };

    const productStars = reviews?.length
        ? reviews.reduce((acc, review) => acc + review.overall, 0) /
          reviews.length
        : 0;

    const executeScroll = () => reviewRef.current.scrollIntoView();

    async function handleLike() {
        handleProductLike(product.id, product.owner_id, isLike);
    }

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

                {/* Display Product Details if Type === BEER */}
                {product?.type === Type.BEER && (
                    <section aria-labelledby="packs" className="space-y-8">
                        <Packs product={product} />
                        <ProductPropertiesTabs product={product} />
                    </section>
                )}

                {/* List of products if Type === BOX_PACK */}
                {product.type === Type.BOX_PACK && product.box_packs && (
                    <section
                        aria-labelledby="products_indise_box"
                        className="h-[20vh]"
                    >
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
