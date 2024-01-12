"use client";

import ProductDetails from "./ProductDetails";
import React, { useEffect, useRef, useState } from "react";
import { Spinner } from "../../../components/common/Spinner";
import { IProduct, IReview } from "../../../../../lib/types.d";
import { ProductReviews } from "../../../components/reviews/ProductReviews";
import { DisplaySimilarProducts } from "../../../components/DisplaySimilarProducts";
import { ProductOverallReview } from "../../../components/reviews/ProductOverallReview";

interface Props {
  product: IProduct;
}

export default function Product({ product }: Props) {
  const [loading, setLoading] = useState<boolean>(true);

  const [emptyReviews, setEmptyReviews] = useState(false);
  const [productReviews, setProductReviews] = useState<IReview[]>(
    product.reviews ?? []
  );

  const reviewRef = useRef<any>();

  useEffect(() => {
    setLoading(false);
  }, [product]);

  useEffect(() => {
    if (productReviews[0]?.id === "0" || !productReviews?.length) {
      setEmptyReviews(true);
    }
  }, [productReviews]);

  const handleSetReviews = (value: React.SetStateAction<IReview[]>) => {
    setProductReviews(value);
    setEmptyReviews(!value.length);
  };

  if (!product) return <Spinner color={"beer-blonde"} size="medium" />;

  return (
    <>
      {loading ? (
        <Spinner color="beer-blonde" size={"medium"} />
      ) : (
        <div className="relative flex w-full items-center overflow-hidden bg-white  pb-8 pt-14 sm:pt-8 ">
          <div className="grid w-full grid-cols-12 items-start gap-y-8 lg:grid-cols-12 lg:px-6">
            <ProductDetails product={product} reviewRef={reviewRef} />

            {/* Reviews */}
            <div className="item-center col-span-12 mx-6 flex flex-col justify-center p-10 bg-gray-50">
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

            {/* Display Similar Products */}
            <div className="col-span-12 mx-6">
              <DisplaySimilarProducts />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
