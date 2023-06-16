"use client";

import MarketCartButtons from "../../../../../components/common/MarketCartButtons";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslations } from "next-intl";
import { AddCardButton, Spinner } from "../../../../../components/common";
import { useShoppingCart } from "../../../../../components/Context";
import { useSupabase } from "../../../../../components/Context/SupabaseProvider";
import {
  ProductOverallReview,
  ProductReviews,
  Rate,
} from "../../../../../components/reviews";
import { COMMON, SupabaseProps } from "../../../../../constants";
import { ICarouselItem, IProduct, IReview } from "../../../../../lib/types.d";
import { formatCurrency } from "../../../../../utils";
import { DisplaySimilarProducts, ProductGallery } from "../../../components";

interface Props {
  product: IProduct;
  marketplaceProducts: IProduct[];
}

const productsUrl = `${SupabaseProps.BASE_URL}${SupabaseProps.STORAGE_PRODUCTS_IMG_URL}`;

export default function Product({ product, marketplaceProducts }: Props) {
  const { supabase } = useSupabase();
  const selectedProduct = product;

  if (!selectedProduct) return <Spinner color={"beer-blonde"} size="medium" />;
  const selectedMultimedia = product.product_multimedia[0] ?? [];
  const reviews = product.reviews;

  const [loading, setLoading] = useState<boolean>(true);

  const t = useTranslations();
  const [emptyReviews, setEmptyReviews] = useState(false);
  const [productReviews, setProductReviews] = useState<IReview[]>(
    product.reviews
  );
  const [gallery, setGallery] = useState<ICarouselItem[]>([]);
  const [isLike, setIsLike] = useState<boolean>(
    Boolean(selectedProduct?.likes?.length)
  );
  const productId = selectedProduct.id;

  const reviewRef = useRef<any>();

  useEffect(() => {
    setLoading(false);
  }, [product]);

  const productStars = useMemo(() => {
    const sum = reviews.reduce((acc, review) => acc + review.overall, 0);
    return reviews.length ? sum / reviews.length : 0;
  }, [reviews]);

  const {
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
    marketplaceItems,
    addMarketplaceItems,
    removeMarketplaceItems,
  } = useShoppingCart();

  const quantity = getItemQuantity(selectedProduct.id);

  const executeScroll = useCallback(
    () => reviewRef.current.scrollIntoView(),
    [reviewRef]
  );

  useEffect(() => {
    const { p_principal, p_back, p_extra_1, p_extra_2, p_extra_3 } =
      selectedMultimedia;

    setGallery(
      [
        ...(p_principal
          ? [
              {
                link: "/",
                title: "Principal",
                imageUrl: productsUrl + decodeURIComponent(p_principal),
              },
            ]
          : [
              {
                link: "/",
                title: "Principal",
                imageUrl: COMMON.MARKETPLACE_PRODUCT,
              },
            ]),
        ...(p_back
          ? [
              {
                link: "/",
                title: "Back",
                imageUrl: productsUrl + decodeURIComponent(p_back),
              },
            ]
          : [
              {
                link: "/",
                title: "Principal",
                imageUrl: COMMON.MARKETPLACE_PRODUCT,
              },
            ]),
        ...(p_extra_1
          ? [
              {
                link: "/",
                title: "Photo Extra 1",
                imageUrl: productsUrl + decodeURIComponent(p_extra_1),
              },
            ]
          : [
              {
                link: "/",
                title: "Principal",
                imageUrl: COMMON.MARKETPLACE_PRODUCT,
              },
            ]),
        ...(p_extra_2
          ? [
              {
                link: "/",
                title: "Photo Extra 2",
                imageUrl: productsUrl + decodeURIComponent(p_extra_2),
              },
            ]
          : [
              {
                link: "/",
                title: "Principal",
                imageUrl: COMMON.MARKETPLACE_PRODUCT,
              },
            ]),
        ...(p_extra_3
          ? [
              {
                link: "/",
                title: "Photo Extra 3",
                imageUrl: productsUrl + decodeURIComponent(p_extra_3),
              },
            ]
          : [
              {
                link: "/",
                title: "Principal",
                imageUrl: COMMON.MARKETPLACE_PRODUCT,
              },
            ]),
      ].filter(({ imageUrl }) => imageUrl && !imageUrl.includes("undefined"))
    );
  }, [
    selectedMultimedia.p_back,
    selectedMultimedia.p_extra_1,
    selectedMultimedia.p_extra_2,
    selectedMultimedia.p_extra_3,
    selectedMultimedia.p_principal,
    selectedProduct.owner_id,
  ]);

  useEffect(() => {
    if (productReviews[0]?.id === "0" || !productReviews?.length) {
      setEmptyReviews(true);
    }
  }, [productReviews]);

  const handleSetReviews = (value: React.SetStateAction<IReview[]>) => {
    setProductReviews(value);
    setEmptyReviews(!value.length);
  };

  const starColor = { filled: "#fdc300", unfilled: "#a87a12" };

  const handleIncreaseToCartItem = () => {
    increaseCartQuantity(productId);
    if (marketplaceItems.find((item) => item.id === productId)) return;
    console.log(marketplaceProducts);
    const product = marketplaceProducts.find(({ id }) => id === productId);
    if (!product) return;
    addMarketplaceItems(product);
  };

  const handleDecreaseFromCartItem = () => {
    decreaseCartQuantity(productId);
    if (getItemQuantity(productId) > 1) return;
    removeMarketplaceItems(productId);
  };

  const handleRemoveFromCart = () => {
    removeMarketplaceItems(productId);
    removeFromCart(productId);
  };

  const handleSetIsLike = async (value: React.SetStateAction<boolean>) => {
    setIsLike(value);
    await handleLike();
  };

  async function handleLike() {
    if (!isLike) {
      const { error } = await supabase
        .from("likes")
        .insert([{ product_id: product.id, owner_id: product.owner_id }]);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("likes")
        .delete()
        .match({ product_id: product.id, owner_id: product.owner_id });

      if (error) throw error;
    }
  }

  return (
    <>
      {loading ? (
        <Spinner color="beer-blonde" size={"medium"} />
      ) : (
        <div className="relative flex w-full items-center overflow-hidden bg-white  pb-8 pt-14 sm:pt-8 ">
          <div className="grid w-full grid-cols-12 items-start gap-y-8 lg:grid-cols-12 lg:px-6">
            <div className="aspect-w-2 aspect-h-3 col-span-12 mx-6 flex items-center justify-center rounded-lg bg-bear-alvine md:overflow-hidden lg:col-span-4">
              <ProductGallery
                gallery={gallery}
                isLike={isLike}
                handleSetIsLike={handleSetIsLike}
              />
            </div>

            <div className="col-span-12 mx-6 lg:col-span-8 ">
              <div className="flex-column flex">
                <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">
                  {selectedProduct.name}
                </h2>

                <div>
                  <h4 className="sr-only">{t("reviews")}</h4>

                  <div className="flex flex-row items-center justify-end">
                    <div className="flex items-center">
                      <Rate
                        rating={productStars}
                        onRating={() => void {}}
                        count={5}
                        color={starColor}
                        editable={false}
                      />
                    </div>

                    <p className="sr-only">{productStars} out of 5 stars</p>
                    <p
                      onClick={() => executeScroll()}
                      className="ml-3 text-sm font-medium text-beer-draft hover:cursor-pointer hover:text-beer-dark"
                    >
                      {productReviews.length} {t("reviews")}
                    </p>
                  </div>
                </div>
              </div>

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

              <section aria-labelledby="options-heading" className="mt-10">
                <h3 id="options-heading" className="sr-only">
                  {t("product_options")}
                </h3>

                <form>
                  <div className="mt-6 flex space-x-2">
                    {quantity === 0 ? (
                      <>
                        <AddCardButton
                          withText={true}
                          onClick={() => handleIncreaseToCartItem()}
                        />
                      </>
                    ) : (
                      <>
                        <MarketCartButtons
                          quantity={quantity}
                          item={product}
                          handleIncreaseCartQuantity={() =>
                            handleIncreaseToCartItem()
                          }
                          handleDecreaseCartQuantity={() =>
                            handleDecreaseFromCartItem()
                          }
                          handleRemoveFromCart={() => handleRemoveFromCart()}
                        />
                      </>
                    )}
                  </div>
                </form>
              </section>
            </div>

            {/* Display Similar Products */}
            <div className="col-span-12 mx-6">
              <DisplaySimilarProducts />
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
          </div>
        </div>
      )}
    </>
  );
}
