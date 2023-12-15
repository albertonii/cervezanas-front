import OnlineTimelineStatusText from "../(common-display)/checkout/success/OnlineTimelineStatusText";
import EventTimelineStatusText from "../(common-display)/checkout/event/success/EventTimelineStatusText";
import EventTimelineStatusBar from "../(common-display)/checkout/event/success/EventTimelineStatusBar";
import React from "react";
import { useTranslations } from "next-intl";
import OnlineTimelineStatusBar from "../(common-display)/checkout/success/OnlineTimelineStatusBar";
import DistributorOnlineTimelineStatusBar from "../(roles)/distributor/profile/business_orders/success/DistributorOnlineTimelineStatusBar";
import DistributorOnlineTimelineStatusText from "../(roles)/distributor/profile/business_orders/success/DistributorOnlineTimelineStatusText";

interface OrderTimelineProps {
  orderType: string;
  status: string;
}

export function StatusTimeline({ orderType, status }: OrderTimelineProps) {
  const t = useTranslations();
  return (
    <section className="">
      <span className="text-lg font-medium text-beer-dark sm:text-xl">
        {t("order_status")}:
        <span className="ml-2 text-beer-draft">{t(status)} </span>
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
      {orderType === "distributor_online" && (
        <>
          <DistributorOnlineTimelineStatusBar status={status} />
          <DistributorOnlineTimelineStatusText status={status} />
        </>
      )}
    </section>
  );
}
