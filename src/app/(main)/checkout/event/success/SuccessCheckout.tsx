"use client";

import Link from "next/link";
import DisplayImageProduct from "../../../../../components/common/DisplayImageProduct";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../../../components/Auth";
import { formatDateString } from "../../../../../utils";
import { formatCurrency } from "../../../../../utils/formatCurrency";
import { IOrder } from "../../../../../lib/types.d";
import { Button } from "../../../../../components/common";
import { COMMON } from "../../../../../constants";
import { EventOrderTimeline } from "./EventOrderTimeline";

interface Props {
  isError?: boolean;
  order: IOrder;
}
export default function SuccessCheckout({ order, isError }: Props) {
  const { products } = order;

  const { t } = useTranslation();

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setLoading(false);
    }

    return () => {
      setLoading(true);
    };
  }, [user, products]);

  const handleOnClick = (productId: string) => {
    router.push(`/products/review/${productId}`);
  };

  const handleInvoicePdf = () => {
    window.open(`/checkout/invoice/${order.order_number}`, "_ blank");
  };

  if (isError) {
    return (
      <div className="container mx-auto sm:py-4 lg:py-6">
        <div className=" space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0">
          <div className="flex flex-col">
            <div className="flex sm:items-baseline sm:space-x-4">
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                Order Error
              </h1>
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
          <div className=" space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0">
            <div className="flex flex-col">
              <div className="flex sm:items-baseline sm:space-x-4">
                <h1 className="text-xl font-extrabold tracking-tight text-beer-dark sm:text-2xl">
                  {t("order_number")} #{order.order_number}
                </h1>

                <p
                  onClick={() => handleInvoicePdf()}
                  className="mt-4 hidden text-sm font-medium tracking-wide text-gray-500 hover:cursor-pointer hover:text-beer-blonde sm:ml-2 sm:mt-0 sm:block"
                >
                  {t("view_invoice")}
                  <span aria-hidden="true"> &rarr;</span>
                </p>
              </div>

              {/* Order Status  */}
              <div className="right-0 col-span-12 pr-12 md:col-span-4 md:mt-2 ">
                <p className=" text-lg font-medium text-beer-dark sm:text-xl">
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
                    className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
                  >
                    <div className="relative grid grid-cols-12 gap-x-8 p-8 px-4 py-6 sm:px-6 lg:grid-cols-12 lg:gap-x-8 lg:p-8">
                      {/* Product Multimedia  */}
                      <div className="col-span-12 mt-6 flex justify-center sm:ml-6 md:col-span-2 md:mt-6">
                        <div className="aspect-w-1 aspect-h-1 sm:aspect-none h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg lg:h-40 lg:w-40">
                          <DisplayImageProduct
                            width={120}
                            height={120}
                            alt={""}
                            imgSrc={`${
                              product.product_multimedia[0]
                                ? product.product_multimedia[0].p_principal
                                : COMMON.MARKETPLACE_PRODUCT
                            }`}
                            class="h-full w-full object-cover object-center sm:h-full sm:w-full"
                          />
                        </div>
                      </div>

                      {/* Product Information  */}
                      <div className="col-span-12 mt-6 md:col-span-4 md:mt-6">
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
                        <div className="col-span-12 mt-6 md:col-span-4 lg:col-span-5">
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
                      <div className="col-span-12 mt-6">
                        <span className="font-medium text-gray-900">
                          {t("review_product")}
                        </span>

                        <div className="mt-3 space-y-3 text-beer-dark">
                          {product.is_reviewed && (
                            <span>
                              {t("product_already_reviewed_condition")}
                            </span>
                          )}

                          {order.status !== "delivered" && (
                            <span>{t("write_review_condition")}</span>
                          )}

                          <Button
                            disabled={
                              product.is_reviewed ||
                              order.status !== "delivered"
                                ? true
                                : false
                            }
                            primary
                            medium
                            class="my-6 font-medium text-beer-draft hover:text-beer-dark "
                            onClick={() => {
                              if (
                                !product.is_reviewed &&
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

                    {/* Timeline  */}
                    <EventOrderTimeline order={order} />
                  </div>
                ))}
            </div>
          </div>

          {/* <!-- Billing --> */}
          <div className="mt-16">
            <h2 className="sr-only">{t("billing_summary")}</h2>

            <div className="bg-gray-100 px-4 py-6 sm:rounded-lg sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-8">
              <dl className="mt-8 items-center divide-y divide-gray-200 text-sm lg:col-span-5 lg:mt-0">
                <div className="flex items-center justify-between pb-4">
                  <dt className="text-gray-600">{t("subtotal")}</dt>
                  <dd className="font-medium text-gray-900">
                    {formatCurrency(order.subtotal)}
                  </dd>
                </div>
                <div className="flex items-center justify-between pb-4">
                  <dt className="text-gray-600">{t("discount")}</dt>
                  <dd className="font-medium text-gray-900">
                    {t("discount_code")} {order.discount_code} {" - "}{" "}
                    {formatCurrency(order.discount)}
                  </dd>
                </div>

                <div className="flex items-center justify-between py-4">
                  <dt className="text-gray-600">{t("tax")}</dt>
                  <dd className="font-medium text-gray-900">
                    {formatCurrency(order.tax)}
                  </dd>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <dt className="font-medium text-gray-900">{t("total")}</dt>
                  <dd className="font-medium text-beer-draft">
                    {formatCurrency(order.total)}
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
