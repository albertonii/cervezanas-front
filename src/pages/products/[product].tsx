import { Input } from "@supabase/ui";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useShoppingCart } from "../../components/Context/ShoppingCartContext";
import Layout from "../../components/Layout";
import NewProductReview from "../../components/reviews/NewProductReview";
import ProductGallery from "../../components/ProductGallery";
import ProductOverallReview from "../../components/reviews/ProductOverallReview";
import ProductReviews from "../../components/reviews/ProductReviews";
import Rate from "../../components/reviews/Rate";
import { SupabaseProps } from "../../constants";
import { Product, ProductMultimedia, Review } from "../../lib/types";
import { formatCurrency } from "../../utils/formatCurrency";
import { supabase } from "../../utils/supabaseClient";
import Button from "../../components/common/Button";
import IconButton from "../../components/common/IconButton";
import { faCartArrowDown } from "@fortawesome/free-solid-svg-icons";
import DisplaySimilarProducts from "../../components/DisplaySimilarProducts";

const productsUrl = `${SupabaseProps.BASE_URL}${SupabaseProps.STORAGE_PRODUCTS_IMG_URL}`;
const pPrincipalUrl = `${productsUrl}${SupabaseProps.P_PRINCIPAL_URL}`;
const pBackUrl = `${productsUrl}${SupabaseProps.P_BACK_URL}`;
const pExtra1Url = `${productsUrl}${SupabaseProps.P_EXTRA_1_URL}`;
const pExtra2Url = `${productsUrl}${SupabaseProps.P_EXTRA_2_URL}`;
const pExtra3Url = `${productsUrl}${SupabaseProps.P_EXTRA_3_URL}`;
const pExtra4Url = `${productsUrl}${SupabaseProps.P_EXTRA_4_URL}`;

interface Props {
  product: Product[];
  multimedia: ProductMultimedia[];
  reviews: Review[];
}

