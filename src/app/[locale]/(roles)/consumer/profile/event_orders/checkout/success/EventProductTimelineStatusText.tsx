import React from "react";
import { useTranslations } from "next-intl";
import { EVENT_ORDER_ITEM_STATUS } from "../../../../../../../../constants";

interface OrderTimelineProps {
  status: string;
}
export default function EventProductTimelineStatusBar({
  status,
}: OrderTimelineProps) {
  const t = useTranslations();

  return (
    <section className="text-md mt-6 hidden grid-cols-3 sm:grid">
      <span
        className={`${
          status === EVENT_ORDER_ITEM_STATUS.INITIAL &&
          "font-bold text-beer-darkGold"
        } `}
      >
        {t("status_order_placed")}
      </span>

      <span
        className={`${
          status === EVENT_ORDER_ITEM_STATUS.WITH_STOCK &&
          "font-bold text-beer-darkGold"
        } text-center`}
      >
        {t("status_with_stock")}
      </span>

      <span
        className={`${
          status === EVENT_ORDER_ITEM_STATUS.CONSUMED &&
          "font-bold text-beer-darkGold"
        } text-right`}
      >
        {t("status_consumed")}
      </span>
    </section>
  );
}
