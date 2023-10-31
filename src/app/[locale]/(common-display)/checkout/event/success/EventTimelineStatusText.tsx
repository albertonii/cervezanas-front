import React from "react";
import { useTranslations } from "next-intl";
import { EVENT_ORDER_STATUS } from "../../../../../../constants";

interface OrderTimelineProps {
  status: string;
}
export default function EventTimelineStatusText({
  status,
}: OrderTimelineProps) {
  const t = useTranslations();

  return (
    <section className="text-md mt-6 hidden grid-cols-4 sm:grid">
      <span
        className={`${
          status === EVENT_ORDER_STATUS.ORDER_PLACED &&
          "font-bold text-beer-darkGold"
        } `}
      >
        {t("status_order_placed")}
      </span>

      <span
        className={`${
          status === EVENT_ORDER_STATUS.PAID && "font-bold text-beer-darkGold"
        } text-left`}
      >
        {t("status_processing")}
      </span>

      <span
        className={`${
          status === EVENT_ORDER_STATUS.WITH_SERVICES_TO_CONSUME &&
          "font-bold text-beer-darkGold"
        } text-left`}
      >
        {t("status_with_services_to_consume")}
      </span>

      <span
        className={`${
          status === EVENT_ORDER_STATUS.SERVED && "font-bold text-beer-darkGold"
        } text-end`}
      >
        {t("status_served")}
      </span>
    </section>
  );
}
