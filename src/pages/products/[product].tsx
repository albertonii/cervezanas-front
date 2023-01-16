import { Button, Input } from "@supabase/ui";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useShoppingCart } from "../../components/Context/ShoppingCartContext";
import NewProductReview from "../../components/NewProductReview";
import ProductGallery from "../../components/ProductGallery";
import ProductOverallReview from "../../components/ProductOverallReview";
import ProductReviews from "../../components/ProductReviews";
import ToastNotification from "../../components/ToastNotification";
import { SupabaseProps } from "../../constants";
import { ProductMultimedia, Review } from "../../types";
import { formatCurrency } from "../../utils/formatCurrency";
import { supabase } from "../../utils/supabaseClient";

const productsUrl = `${SupabaseProps.BASE_URL}${SupabaseProps.STORAGE_PRODUCTS_IMG_URL}`;
const pPrincipalUrl = `${productsUrl}${SupabaseProps.P_PRINCIPAL_URL}`;
const pBackUrl = `${productsUrl}${SupabaseProps.P_BACK_URL}`;
const pExtra1Url = `${productsUrl}${SupabaseProps.P_EXTRA_1_URL}`;
const pExtra2Url = `${productsUrl}${SupabaseProps.P_EXTRA_2_URL}`;
const pExtra3Url = `${productsUrl}${SupabaseProps.P_EXTRA_3_URL}`;
const pExtra4Url = `${productsUrl}${SupabaseProps.P_EXTRA_4_URL}`;

interface Props {
  product: any[];
  multimedia: any[];
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

  const {
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
  } = useShoppingCart();

  const quantity = getItemQuantity(p.id);

  useEffect(() => {
    setGallery([]);

    setGallery((oldGallery) => [
      ...oldGallery,
      m.p_principal !== "undefined" && m.p_principal !== null
        ? pPrincipalUrl + `${p.owner_id}/` + m.p_principal
        : "",
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

  return (
    <div className=" relative z-10" role="dialog" aria-modal="true">
      <div className="container flex lg:flex-wrap justify-between items-center mx-auto w-full transform transition h-full mt-6">
        <div className="relative flex w-full items-center overflow-hidden bg-white  pt-14 pb-8 sm:pt-8 ">
          <div className="grid w-full grid-cols-1 items-start gap-y-8 lg:grid-cols-12 lg:px-6">
            <div className="flex items-center justify-center aspect-w-2 aspect-h-3 overflow-hidden rounded-lg bg-gray-100 sm:col-span-4 lg:col-span-5 h-3/4  mx-6">
              {/* <Image
                width={200}
                height={200}
                src={`${pPrincipalUrl}${m.p_principal}`}
                alt="Two each of gray, white, and black shirts arranged on table."
                className=""
              /> */}

              <ProductGallery gallery={gallery} />
            </div>

            <div className="sm:col-span-8 lg:col-span-7 mx-6 ">
              <div className="flex flex-column">
                <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">
                  {p.name}
                </h2>

                <div>
                  <h4 className="sr-only">{t("reviews")}</h4>

                  <div className="">
                    <div className="flex items-center">
                      <svg
                        className="text-gray-900 h-5 w-5 flex-shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                          clipRule="evenodd"
                        />
                      </svg>

                      <svg
                        className="text-gray-900 h-5 w-5 flex-shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                          clipRule="evenodd"
                        />
                      </svg>

                      <svg
                        className="text-gray-900 h-5 w-5 flex-shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                          clipRule="evenodd"
                        />
                      </svg>

                      <svg
                        className="text-gray-900 h-5 w-5 flex-shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                          clipRule="evenodd"
                        />
                      </svg>

                      <svg
                        className="text-gray-200 h-5 w-5 flex-shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                          clipRule="evenodd"
                        />
                      </svg>
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
                  Product information
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
                  Product options
                </h3>

                <form>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Color</h4>

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

                  <div className="mt-10">
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
                  </div>

                  <div>
                    {quantity === 0 ? (
                      <Button
                        onClick={() => increaseCartQuantity(p.id)}
                        className="mt-6 transition ease-in duration-300 inline-flex items-center text-sm font-medium mb-2 md:mb-0 bg-purple-500 px-5 py-2 hover:shadow-lg tracking-wider text-white rounded-full hover:bg-purple-600 "
                      >
                        <span>{t("add_to_cart")}</span>
                      </Button>
                    ) : (
                      <div className="flex flex-row align-center mt-6">
                        <Button
                          className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          onClick={() => decreaseCartQuantity(p.id)}
                        >
                          -
                        </Button>

                        <div className="ml-6 ">
                          <span className="text-beer-dark items-center justify-center text-xl">
                            {quantity}
                          </span>
                        </div>

                        <Button
                          className="ml-6  flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          onClick={() => increaseCartQuantity(p.id)}
                        >
                          +
                        </Button>

                        <Button
                          type="secondary"
                          danger
                          className="ml-6 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          onClick={() => {
                            removeFromCart(p.id);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </form>
              </section>
            </div>

            {/* Reviews */}
            <div className="sm:col-span-12 flex flex-col justify-center item-center px-8">
              <ProductOverallReview
                reviews={productReviews}
                emptyReviews={emptyReviews}
              />
            </div>

            {/* New Product Review */}
            <div className="sm:col-span-12 flex flex-col justify-center item-center px-8">
              <NewProductReview
                beerId={p.id}
                ownerId={p.owner_id}
                handleSetReviews={handleSetReviews}
              />
            </div>

            {/* See user reviews */}
            {!emptyReviews && (
              <div className="sm:col-span-12 flex flex-col justify-center item-center px-8">
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
  );
}

export async function getServerSideProps(context: { params: any }) {
  const { params } = context;
  const { product: productId } = params;

  let { data: beers, error: beersError } = await supabase
    .from("beers")
    .select("*")
    .eq("id", productId);

  let { data: beerMultimedia, error: errorMultimedia } = await supabase
    .from("product_multimedia")
    .select("*")
    .eq("beer_id", productId);

  const { data: reviews, error: reviewError } = await supabase
    .from("reviews")
    .select("*")
    .eq("beer_id", productId);

  if (beersError) throw beersError;
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
      product: beers,
      multimedia: beerMultimedia,
      reviews,
    },
  };
}
