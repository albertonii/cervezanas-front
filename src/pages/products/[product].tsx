import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useShoppingCart } from "../../components/Context/ShoppingCartContext";
import { SupabaseProps } from "../../constants";
import {
  ICarouselItem,
  IProduct,
  ProductMultimedia,
  Review,
} from "../../lib/types.d";
import { formatCurrency } from "../../utils/formatCurrency";
import { supabase } from "../../utils/supabaseClient";
import { faCartArrowDown } from "@fortawesome/free-solid-svg-icons";
import {
  DisplaySimilarProducts,
  Layout,
  ProductGallery,
} from "../../components";
import {
  Button,
  DeleteButton,
  IconButton,
  Spinner,
} from "../../components/common";
import {
  ProductOverallReview,
  ProductReviews,
  Rate,
} from "../../components/reviews";
import { isValidObject } from "../../utils/utils";

const productsUrl = `${SupabaseProps.BASE_URL}${SupabaseProps.STORAGE_PRODUCTS_ARTICLE_IMG_URL}`;
const pPrincipalUrl = `${productsUrl}${SupabaseProps.P_PRINCIPAL_URL}`;
const pBackUrl = `${productsUrl}${SupabaseProps.P_BACK_URL}`;
const pExtra1Url = `${productsUrl}${SupabaseProps.P_EXTRA_1_URL}`;
const pExtra2Url = `${productsUrl}${SupabaseProps.P_EXTRA_2_URL}`;
const pExtra3Url = `${productsUrl}${SupabaseProps.P_EXTRA_3_URL}`;

interface Props {
  product: IProduct[];
  multimedia: IProductMultimedia[];
  reviews: Review[];
  marketplaceProducts: IProduct[];
}

