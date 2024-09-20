'use client';

import ProductDetails from './ProductDetails';
import React, { useEffect, useRef, useState } from 'react';
import { IProduct, IReview } from '@/lib//types/types';
import { ProductReviews } from '@/app/[locale]/components/reviews/ProductReviews';
import { ProductOverallReview } from '@/app/[locale]/components/reviews/ProductOverallReview';
import Spinner from '@/app/[locale]/components/ui/Spinner';

interface Props {
    product: IProduct;
}

export default function PDProduct({ product }: Props) {
    const [loading, setLoading] = useState<boolean>(true);

    const [emptyReviews, setEmptyReviews] = useState(false);
    const [productReviews, setProductReviews] = useState<IReview[]>(
        product.reviews ?? [],
    );

    const reviewRef = useRef<any>();

    useEffect(() => {
        setLoading(false);
    }, [product]);

    useEffect(() => {
        if (productReviews[0]?.id === '0' || !productReviews?.length) {
            setEmptyReviews(true);
        }
    }, [productReviews]);

    const handleSetReviews = (value: React.SetStateAction<IReview[]>) => {
        setProductReviews(value);
        setEmptyReviews(!value.length);
    };

    if (loading) return <Spinner color={'beer-blonde'} size="medium" />;

    return (
        <section className="relative grid items-stretch	 w-full grid-cols-12 gap-y-8 overflow-hidden pb-8 pt-14 sm:pt-8 lg:grid-cols-12 lg:px-6 bg-[url('/assets/home/bg-home.webp')] bg-auto bg-repeat bg-top">
            <ProductDetails product={product} reviewRef={reviewRef} />

            {/* Reviews */}
            <div className="item-center col-span-12 mx-6 flex flex-col justify-center bg-gray-50 p-10 border-2 rounded-xl">
                <ProductOverallReview
                    reviews={productReviews}
                    emptyReviews={emptyReviews}
                />
            </div>
            {/* User reviews */}
            {!emptyReviews && (
                <div
                    className="item-center col-span-12 mx-6 flex flex-col justify-center"
                    ref={reviewRef}
                >
                    <ProductReviews
                        reviews={productReviews}
                        handleSetReviews={handleSetReviews}
                    />
                </div>
            )}
            {/* <DisplaySimilarProducts /> */}
        </section>
    );
}
