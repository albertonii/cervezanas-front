'use client';

import MarketCartButtons from '../../../../../../../components/common/MarketCartButtons';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslations } from 'next-intl';
import { faCartArrowDown } from '@fortawesome/free-solid-svg-icons';
import Button from '../../../../../../../components/common/Button';
import { IconButton } from '../../../../../../../components/common/IconButton';
import { useEventCart } from '../../../../../../../../context/EventCartContext';
import { ProductOverallReview } from '../../../../../../../components/reviews/ProductOverallReview';
import { ProductReviews } from '../../../../../../../components/reviews/ProductReviews';
import { Rate } from '../../../../../../../components/reviews/Rate';
import { SupabaseProps } from '../../../../../../../../../constants';
import {
  ICarouselItem,
  ICPMProducts,
  IProduct,
  IProductPack,
  IReview,
} from '../../../../../../../../../lib/types/types';
import dynamic from 'next/dynamic';

const DynamicSpinner = dynamic(
  () => import('../../../../../../../components/common/Spinner'),
  {
    ssr: false,
  },
);

interface Props {
  product: ICPMProducts;
  marketplaceProducts: IProduct[];
}

const productsUrl = `${SupabaseProps.BASE_URL}${SupabaseProps.STORAGE_PRODUCTS_ARTICLE_IMG_URL}`;
// const pPrincipalUrl = `${productsUrl}${SupabaseProps.P_PRINCIPAL_URL}`;
// const pBackUrl = `${productsUrl}${SupabaseProps.P_BACK_URL}`;
// const pExtra1Url = `${productsUrl}${SupabaseProps.P_EXTRA_1_URL}`;
// const pExtra2Url = `${productsUrl}${SupabaseProps.P_EXTRA_2_URL}`;
const pExtra3Url = `${productsUrl}${SupabaseProps.P_EXTRA_3_URL}`;

