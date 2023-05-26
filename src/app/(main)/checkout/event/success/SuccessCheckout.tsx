"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../../../components/Auth";
import { formatDate } from "../../../../../utils";
import { formatCurrency } from "../../../../../utils/formatCurrency";
import { IEventOrder } from "../../../../../lib/types.d";
import EventProduct from "./EventProduct";
import { EventOrderTimeline } from "./EventOrderTimeline";

interface Props {
  isError?: boolean;
  order: IEventOrder;
}
export default function SuccessCheckout({ order, isError }: Props) {
  const { event_order_items: eventOrderItems } = order;

  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setLoading(false);
    }

    return () => {
      setLoading(true);
    };
  }, [user, eventOrderItems]);

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
              {t("status_order_placed")}
              <time dateTime="2021-03-22" className="font-medium text-gray-900">
                {formatDate(order.created_at)}
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

          {/* Order timeline  */}
          <EventOrderTimeline order={order} />

          {/* <!-- Products --> */}
          <div className="mt-6">
            <h2 className="sr-only">{t("products_purchased")}</h2>

            <div className="space-y-8">
              {eventOrderItems &&
                eventOrderItems.map((eventOrderItem) => (
                  <div
                    key={eventOrderItem.id}
                    className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
                  >
                    <EventProduct
                      order={order}
                      eventOrderItem={eventOrderItem}
                    />
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
