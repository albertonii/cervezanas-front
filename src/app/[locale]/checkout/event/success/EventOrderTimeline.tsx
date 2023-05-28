import React from "react";
import { useTranslation } from "react-i18next";
import { EVENT_ORDER_STATUS } from "../../../../../constants";
import { IEventOrder } from "../../../../../lib/types.d";

interface OrderTimelineProps {
  order: IEventOrder;
}

export function EventOrderTimeline({ order }: OrderTimelineProps) {
  const { t } = useTranslation();
  return (
    <div className="px-4 py-6 sm:px-6 lg:p-8">
      <p className=" text-lg font-medium text-beer-dark sm:text-xl">
        {t("order_status")}:{" "}
        <span className="text-beer-draft">{t(order.status)} </span>
      </p>

      <div className="mt-6" aria-hidden="true">
        <div className="flex w-full flex-row overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-2 rounded-l-full ${
              order.status === EVENT_ORDER_STATUS.ORDER_PLACED &&
              "w-[10%] bg-beer-blonde"
            }`}
          ></div>

          <div
            className={`h-2  ${
              order.status === EVENT_ORDER_STATUS.PAID &&
              "w-[30%] bg-beer-blonde "
            }`}
          ></div>

          <div
            className={`h-2   ${
              order.status === EVENT_ORDER_STATUS.WITH_SERVICES_TO_CONSUME &&
              "w-[63%] bg-beer-blonde"
            }`}
          ></div>

          <div
            className={`h-2 rounded-r-full ${
              order.status === EVENT_ORDER_STATUS.SERVED &&
              "w-[100%] bg-beer-blonde"
            }`}
          ></div>
        </div>

        <div className="text-md mt-6 hidden grid-cols-4 sm:grid">
          <div
            className={`${
              order.status === EVENT_ORDER_STATUS.ORDER_PLACED &&
              "font-bold text-beer-darkGold"
            } `}
          >
            {t("status_order_placed")}
          </div>

          <div
            className={`${
              order.status === EVENT_ORDER_STATUS.PAID &&
              "font-bold text-beer-darkGold"
            } text-left`}
          >
            {t("status_paid")}
          </div>

          <div
            className={`${
              order.status === EVENT_ORDER_STATUS.WITH_SERVICES_TO_CONSUME &&
              "font-bold text-beer-darkGold"
            } text-left`}
          >
            {t("status_with_services_to_consume")}
          </div>

          <div
            className={`${
              order.status === EVENT_ORDER_STATUS.SERVED &&
              "font-bold text-beer-darkGold"
            } text-end`}
          >
            {t("status_served")}
          </div>
        </div>
      </div>
    </div>
  );
}
