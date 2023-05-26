import React from "react";
import { useTranslation } from "react-i18next";
import { EVENT_ORDER_ITEM_STATUS } from "../../../../../constants";

interface OrderTimelineProps {
  status: string;
}

export function EventProductTimeline({ status }: OrderTimelineProps) {
  const { t } = useTranslation();
  return (
    <div className="border-t border-gray-200 px-4 py-6 sm:px-6 lg:p-8">
      <h4 className="sr-only">{t("status")}</h4>
      <p className="text-sm font-medium text-gray-900">{t(status)}</p>

      <div className="mt-6" aria-hidden="true">
        <div className="flex w-full flex-row overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-2 rounded-l-full ${
              status === EVENT_ORDER_ITEM_STATUS.INITIAL &&
              "w-[10%] bg-beer-blonde"
            }`}
          ></div>
          <div
            className={`h-2   ${
              status === EVENT_ORDER_ITEM_STATUS.WITH_STOCK &&
              "w-[50%] bg-beer-blonde"
            }`}
          ></div>
          <div
            className={`h-2 rounded-r-full ${
              status === EVENT_ORDER_ITEM_STATUS.CONSUMED &&
              "w-[100%] bg-beer-blonde"
            }`}
          ></div>
        </div>

        <div className="mt-6 hidden grid-cols-3 text-sm  sm:grid">
          <div
            className={`${
              status === EVENT_ORDER_ITEM_STATUS.INITIAL &&
              "font-bold text-beer-darkGold"
            } `}
          >
            {t("initial")}
          </div>

          <div
            className={`${
              status === EVENT_ORDER_ITEM_STATUS.WITH_STOCK && "text-beer-draft"
            } text-center`}
          >
            {t("with_stock")}
          </div>

          <div
            className={`${
              status === EVENT_ORDER_ITEM_STATUS.CONSUMED && "text-beer-draft"
            } text-end`}
          >
            {t("consumed")}
          </div>
        </div>
      </div>
    </div>
  );
}