export default function ProductId(props: Props) {
  const { product, multimedia, reviews } = props;
  const p = product[0];
  const m: ProductMultimedia = multimedia[0];

  const { t } = useTranslation();
  const [emptyReviews, setEmptyReviews] = useState(false);
  const [productReviews, setProductReviews] = useState<Review[]>(reviews);
  const [gallery, setGallery] = useState<string[]>([]);
  const [isLike, setIsLike] = useState<boolean>(
    product[0].likes?.length > 0 ? true : false
  );

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

  useEffect(() => {
    setGallery([]);

    setGallery((oldGallery) => [
      ...oldGallery,
      m.p_principal !== "undefined" && m.p_principal !== null
        ? pPrincipalUrl + `${p.owner_id}/` + m.p_principal
        : "/marketplace_product_default.png",
    ]);

    setGallery((oldGallery) => [
      ...oldGallery,
      m.p_back !== "undefined" && m.p_back !== null
        ? pBackUrl + `${p.owner_id}/` + m.p_back
        : "",
    ]);

    setGallery((oldGallery) => [
      ...oldGallery,
      m.p_extra_1 !== "undefined" && m.p_extra_1 !== null
        ? pExtra1Url + `${p.owner_id}/` + m.p_extra_1
        : "",
    ]);

    setGallery((oldGallery) => [
      ...oldGallery,
      m.p_extra_2 !== "undefined" && m.p_extra_2 !== null
        ? pExtra2Url + `${p.owner_id}/` + m.p_extra_2
        : "",
    ]);

    setGallery((oldGallery) => [
      ...oldGallery,
      m.p_extra_3 !== "undefined" && m.p_extra_3 !== null
        ? pExtra3Url + `${p.owner_id}/` + m.p_extra_3
        : "",
    ]);

    setGallery((oldGallery) => [
      ...oldGallery,
      m.p_extra_4 !== "undefined" && m.p_extra_4 !== null
        ? pExtra4Url + `${p.owner_id}/` + m.p_extra_4
        : "",
    ]);

    setGallery((oldGallery) => oldGallery.filter((item) => item !== ""));
  }, [
    m.p_back,
    m.p_extra_1,
    m.p_extra_2,
    m.p_extra_3,
    m.p_extra_4,
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

  const handleIncreaseCartQuantity = (beerId: string) => {
    increaseCartQuantity(beerId);
    if (marketplaceItems.find((item) => item.id === beerId)) return;

    const product: Product | undefined = marketplaceItems.find(
      (item) => item.id === beerId
    );
    if (!product) return;
    addMarketplaceItems(product);
  };

  const handleDecreaseCartQuantity = (beerId: string) => {
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
    <Layout usePadding={true} useBackdrop={false}>
      <div className="relative z-10" role="dialog" aria-modal="true">
        <div className="container flex lg:flex-wrap justify-between items-center mx-auto w-full transform transition h-full mt-6">
          <div className="relative flex w-full items-center overflow-hidden bg-white  pt-14 pb-8 sm:pt-8 ">
            <div className="grid w-full grid-cols-12 items-start gap-y-8 lg:grid-cols-12 lg:px-6">
              <div className="bg-bear-alvine flex items-center justify-center aspect-w-2 aspect-h-3 md:overflow-hidden rounded-lg col-span-12 lg:col-span-4  md:h-5/6 mx-6">
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

                    <div className="flex flex-col justify-end items-end">
                      <div className="flex items-center">
                        <Rate
                          rating={3.9}
                          onRating={() => {}}
                          count={5}
                          color={starColor}
                          editable={false}
                        />
                      </div>

                      <p className="sr-only">3.9 out of 5 stars</p>
                      <a
                        href="#"
                        className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        {productReviews.length} {t("reviews")}
                      </a>
                    </div>
                  </div>
                </div>

                <section aria-labelledby="information-heading" className="mt-2">
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
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Color
                      </h4>

                      <fieldset className="mt-4">
                        <legend className="sr-only">Choose a color</legend>
                        <span className="flex items-center space-x-3">
                          <label className="-m-0.5 relative p-0.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none ring-gray-400">
                            <Input
                              type="radio"
                              name="color-choice"
                              value="White"
                              className="sr-only"
                              aria-labelledby="color-choice-0-label"
                            />
                            <span id="color-choice-0-label" className="sr-only">
                              White
                            </span>
                            <span
                              aria-hidden="true"
                              className="h-8 w-8 bg-white border border-opacity-10 rounded-full"
                            ></span>
                          </label>

                          <label className="-m-0.5 relative p-0.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none ring-gray-400">
                            <Input
                              type="radio"
                              name="color-choice"
                              value="Gray"
                              className="sr-only"
                              aria-labelledby="color-choice-1-label"
                            />
                            <span id="color-choice-1-label" className="sr-only">
                              Gray
                            </span>
                            <span
                              aria-hidden="true"
                              className="h-8 w-8 bg-gray-200 border border-opacity-10 rounded-full"
                            ></span>
                          </label>

                          <label className="-m-0.5 relative p-0.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none ring-gray-900">
                            <Input
                              type="radio"
                              name="color-choice"
                              value="Black"
                              className="sr-only"
                              aria-labelledby="color-choice-2-label"
                            />
                            <span id="color-choice-2-label" className="sr-only">
                              Black
                            </span>
                            <span
                              aria-hidden="true"
                              className="h-8 w-8 bg-gray-900 border border-opacity-10 rounded-full"
                            ></span>
                          </label>
                        </span>
                      </fieldset>
                    </div>

                    {/* <div className="mt-10">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          Size
                        </h4>
                        <a
                          href="#"
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Size guide
                        </a>
                      </div>

                      <fieldset className="mt-4">
                        <legend className="sr-only">Choose a size</legend>
                        <div className="grid grid-cols-4 gap-4">
                          <label className="group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 bg-white shadow-sm text-gray-900 cursor-pointer">
                            <Input
                              type="radio"
                              name="size-choice"
                              value="XXS"
                              className="sr-only"
                              aria-labelledby="size-choice-0-label"
                            />
                            <span id="size-choice-0-label">XXS</span>

                            <span
                              className="pointer-events-none absolute -inset-px rounded-md"
                              aria-hidden="true"
                            ></span>
                          </label>

                          <label className="group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 bg-white shadow-sm text-gray-900 cursor-pointer">
                            <Input
                              type="radio"
                              name="size-choice"
                              value="XS"
                              className="sr-only"
                              aria-labelledby="size-choice-1-label"
                            />
                            <span id="size-choice-1-label">XS</span>

                            <span
                              className="pointer-events-none absolute -inset-px rounded-md"
                              aria-hidden="true"
                            ></span>
                          </label>

                          <label className="group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 bg-white shadow-sm text-gray-900 cursor-pointer">
                            <Input
                              type="radio"
                              name="size-choice"
                              value="S"
                              className="sr-only"
                              aria-labelledby="size-choice-2-label"
                            />
                            <span id="size-choice-2-label">S</span>

                            <span
                              className="pointer-events-none absolute -inset-px rounded-md"
                              aria-hidden="true"
                            ></span>
                          </label>

                          <label className="group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 bg-white shadow-sm text-gray-900 cursor-pointer">
                            <Input
                              type="radio"
                              name="size-choice"
                              value="M"
                              className="sr-only"
                              aria-labelledby="size-choice-3-label"
                            />
                            <span id="size-choice-3-label">M</span>

                            <span
                              className="pointer-events-none absolute -inset-px rounded-md"
                              aria-hidden="true"
                            ></span>
                          </label>

                          <label className="group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 bg-white shadow-sm text-gray-900 cursor-pointer">
                            <Input
                              type="radio"
                              name="size-choice"
                              value="L"
                              className="sr-only"
                              aria-labelledby="size-choice-4-label"
                            />
                            <span id="size-choice-4-label">L</span>

                            <span
                              className="pointer-events-none absolute -inset-px rounded-md"
                              aria-hidden="true"
                            ></span>
                          </label>

                          <label className="group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 bg-white shadow-sm text-gray-900 cursor-pointer">
                            <Input
                              type="radio"
                              name="size-choice"
                              value="XL"
                              className="sr-only"
                              aria-labelledby="size-choice-5-label"
                            />
                            <span id="size-choice-5-label">XL</span>

                            <span
                              className="pointer-events-none absolute -inset-px rounded-md"
                              aria-hidden="true"
                            ></span>
                          </label>

                          <label className="group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 bg-white shadow-sm text-gray-900 cursor-pointer">
                            <Input
                              type="radio"
                              name="size-choice"
                              value="XXL"
                              className="sr-only"
                              aria-labelledby="size-choice-6-label"
                            />
                            <span id="size-choice-6-label">XXL</span>

                            <span
                              className="pointer-events-none absolute -inset-px rounded-md"
                              aria-hidden="true"
                            ></span>
                          </label>

                          <label className="group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 bg-gray-50 text-gray-200 cursor-not-allowed">
                            <Input
                              type="radio"
                              name="size-choice"
                              value="XXXL"
                              disabled
                              className="sr-only"
                              aria-labelledby="size-choice-7-label"
                            />
                            <span id="size-choice-7-label">XXXL</span>

                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                            >
                              <svg
                                className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                                stroke="currentColor"
                              >
                                <line
                                  x1="0"
                                  y1="100"
                                  x2="100"
                                  y2="0"
                                  vectorEffect="non-scaling-stroke"
                                />
                              </svg>
                            </span>
                          </label>
                        </div>
                      </fieldset>
                    </div> */}

                    <div className="mt-6 flex space-x-2">
                      {quantity === 0 ? (
                        <IconButton
                          classContainer="mt-6 transition ease-in duration-300 inline-flex items-center text-sm font-medium mb-2 md:mb-0 bg-purple-500 px-5 py-2 hover:shadow-lg tracking-wider text-white rounded-full hover:bg-purple-600"
                          classIcon={""}
                          onClick={() => increaseCartQuantity(p.id)}
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
                            onClick={() => handleDecreaseCartQuantity(p.id)}
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
                            onClick={() => handleIncreaseCartQuantity(p.id)}
                            isActive={false}
                            title={""}
                            box
                          >
                            +
                          </Button>

                          <Button
                            class="mx-6 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-beer-softBlonde focus:ring-offset-2"
                            onClick={() => {
                              handleRemoveFromCart(p.id);
                            }}
                            isActive={false}
                            title={""}
                            danger
                            small
                          >
                            {t("remove")}
                          </Button>
                        </div>
                      )}

                      <Button
                        onClick={() => handleIncreaseCartQuantity(p.id)}
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

              {/* New Product Review */}
              <div className="col-span-12 flex flex-col justify-center item-center mx-6">
                <NewProductReview
                  beerId={p.id}
                  ownerId={p.owner_id}
                  handleSetReviews={handleSetReviews}
                />
              </div>

              {/* See user reviews */}
              {!emptyReviews && (
                <div className="col-span-12 flex flex-col justify-center item-center mx-6">
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
    </Layout>
  );
}

export async function getServerSideProps(context: { params: any }) {
  const { params } = context;
  const { product: productId } = params;

  let { data: product, error: productsError } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId);

  let { data: productMultimedia, error: errorMultimedia } = await supabase
    .from("product_multimedia")
    .select("*")
    .eq("product_id", productId);

  const { data: reviews, error: reviewError } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId);

  if (productsError) throw productsError;
  if (errorMultimedia) throw errorMultimedia;
  if (reviewError) throw reviewError;

  if (reviews.length == 0) {
    reviews.push({
      id: "0",
      created_at: JSON.stringify(new Date()),
      beer_id: 0,
      owner_id: 0,
      aroma: 0,
      appearance: 0,
      taste: 0,
      mouthfeel: 0,
      bitterness: 0,
      overall: 0,
      comment: "",
    });
  }

  return {
    props: {
      product: product,
      multimedia: productMultimedia,
      reviews,
    },
  };
}