export default function ProductId({
  product,
  multimedia,
  reviews,
  marketplaceProducts,
}: Props) {
  const p = product[0];
  const m: IProductMultimedia = multimedia[0];
  const { t } = useTranslation();
  const [emptyReviews, setEmptyReviews] = useState(false);
  const [productReviews, setProductReviews] = useState<Review[]>(reviews);
  const [gallery, setGallery] = useState<ICarouselItem[]>([]);
  const [isLike, setIsLike] = useState<boolean>(
    product[0]?.likes?.length > 0 ? true : false
  );

  const [loading, setLoading] = useState<boolean>(true);

  const reviewRef = useRef<any>();

  useEffect(() => {
    setLoading(false);
  }, []);

  const [productStars, _] = useState<number>(() => {
    let sum = 0;
    reviews.forEach((r) => {
      sum += r.overall;
    });
    return sum / reviews.length;
  });

  const {
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
    marketplaceItems,
    addMarketplaceItems,
    removeMarketplaceItems,
  } = useShoppingCart();

  const quantity = getItemQuantity(p.id);

  const executeScroll = () => reviewRef.current.scrollIntoView();

  useEffect(() => {
    setGallery([]);

    if (isValidObject(m.p_principal)) {
      setGallery((oldGallery) => [
        ...oldGallery,
        {
          link: "/",
          title: "Principal",
          imageUrl: productsUrl + decodeURIComponent(m.p_principal),
        },
      ]);
    }

    if (isValidObject(m.p_back)) {
      setGallery((oldGallery) => [
        ...oldGallery,
        {
          link: "/",
          title: "Back",
          imageUrl: productsUrl + decodeURIComponent(m.p_back),
        },
      ]);
    }

    if (isValidObject(m.p_extra_1)) {
      setGallery((oldGallery) => [
        ...oldGallery,
        {
          link: "/",
          title: "Photo Extra 1",
          imageUrl: productsUrl + decodeURIComponent(m.p_extra_1),
        },
      ]);
    }

    if (isValidObject(m.p_extra_2)) {
      setGallery((oldGallery) => [
        ...oldGallery,
        {
          link: "/",
          title: "Photo Extra 2",
          imageUrl: productsUrl + decodeURIComponent(m.p_extra_2),
        },
      ]);
    }

    if (isValidObject(m.p_extra_3)) {
      setGallery((oldGallery) => [
        ...oldGallery,
        {
          link: "/",
          title: "Photo Extra 3",
          imageUrl: pExtra3Url + `${p.owner_id}/` + m.p_back,
        },
      ]);
    }

    setGallery((oldGallery) =>
      oldGallery.filter(
        (item) =>
          item.imageUrl !== "" && item.imageUrl.includes("undefined") === false
      )
    );
  }, [
    m.p_back,
    m.p_extra_1,
    m.p_extra_2,
    m.p_extra_3,
    m.p_principal,
    p.owner_id,
  ]);

  useEffect(() => {
    if (productReviews[0]?.id === "0" || productReviews.length === 0) {
      setEmptyReviews(true);
    }
  }, [productReviews]);

  const handleSetReviews = (value: React.SetStateAction<Review[]>) => {
    setProductReviews(value);
    setEmptyReviews(value.length === 0 ? true : false);
  };

  const starColor = { filled: "#fdc300", unfilled: "#a87a12" };

  const handleIncreaseToCartItem = (productId: string) => {
    increaseCartQuantity(productId);
    if (marketplaceItems.find((item) => item.id === productId)) return;

    const product: IProduct | undefined = marketplaceItems.find(
      (item) => item.id === productId
    );

    if (product) return;

    const product_ = marketplaceProducts.find((item) => item.id === productId);
    if (!product_) return;
    addMarketplaceItems(product_);
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
      const { error } = await supabase
        .from("likes")
        .insert([{ product_id: product[0].id, owner_id: product[0].owner_id }]);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("likes")
        .delete()
        .match({ product_id: product[0].id, owner_id: product[0].owner_id });

      if (error) throw error;
    }
  }

  return (
    <>
      {loading ? (
        <Spinner color="beer-blonde" size={"medium"} />
      ) : (
        <div className="relative z-10" role="dialog" aria-modal="true">
          <div className="container flex lg:flex-wrap justify-between items-center mx-auto w-full transform transition h-full mt-6">
            <div className="relative flex w-full items-center overflow-hidden bg-white  pt-14 pb-8 sm:pt-8 ">
              <div className="grid w-full grid-cols-12 items-start gap-y-8 lg:grid-cols-12 lg:px-6">
                <div className="bg-bear-alvine flex items-center justify-center aspect-w-2 aspect-h-3 md:overflow-hidden rounded-lg col-span-12 lg:col-span-4 mx-6">
                  <ProductGallery
                    gallery={gallery}
                    isLike={isLike}
                    handleSetIsLike={handleSetIsLike}
                  />
                </div>

                <div className="col-span-12 lg:col-span-8 mx-6 ">
                  <div className="flex flex-column">
                    <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">
                      {p.name}
                    </h2>

                    <div>
                      <h4 className="sr-only">{t("reviews")}</h4>

                      <div className="flex flex-row justify-end items-center">
                        <div className="flex items-center">
                          <Rate
                            rating={productStars}
                            onRating={() => {}}
                            count={5}
                            color={starColor}
                            editable={false}
                          />
                        </div>

                        <p className="sr-only">{productStars} out of 5 stars</p>
                        <p
                          onClick={() => executeScroll()}
                          className="ml-3 text-sm font-medium text-beer-draft hover:text-beer-dark hover:cursor-pointer"
                        >
                          {productReviews.length} {t("reviews")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <section
                    aria-labelledby="information-heading"
                    className="mt-2"
                  >
                    <h3 id="information-heading" className="sr-only">
                      {t("product_information")}
                    </h3>

                    <p className="text-2xl text-gray-900">
                      {formatCurrency(p.price)}
                    </p>

                    <div className="mt-6">
                      <div className="flex items-center pr-6 min-h-[6vh]">
                        <p className="text-lg">{p.description}</p>
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
                          <IconButton
                            classContainer="mt-6 transition ease-in duration-300 inline-flex items-center text-sm font-medium mb-2 md:mb-0 bg-purple-500 px-5 py-2 hover:shadow-lg tracking-wider text-white rounded-full hover:bg-purple-600"
                            classIcon={""}
                            onClick={() => handleIncreaseToCartItem(p.id)}
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
                        ) : (
                          <div className="flex flex-row align-center">
                            <Button
                              class="flex w-full items-center justify-center rounded-md border border-transparent bg-beer-foam py-3 px-4 text-base font-medium focus:outline-none focus:ring-2 focus:ring-beer-blonde focus:ring-offset-2"
                              onClick={() => handleDecreaseFromCartItem(p.id)}
                              isActive={false}
                              title={""}
                              box
                            >
                              -
                            </Button>

                            <div className="mx-6 flex items-center justify-center">
                              <span className="text-beer-dark text-3xl">
                                {quantity}
                              </span>
                            </div>

                            <Button
                              class="flex w-full items-center justify-center rounded-md border border-transparent bg-beer-foam py-3 px-4 text-base font-medium focus:outline-none focus:ring-2 focus:ring-beer-blonde focus:ring-offset-2"
                              onClick={() => handleIncreaseToCartItem(p.id)}
                              isActive={false}
                              title={""}
                              box
                            >
                              +
                            </Button>

                            <DeleteButton
                              onClick={() => handleRemoveFromCart(p.id)}
                            />
                          </div>
                        )}

                        <Button
                          onClick={() => handleIncreaseToCartItem(p.id)}
                          class="mt-6 transition ease-in duration-300 inline-flex items-center text-sm font-medium mb-2 md:mb-0 bg-purple-500 px-5 py-2 hover:shadow-lg tracking-wider text-white rounded-full hover:bg-purple-600 "
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
                <div className="col-span-12 mx-6">
                  <DisplaySimilarProducts />
                </div>

                {/* Reviews */}
                <div className="col-span-12 flex flex-col justify-center item-center mx-6">
                  <ProductOverallReview
                    reviews={productReviews}
                    emptyReviews={emptyReviews}
                  />
                </div>

                {/* See user reviews */}
                {!emptyReviews && (
                  <div
                    className="col-span-12 flex flex-col justify-center item-center mx-6"
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
          </div>
        </div>
      )}
    </>
  );
}

export async function getServerSideProps(context: { params: any }) {
  const { params } = context;
  const { product: productId } = params;

  let { data: product, error: productError } = await supabase
    .from("products")
    .select(
      `*,
      beers (
        *
      ),
      product_multimedia (
        p_principal
      ),
      reviews (
        *,
        users (
          created_at,
          username
        )
      )`
    )
    .eq("id", productId);

  if (productError) throw productError;

  if (product == null) return { notFound: true };

  let { data: products, error: productsError } = await supabase
    .from("products")
    .select(
      `
      id,
      price,
      product_multimedia (
        p_principal
      )
    `
    )
    .eq("is_public", true);

  if (productsError) throw productsError;

  return {
    props: {
      product: product,
      multimedia: product[0]?.product_multimedia ?? [],
      reviews: product[0]?.reviews ?? [],
      marketplaceProducts: products ?? [],
    },
  };
}
