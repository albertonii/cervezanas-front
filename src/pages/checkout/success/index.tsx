import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { NextApiRequest } from "next";
import { useAuth } from "../../../components/Auth";
import { Button } from "../../../components/common";
import { IOrder, IProduct } from "../../../lib/types.d";
import { formatDateString } from "../../../utils";
import { formatCurrency } from "../../../utils/formatCurrency";
import { supabase } from "../../../utils/supabaseClient";
import { decodeBase64, isValidObject } from "../../../utils/utils";
import DisplayImageProduct from "../../../components/common/DisplayImageProduct";

interface Props {
  isError?: boolean;
  order: IOrder;
  products: IProduct[];
}

export default function Success({ order, products, isError }: Props) {
  const { t } = useTranslation();

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const { loggedIn } = useAuth();

  useEffect(() => {
    if (loggedIn) {
      setLoading(false);
    }

    return () => {
      setLoading(true);
    };
  }, [loggedIn, products]);

  const handleOnClick = (productId: string) => {
    router.push(`/products/review/${productId}`);
  };

  const handleInvoicePdf = () => {
    window.open(`/checkout/invoice/${order.order_number}`, "_ blank");
  };

  if (isError) {
    return (
      <div className="container mx-auto sm:py-4 lg:py-6">
        <div className=" px-4 space-y-2 sm:px-0 sm:flex sm:items-baseline sm:justify-between sm:space-y-0">
          <div className="flex flex-col">
            <div className="flex sm:items-baseline sm:space-x-4">
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                Order Error
              </h1>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {t("order_details")}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Details and status for your order.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {!loading && (
        <div className="container mx-auto sm:py-4 lg:py-6">
          <div className=" px-4 space-y-2 sm:px-0 sm:flex sm:items-baseline sm:justify-between sm:space-y-0">
            <div className="flex flex-col">
              <div className="flex sm:items-baseline sm:space-x-4">
                <h1 className="text-xl font-extrabold tracking-tight text-beer-dark sm:text-2xl">
                  {t("order_number")} #{order.order_number}
                </h1>

                <p
                  onClick={() => handleInvoicePdf()}
                  className="hidden font-medium hover:text-beer-blonde hover:cursor-pointer sm:block text-sm tracking-wide text-gray-500 mt-4 sm:mt-0 sm:ml-2"
                >
                  {t("view_invoice")}
                  <span aria-hidden="true"> &rarr;</span>
                </p>
              </div>

              {/* Order Status  */}
              <div className="md:mt-2 col-span-12 md:col-span-4 right-0 pr-12 ">
                <p className=" text-lg sm:text-xl font-medium text-beer-dark">
                  {t("order_status")}:{" "}
                  <span className="text-beer-draft">{t(order.status)} </span>
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600">
              {t("status_order_placed")}{" "}
              <time dateTime="2021-03-22" className="font-medium text-gray-900">
                {formatDateString(order.issue_date.toString())}
              </time>
            </p>
            <a
              href="#"
              className="text-sm font-medium hover:text-beer-blonde sm:hidden"
            >
              {t("view_invoice")}
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </div>

          {/* <!-- Products --> */}
          <div className="mt-6">
            <h2 className="sr-only">{t("products_purchased")}</h2>

            <div className="space-y-8">
              {products &&
                products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border-t border-b border-gray-200 shadow-sm sm:border sm:rounded-lg"
                  >
                    <div className="relative py-6 px-4 sm:px-6 grid grid-cols-12 gap-x-8 p-8 lg:grid-cols-12 lg:gap-x-8 lg:p-8">
                      {/* Product Multimedia  */}
                      <div className="flex justify-center col-span-12 md:col-span-2 sm:ml-6 mt-6 md:mt-6">
                        <div className="flex-shrink-0 aspect-w-1 aspect-h-1 rounded-lg overflow-hidden sm:aspect-none w-20 h-20 lg:w-40 lg:h-40">
                          {isValidObject(
                            product.product_multimedia[0].p_principal
                          ) && (
                            <DisplayImageProduct
                              width={120}
                              height={120}
                              alt={""}
                              imgSrc={`${product.product_multimedia[0].p_principal}`}
                              class="w-full h-full object-center object-cover sm:w-full sm:h-full"
                            />
                          )}
                        </div>
                      </div>

                      {/* Product Information  */}
                      <div className="mt-6 md:mt-6 col-span-12 md:col-span-4">
                        <h3 className="text-base font-medium text-gray-900 hover:text-beer-draft">
                          <Link href={`/products/${product.id}`}>
                            {product.name}
                          </Link>
                        </h3>
                        <p className="mt-2 text-sm font-medium text-gray-900">
                          {t("price")} - {formatCurrency(product.price)}
                        </p>
                        <p className="mt-2 text-sm font-medium text-gray-900">
                          {t("quantity")} -
                        </p>
                        <p className="mt-3 text-sm text-gray-500">
                          {t("description")} - {product.description}
                        </p>
                      </div>

                      {/* Shipping Information  */}
                      {order.shipping_info && (
                        <div className="mt-6 col-span-12 lg:col-span-5 md:col-span-4">
                          <dt className="font-medium text-gray-900">
                            {t("shipping_address")}
                          </dt>

                          <dd className="mt-3 text-gray-500">
                            <span className="block">
                              {order.shipping_info.name}{" "}
                              {order.shipping_info.lastname}
                            </span>
                            <span className="block">
                              {order.shipping_info.address},{" "}
                              {order.shipping_info.city},
                              {order.shipping_info.state},{" "}
                              {order.shipping_info.zipcode},
                              {order.shipping_info.country}
                            </span>

                            {order.shipping_info.address_extra && (
                              <>
                                <span className="block">
                                  {order.shipping_info.address_extra}
                                </span>
                                <span className="block">
                                  {order.shipping_info.address_observation}
                                </span>
                              </>
                            )}
                          </dd>
                        </div>
                      )}

                      {/* Review Product  */}
                      <div className="mt-6 col-span-12">
                        <span className="font-medium text-gray-900">
                          {t("review_product")}
                        </span>

                        <div className="mt-3 text-beer-dark space-y-3">
                          {product.order_item[0].is_reviewed && (
                            <span>
                              {t("product_already_reviewed_condition")}
                            </span>
                          )}

                          {order.status !== "delivered" && (
                            <span>{t("write_review_condition")}</span>
                          )}

                          <Button
                            disabled={
                              product.order_item[0].is_reviewed ||
                              order.status !== "delivered"
                                ? true
                                : false
                            }
                            primary
                            medium
                            class="font-medium text-beer-draft hover:text-beer-dark my-6 "
                            onClick={() => {
                              if (
                                !product.order_item[0].is_reviewed &&
                                order.status === "delivered"
                              ) {
                                handleOnClick(product.id);
                              }
                            }}
                          >
                            {t("make_review_product_button")}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6 lg:p-8">
                      <h4 className="sr-only">Status</h4>
                      <p className="text-sm font-medium text-gray-900">
                        Preparing to ship on{" "}
                        <time dateTime="2021-03-24">March 24, 2021</time>
                      </p>
                      <div className="mt-6" aria-hidden="true">
                        <div className="bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-2 bg-beer-blonde rounded-full"></div>
                        </div>
                        <div className="hidden sm:grid grid-cols-4 text-sm font-medium text-gray-600 mt-6">
                          <div className="text-beer-draft">
                            {t("order_placed")}
                          </div>
                          <div className="text-center text-beer-draft">
                            {t("status_processing")}
                          </div>
                          <div className="text-center">
                            {t("status_shipped")}
                          </div>
                          <div className="text-right">
                            {t("status_delivered")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* <!-- Billing --> */}
          <div className="mt-16">
            <h2 className="sr-only">{t("billing_summary")}</h2>

            <div className="bg-gray-100 py-6 px-4 sm:px-6 sm:rounded-lg lg:px-8 lg:py-8 lg:grid lg:grid-cols-12 lg:gap-x-8">
              {order.billing_info && (
                <dl className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-2 md:gap-x-8 lg:col-span-7">
                  <div>
                    <dt className="font-medium text-gray-900">
                      {t("billing_address")}
                    </dt>
                    <dd className="mt-3 text-gray-500">
                      <span className="block">
                        {order.billing_info.name} {order.billing_info.lastname}
                      </span>
                      <span className="block">
                        {order.billing_info.address}, {order.billing_info.city},
                        {order.billing_info.state}, {order.billing_info.zipcode}
                        ,{order.billing_info.country}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-900">
                      {t("payment_information")}
                    </dt>
                    <div className="mt-3">
                      <dd className="-ml-4 -mt-4 flex flex-wrap">
                        <div className="ml-4 mt-4 flex-shrink-0">
                          <svg
                            aria-hidden="true"
                            width="36"
                            height="24"
                            viewBox="0 0 36 24"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-auto"
                          >
                            <rect
                              width="36"
                              height="24"
                              rx="4"
                              fill="#224DBA"
                            />
                            <path
                              d="M10.925 15.673H8.874l-1.538-6c-.073-.276-.228-.52-.456-.635A6.575 6.575 0 005 8.403v-.231h3.304c.456 0 .798.347.855.75l.798 4.328 2.05-5.078h1.994l-3.076 7.5zm4.216 0h-1.937L14.8 8.172h1.937l-1.595 7.5zm4.101-5.422c.057-.404.399-.635.798-.635a3.54 3.54 0 011.88.346l.342-1.615A4.808 4.808 0 0020.496 8c-1.88 0-3.248 1.039-3.248 2.481 0 1.097.969 1.673 1.653 2.02.74.346 1.025.577.968.923 0 .519-.57.75-1.139.75a4.795 4.795 0 01-1.994-.462l-.342 1.616a5.48 5.48 0 002.108.404c2.108.057 3.418-.981 3.418-2.539 0-1.962-2.678-2.077-2.678-2.942zm9.457 5.422L27.16 8.172h-1.652a.858.858 0 00-.798.577l-2.848 6.924h1.994l.398-1.096h2.45l.228 1.096h1.766zm-2.905-5.482l.57 2.827h-1.596l1.026-2.827z"
                              fill="#fff"
                            />
                          </svg>
                          <p className="sr-only">Visa</p>
                        </div>
                        <div className="ml-4 mt-4">
                          <p className="text-gray-900">
                            {t("ending_with")} 4242
                          </p>
                          <p className="text-gray-600">
                            {t("expires_at")} 02 / 24
                          </p>
                        </div>
                      </dd>
                    </div>
                  </div>
                </dl>
              )}

              <dl className="mt-8 divide-y divide-gray-200 text-sm lg:mt-0 lg:col-span-5">
                <div className="pb-4 flex items-center justify-between">
                  <dt className="text-gray-600">{t("subtotal")}</dt>
                  <dd className="font-medium text-gray-900">
                    {formatCurrency(order.subtotal)}
                  </dd>
                </div>
                <div className="pb-4 flex items-center justify-between">
                  <dt className="text-gray-600">{t("discount")}</dt>
                  <dd className="font-medium text-gray-900">
                    {t("discount_code")} {order.discount_code} {" - "}{" "}
                    {formatCurrency(order.discount)}
                  </dd>
                </div>
                <div className="py-4 flex items-center justify-between">
                  <dt className="text-gray-600">{t("shipping")}</dt>
                  <dd className="font-medium text-gray-900">
                    {formatCurrency(order.shipping)}
                  </dd>
                </div>
                <div className="py-4 flex items-center justify-between">
                  <dt className="text-gray-600">{t("tax")}</dt>
                  <dd className="font-medium text-gray-900">
                    {formatCurrency(order.tax)}
                  </dd>
                </div>
                <div className="pt-4 flex items-center justify-between">
                  <dt className="font-medium text-gray-900">{t("total")}</dt>
                  <dd className="font-medium text-beer-draft">
                    {formatCurrency(order.subtotal)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export async function getServerSideProps(req: NextApiRequest) {
  const { Ds_MerchantParameters } = req.query as {
    Ds_MerchantParameters: string;
    Ds_SignatureVersion: string;
    Ds_Signature: string;
  };

  const { Ds_Order: orderNumber } = JSON.parse(
    decodeBase64(Ds_MerchantParameters)
  );

  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .select(
      `
      *,
      shipping_info(id, *),
      billing_info(id, *),
      products(
        id, 
        name, 
        price,
        product_multimedia(*),
        order_item(*)
      )
    `
    )
    .eq("order_number", orderNumber);

  if (orderError) {
    console.error(orderError.message);
    return {
      props: {
        isError: true,
        order: null,
        products: null,
      },
    };
  }

  if (!orderData || orderData.length === 0) {
    return {
      props: {
        order: null,
      },
    };
  }

  return {
    props: {
      order: orderData[0],
      products: orderData[0].products,
    },
  };
}