export default function CPProduct({ product, marketplaceProducts }: Props) {
  /*
  const { supabase } = useAuth();
  const selectedPack: IProductPack = product.product_pack_id;

  if (!selectedPack) return <Spinner color={"beer-blonde"} size="medium" />;
  const selectedMultimedia = product. ?? [];
  const reviews = product.product_id.reviews;

  const [loading, setLoading] = useState<boolean>(true);

  const t = useTranslations();
  const [emptyReviews, setEmptyReviews] = useState(false);
  const [productReviews, setProductReviews] = useState<IReview[]>(reviews);
  const [gallery, setGallery] = useState<ICarouselItem[]>([]);
  const [isLike, setIsLike] = useState<boolean>(
    Boolean(selectedPack?.likes?.length)
  );

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
    marketplaceEventItems,
    addMarketplaceItems,
    removeMarketplaceItems,
  } = useEventCart();

  const quantity = getItemQuantity(selectedpack.product_id);

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
          : []),
        ...(p_back
          ? [
              {
                link: "/",
                title: "Back",
                imageUrl: productsUrl + decodeURIComponent(p_back),
              },
            ]
          : []),
        ...(p_extra_1
          ? [
              {
                link: "/",
                title: "Photo Extra 1",
                imageUrl: productsUrl + decodeURIComponent(p_extra_1),
              },
            ]
          : []),
        ...(p_extra_2
          ? [
              {
                link: "/",
                title: "Photo Extra 2",
                imageUrl: productsUrl + decodeURIComponent(p_extra_2),
              },
            ]
          : []),
        ...(p_extra_3
          ? [
              {
                link: "/",
                title: "Photo Extra 3",
                imageUrl:
                  pExtra3Url + `${selectedPack.owner_id}/` + p_extra_3,
              },
            ]
          : []),
      ].filter(({ imageUrl }) => imageUrl && !imageUrl.includes("undefined"))
    );
  }, [
    selectedMultimedia.p_back,
    selectedMultimedia.p_extra_1,
    selectedMultimedia.p_extra_2,
    selectedMultimedia.p_extra_3,
    selectedMultimedia.p_principal,
    selectedPack.owner_id,
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

  const handleIncreaseToCartItem = (productId: string) => {
    increaseCartQuantity(productId);

    if (marketplaceEventItems.some(({ id }) => id === productId)) return;
    const product = marketplaceProducts.find(({ id }) => id === productId);
    if (!product) return;

    addMarketplaceItems(product);
  };

  const handleDecreaseFromCartItem = (beerId: string) => {
    decreaseCartQuantity(beerId);
    if (getItemQuantity(beerId) > 1) return;
    removeMarketplaceItems(beerId);
  };

  const handleRemoveFromCart = (beerId: string) => {
    removeMarketplaceItems(beerId);
    removeFromCart(beerId);
  };

  const handleSetIsLike = async (value: React.SetStateAction<boolean>) => {
    setIsLike(value);
    await handleLike();
  };

  async function handleLike() {
    if (!isLike) {
      const { error } = await supabase.from("likes").insert([
        {
          product_id: selectedpack.product_id,
          owner_id: selectedPack.owner_id,
        },
      ]);

      if (error) throw error;
    } else {
      const { error } = await supabase.from("likes").delete().match({
        product_id: selectedpack.product_id,
        owner_id: selectedPack.owner_id,
      });

      if (error) throw error;
    }
  }
  */

  return (
    <>
      {/*
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
                  {selectedPack.name}
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
                  {formatCurrency(selectedPack.price)}
                </p>

                <div className="mt-6">
                  <div className="flex min-h-[6vh] items-center pr-6">
                    <p className="text-lg">{selectedPack.description}</p>
                  </div>
                </div>
              </section>
             

              <section aria-labelledby="options-heading" className="mt-10">
                <h3 id="options-heading" className="sr-only">
                  {t("product_options")}
                </h3>

                <form>
                  <div className="mt-6 flex items-center space-x-2">
                    {quantity === 0 ? (
                      <div>
                        <IconButton
                          classContainer="mt-0 transition ease-in duration-300 inline-flex items-center text-sm font-medium mb-2 md:mb-0 bg-purple-500 px-5 py-2 hover:shadow-lg tracking-wider text-white rounded-full hover:bg-purple-600"
                          classIcon={""}
                          onClick={() =>
                            handleIncreaseToCartItem(selectedpack.product_id)
                          }
                          icon={faCartArrowDown}
                          isActive={false}
                          color={{
                            filled: "#fdc300",
                            unfilled: "grey",
                          }}
                          title={"Add item to cart"}
                        >
                          <>{t("add_to_cart")}</>
                        </IconButton>
                      </div>
                    ) : (
                      <>
                        <MarketCartButtons
                          quantity={quantity}
                          item={selectedPack}
                          handleIncreaseCartQuantity={() =>
                            handleIncreaseToCartItem(selectedpack.product_id)
                          }
                          handleDecreaseCartQuantity={() =>
                            handleDecreaseFromCartItem(selectedpack.product_id)
                          }
                          handleRemoveFromCart={() =>
                            handleRemoveFromCart(selectedpack.product_id)
                          }
                        />
                      </>
                    )}

                    <Button
                      onClick={() =>
                        handleIncreaseToCartItem(selectedpack.product_id)
                      }
                      class="bg-purple-500 hover:bg-purple-600 mb-0 mt-0 inline-flex items-center rounded-full px-5 py-2 text-sm font-medium tracking-wider text-white transition duration-300 ease-in hover:shadow-lg md:mb-0 "
                      isActive={false}
                      color={{
                        filled: "",
                        unfilled: "",
                      }}
                      title={""}
                      primary
                    >
                      <>{t("buy")}</>
                    </Button>
                  </div>
                </form>
              </section>
            </div>

            {/* Display Similar Products */}
      {/*    <div className="col-span-12 mx-6">
        <DisplaySimilarProducts />
      </div>

      {/* Reviews */}
      {/*  <div className="item-center col-span-12 mx-6 flex flex-col justify-center">
        <ProductOverallReview
          reviews={productReviews}
          emptyReviews={emptyReviews}
        />
      </div>

      {/* See user reviews */}
      {/* {!emptyReviews && (
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
            */}
    </>
  );
}
