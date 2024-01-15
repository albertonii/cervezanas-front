import { useTranslations } from "next-intl";
import React from "react";
import { ONLINE_ORDER_STATUS } from "../../../../../constants";

interface OrderTimelineProps {
  status: string;
}
export default function OnlineTimelineStatusText({
  status,
}: OrderTimelineProps) {
  const t = useTranslations();

  return (
    <section className="text-md mt-6 hidden grid-cols-4 sm:grid">
      <span
        className={`${
          status === ONLINE_ORDER_STATUS.ORDER_PLACED &&
          "font-bold text-beer-darkGold"
        } `}
      >
        {t("status_order_placed")}
      </span>

      <span
        className={`${
          status === ONLINE_ORDER_STATUS.PROCESSING &&
          "font-bold text-beer-darkGold"
        } text-left`}
      >
        {t("status_processing")}
      </span>

      <span
        className={`${
          status === ONLINE_ORDER_STATUS.SHIPPED &&
          "font-bold text-beer-darkGold"
        } text-left`}
      >
        {t("status_shipped")}
      </span>

      <span
        className={`${
          status === ONLINE_ORDER_STATUS.DELIVERED &&
          "font-bold text-beer-darkGold"
        } text-end`}
      >
        {t("status_delivered")}
      </span>
    </section>
  );
}
