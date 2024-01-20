"use client";

import BusinessOrderDetails from "./BusinessOrderDetails";
import Spinner from "../../../../../../components/common/Spinner";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../../../Auth/useAuth";
import { IOrder } from "../../../../../../../../lib/types";
import { useTranslations } from "next-intl";
import { ONLINE_ORDER_STATUS } from "../../../../../../../../constants";
import { formatDateString } from "../../../../../../../../utils/formatDate";
import { formatCurrency } from "../../../../../../../../utils/formatCurrency";
interface Props {
  isError?: boolean;
  order: IOrder;
}

export default function SuccessCheckout({ order, isError }: Props) {
  const { business_orders: bOrders } = order;

  const t = useTranslations();

  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setLoading(false);
    }

    return () => {
      setLoading(true);
    };
  }, [user]);

  const handleInvoicePdf = () => {
    // Get current url
    const currentUrl = window.location.href;

    window.open(
      `/${currentUrl}/checkout/invoice/${order.order_number}`,
      "_ blank"
    );
  };

  if (isError) {
    return (
      <section className="container mx-auto flex flex-col space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0 sm:py-4 lg:py-6">
        <span className="sm:items-baseline sm:space-x-4">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            {t("order_erorr")}
          </h1>
        </span>
      </section>
    );
  }

  if (loading) return <Spinner color="beer-blonde" size="fullScreen" />;

  return (
    <section className="m-4 sm:py-4 lg:py-6">
      <div className="space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0">
        <header className="flex flex-col">
          <span className="flex sm:items-baseline sm:space-x-4">
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
          </span>

          {/* Order Status  */}
          <div className="right-0 col-span-12 pr-12 md:col-span-4 md:mt-2 ">
            <span className="text-lg font-medium text-beer-dark sm:text-xl">
              {t("order_status")}:
              <span
                className={`ml-2 ${
                  order.status === ONLINE_ORDER_STATUS.DELIVERED
                    ? "text-green-600"
                    : "text-beer-draft"
                } `}
              >
                {t(order.status)}
              </span>
            </span>
          </div>
        </header>

        <p className="text-sm text-gray-600">
          {t("status_order_placed")}
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

      {/* Product and packs information */}
      {bOrders &&
        bOrders.map((bOrder) => {
          return (
            <article key={bOrder.id} className="py-4">
              <BusinessOrderDetails bOrder={bOrder} />
            </article>
          );
        })}

      {/* <!-- Shipping --> */}
      <section className="bg-gray-100 px-4 py-6 sm:rounded-lg sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-8">
        {order.shipping_info && (
          <dl className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-2 md:gap-x-8 lg:col-span-7">
            <div>
              <dt className="font-medium text-gray-900">
                {t("shipping_address")}
              </dt>

              <dd className="mt-3 text-gray-500">
                <span className="block font-semibold">
                  {order.shipping_info.name} {order.shipping_info.lastname}
                </span>
                <span className="block">
                  {order.shipping_info.address}, {order.shipping_info.city},
                  {order.shipping_info.state}, {order.shipping_info.zipcode},
                  {order.shipping_info.country}
                </span>

                {order.shipping_info.address_extra && (
                  <>
                    <span className="block">
                      {order.shipping_info.address_extra}
                    </span>
                    <span className="block">
                      {order.shipping_info.address_observations}
                    </span>
                  </>
                )}
              </dd>
            </div>
          </dl>
        )}
      </section>

      {/* <!-- Billing --> */}
      <section className="bg-gray-100 px-4 py-6 sm:rounded-lg sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-8">
        {order.billing_info && (
          <dl className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-2 md:gap-x-8 lg:col-span-7">
            <div>
              <dt className="font-medium text-gray-900">
                {t("billing_address")}
              </dt>

              <dd className="mt-3 text-gray-500">
                <span className="block font-semibold">
                  {order.billing_info.name} {order.billing_info.lastname}
                </span>
                <span className="block">
                  {order.billing_info.address}, {order.billing_info.city},
                  {order.billing_info.state}, {order.billing_info.zipcode},
                  {order.billing_info.country}
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
                      <rect width="36" height="24" rx="4" fill="#224DBA" />
                      <path
                        d="M10.925 15.673H8.874l-1.538-6c-.073-.276-.228-.52-.456-.635A6.575 6.575 0 005 8.403v-.231h3.304c.456 0 .798.347.855.75l.798 4.328 2.05-5.078h1.994l-3.076 7.5zm4.216 0h-1.937L14.8 8.172h1.937l-1.595 7.5zm4.101-5.422c.057-.404.399-.635.798-.635a3.54 3.54 0 011.88.346l.342-1.615A4.808 4.808 0 0020.496 8c-1.88 0-3.248 1.039-3.248 2.481 0 1.097.969 1.673 1.653 2.02.74.346 1.025.577.968.923 0 .519-.57.75-1.139.75a4.795 4.795 0 01-1.994-.462l-.342 1.616a5.48 5.48 0 002.108.404c2.108.057 3.418-.981 3.418-2.539 0-1.962-2.678-2.077-2.678-2.942zm9.457 5.422L27.16 8.172h-1.652a.858.858 0 00-.798.577l-2.848 6.924h1.994l.398-1.096h2.45l.228 1.096h1.766zm-2.905-5.482l.57 2.827h-1.596l1.026-2.827z"
                        fill="#fff"
                      />
                    </svg>
                    <p className="sr-only">Visa</p>
                  </div>
                  <div className="ml-4 mt-4">
                    <p className="text-gray-900">{t("ending_with")} 4242</p>
                    <p className="text-gray-600">{t("expires_at")} 02 / 24</p>
                  </div>
                </dd>
              </div>
            </div>
          </dl>
        )}

        <dl className="mt-8 divide-y divide-gray-200 text-sm lg:col-span-5 lg:mt-0">
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
            <dt className="text-gray-600">{t("shipping")}</dt>
            <dd className="font-medium text-gray-900">
              {formatCurrency(order.shipping)}
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
      </section>
    </section>
  );
}
