"use client";

<<<<<<< HEAD
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslations } from "next-intl";
import { Spinner } from "../../../../../components/common";
import { useSupabase } from "../../../../../components/Context/SupabaseProvider";
import {
  ProductOverallReview,
  ProductReviews,
  Rate,
} from "../../../../../components/reviews";
import { SupabaseProps } from "../../../../../constants";
import { ICarouselItem, IProduct, IReview } from "../../../../../lib/types.d";
import { formatCurrency } from "../../../../../utils";
import { DisplaySimilarProducts, ProductGallery } from "../../../components";
import Packs from "./Packs";
import { useAuth } from "../../../../../components/Auth";
=======
import ProductDetails from "./ProductDetails";
import React, { useEffect, useRef, useState } from "react";
import { IProduct, IReview } from "../../../../../lib/types";
import { ProductReviews } from "../../../components/reviews/ProductReviews";
import { ProductOverallReview } from "../../../components/reviews/ProductOverallReview";
import dynamic from "next/dynamic";

const DynamicSpinner = dynamic(
  () => import("../../../components/common/Spinner"),
  {
    ssr: false,
  }
);
>>>>>>> 9a3d3a2fa756dd6bcfcde13cf8fc30c1fae0ecf6

interface Props {
  product: IProduct;
}

export default function Product({ product }: Props) {
<<<<<<< HEAD
  const { supabase } = useSupabase();
  const { isLoading } = useAuth();
  const selectedProduct = product;

  if (!selectedProduct) return <Spinner color={"beer-blonde"} size="medium" />;
  const selectedMultimedia = product.product_multimedia[0] ?? [];
  const reviews = product.reviews;

=======
>>>>>>> 9a3d3a2fa756dd6bcfcde13cf8fc30c1fae0ecf6
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

  if (loading) return <DynamicSpinner color={"beer-blonde"} size="medium" />;

  if (isLoading) return <Spinner color="beer-blonde" size={"medium"} />;
  console.log(product.beers);
  return (
    <section className="relative grid w-full grid-cols-12 items-center gap-y-8 overflow-hidden bg-white pb-8 pt-14 sm:pt-8 lg:grid-cols-12 lg:px-6">
      <ProductDetails product={product} reviewRef={reviewRef} />

      {/* Reviews */}
      <div className="item-center col-span-12 mx-6 flex flex-col justify-center bg-gray-50 p-10">
        <ProductOverallReview
          reviews={productReviews}
          emptyReviews={emptyReviews}
        />
      </div>

<<<<<<< HEAD
                <>
                  <h4 className="sr-only">{t("reviews")}</h4>

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
                      <p className="sr-only">{productStars} out of 5 stars</p>
                      <p
                        onClick={() => executeScroll()}
                        className="ml-3 text-sm font-medium text-beer-draft hover:cursor-pointer hover:text-beer-dark"
                      >
                        {productReviews.length} {t("reviews")}
                      </p>
                    </>
                  </div>
                </>
              </div>

              {/* Basic Info  */}
              <section aria-labelledby="information-heading" className="mt-2">
                <h3 id="information-heading" className="sr-only">
                  {t("product_information")}
                </h3>

                <p className="text-2xl text-gray-900">
                  {formatCurrency(selectedProduct.price)}
                </p>

                <div className="mt-6">
                  <div className="flex min-h-[6vh] items-center pr-6">
                    <p className="text-lg">{selectedProduct.description}</p>
                  </div>
                </div>
              </section>

              <section aria-labelledby="packs" className="mt-10">
                <Packs product={product} />
              </section>

              <section aria-labelledby="options-heading" className="mt-10">
                <h3 id="options-heading" className="sr-only">
                  {t("product_options")}
                </h3>
              </section>
            </div>

            {/* Reviews */}
            <div className="item-center col-span-12 mx-6 flex flex-col justify-center">
              <ProductOverallReview
                reviews={productReviews}
                emptyReviews={emptyReviews}
              />
            </div>

            {/* See user reviews */}
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
=======
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
>>>>>>> 9a3d3a2fa756dd6bcfcde13cf8fc30c1fae0ecf6
        </div>
      )}

      {/* <DisplaySimilarProducts /> */}
    </section>
  );
}
