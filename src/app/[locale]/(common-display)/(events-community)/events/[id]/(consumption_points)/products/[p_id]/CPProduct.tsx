'use client';

import ProductDetails from '@/app/[locale]/(common-display)/products/[id]/ProductDetails';
import React, { useRef, useState } from 'react';
import { IProduct, IReview } from '@/lib/types/types';
import { ICPMProducts } from '@/lib/types/consumptionPoints';
import { ProductReviews } from '@/app/[locale]/components/ProductReviews';
import { ProductOverallReview } from '@/app/[locale]/components/reviews/ProductOverallReview';

interface Props {
    CPMProduct: ICPMProducts;
    marketplaceProducts: IProduct[];
}

export default function CPProduct({ CPMProduct, marketplaceProducts }: Props) {
    const product = CPMProduct.product_packs?.products!;

    const [emptyReviews, setEmptyReviews] = useState(false);
    const [productReviews, setProductReviews] = useState<IReview[]>(
        product.reviews ?? [],
    );
    const reviewRef = useRef<any>();

    const handleSetReviews = (value: React.SetStateAction<IReview[]>) => {
        setProductReviews(value);
        setEmptyReviews(!value.length);
    };

    return (
        <section className="relative grid items-stretch	 w-full grid-cols-12 gap-y-8 overflow-hidden pb-8 pt-14 sm:pt-8 lg:grid-cols-12 lg:px-6 bg-[url('/assets/home/bg-home.webp')] bg-auto bg-repeat bg-top">
            <ProductDetails product={product} reviewRef={reviewRef} />

            {/* Reviews */}
            <div className="item-center col-span-12 mx-6 flex flex-col justify-center bg-gray-50 dark:bg-gray-600 p-10 border-2 rounded-xl">
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
