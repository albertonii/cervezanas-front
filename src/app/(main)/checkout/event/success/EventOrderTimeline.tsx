import React from "react";
import { useTranslation } from "react-i18next";
import { IOrder } from "../../../../../lib/types";

interface OrderTimelineProps {
  order: IOrder;
}

export function EventOrderTimeline({ order }: OrderTimelineProps) {
  const { t } = useTranslation();
  return (
    <div className="border-t border-gray-200 px-4 py-6 sm:px-6 lg:p-8">
      <h4 className="sr-only">Status</h4>
      <p className="text-sm font-medium text-gray-900">{t(order.status)}</p>

      <div className="mt-6" aria-hidden="true">
        <div className="flex w-full flex-row overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-2 w-[10%] rounded-l-full ${
              order.status === "order_placed" && "bg-beer-blonde"
            }`}
          ></div>
          <div
            className={`h-2 w-[40%]  ${
              order.status === "status_paid" && "bg-beer-blonde"
            }`}
          ></div>
          <div
            className={`h-2 w-[50%] rounded-r-full ${
              order.status === "status_served" && "bg-beer-blonde"
            }`}
          ></div>
        </div>

        <div className="mt-6 hidden grid-cols-3 text-sm  sm:grid">
          <div
            className={`${
              order.status === "order_placed" && "font-bold text-beer-darkGold"
            } `}
          >
            {t("status_order_placed")}
          </div>

          <div
            className={`${
              order.status === "status_paid" && "text-beer-draft"
            } text-center`}
          >
            {t("status_paid")}
          </div>

          <div
            className={`${
              order.status === "status_served" && "text-beer-draft"
            } text-end`}
          >
            {t("status_served")}
          </div>
        </div>
      </div>
    </div>
  );
}
