"use client";

import EventProduct from "./EventProduct";
import PaymentInformation from "./PaymentInformation";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../../../components/Auth";
import { formatDate } from "../../../../../utils";
import { IEventOrder } from "../../../../../lib/types.d";
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
                {t("order_erorr")}
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
        <div className="container mx-auto space-y-6 sm:py-4 lg:py-6">
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
            </div>

            <p className="text-xl text-gray-600">
              {t("status_order_placed")}
              <time
                dateTime="2021-03-22"
                className="ml-2 font-medium text-gray-900"
              >
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
          <div className="border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border">
            <EventOrderTimeline order={order} />
          </div>

          {/* <!-- Products --> */}
          <div className="space-y-8">
            {eventOrderItems &&
              eventOrderItems.map((eventOrderItem) => (
                <div
                  key={eventOrderItem.id}
                  className="border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
                >
                  <EventProduct eventOrderItem={eventOrderItem} />
                </div>
              ))}
          </div>

          {/* <!-- Payment info --> */}
          <div className="mt-16 w-full border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border">
            <PaymentInformation order={order} />
          </div>
        </div>
      )}
    </>
  );
}
