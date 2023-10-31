import OnlineTimelineStatusText from "../(common-display)/checkout/success/OnlineTimelineStatusText";
import EventTimelineStatusText from "../(common-display)/checkout/event/success/EventTimelineStatusText";
import EventTimelineStatusBar from "../(common-display)/checkout/event/success/EventTimelineStatusBar";
import React from "react";
import { useTranslations } from "next-intl";
import OnlineTimelineStatusBar from "../(common-display)/checkout/success/OnlineTimelineStatusBar";

interface OrderTimelineProps {
  orderType: string;
  status: string;
}

export function StatusTimeline({ orderType, status }: OrderTimelineProps) {
  const t = useTranslations();
  return (
    <section className="px-4 py-6 sm:px-6 lg:p-8">
      <span className=" text-lg font-medium text-beer-dark sm:text-xl">
        {t("order_status")}: <h3 className="text-beer-draft">{t(status)} </h3>
      </span>

      {orderType === "online" && (
        <>
          <OnlineTimelineStatusText status={status} />
          <OnlineTimelineStatusBar status={status} />
        </>
      )}
      {orderType === "event" && (
        <>
          <EventTimelineStatusText status={status} />
          <EventTimelineStatusBar status={status} />
        </>
      )}
    </section>
  );
}
