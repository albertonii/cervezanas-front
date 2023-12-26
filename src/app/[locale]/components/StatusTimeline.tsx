import OnlineTimelineStatusText from "../(common-display)/checkout/success/OnlineTimelineStatusText";
import EventTimelineStatusText from "../(common-display)/checkout/event/success/EventTimelineStatusText";
import EventTimelineStatusBar from "../(common-display)/checkout/event/success/EventTimelineStatusBar";
import React from "react";
import { useTranslations } from "next-intl";
import OnlineTimelineStatusBar from "../(common-display)/checkout/success/OnlineTimelineStatusBar";
import DistributorOnlineTimelineStatusBar from "../(roles)/distributor/profile/business_orders/success/DistributorOnlineTimelineStatusBar";
import DistributorOnlineTimelineStatusText from "../(roles)/distributor/profile/business_orders/success/DistributorOnlineTimelineStatusText";
import {
  DISTRIBUTOR_ONLINE_ORDER_STATUS,
  ONLINE_ORDER_STATUS,
  ORDER_TYPE,
} from "../../../constants";

interface OrderTimelineProps {
  orderType: string;
  status: string;
}

export function StatusTimeline({ orderType, status }: OrderTimelineProps) {
  const t = useTranslations();
  return (
    <section className="">
      <span className={`text-lg font-medium text-beer-dark sm:text-xl`}>
        {orderType === ORDER_TYPE.ONLINE && `${t("order_status")}:`}

        {orderType === ORDER_TYPE.EVENT && `${t("order_status")}:`}

        {orderType === ORDER_TYPE.DISTRIBUTOR_ONLINE &&
          `${t("order_business_pack_status")}:`}

        <span
          className={`
        ${
          status === DISTRIBUTOR_ONLINE_ORDER_STATUS.DELIVERED &&
          "text-green-600"
        }
         ${status === ONLINE_ORDER_STATUS.DELIVERED && "text-green-600"}
          ml-2 text-beer-draft`}
        >
          {t(status)}
        </span>
      </span>

      {orderType === ORDER_TYPE.ONLINE && (
        <>
          <OnlineTimelineStatusText status={status} />
          <OnlineTimelineStatusBar status={status} />
        </>
      )}
      {orderType === ORDER_TYPE.EVENT && (
        <>
          <EventTimelineStatusText status={status} />
          <EventTimelineStatusBar status={status} />
        </>
      )}
      {orderType === ORDER_TYPE.DISTRIBUTOR_ONLINE && (
        <>
          <DistributorOnlineTimelineStatusBar status={status} />
          <DistributorOnlineTimelineStatusText status={status} />
        </>
      )}
    </section>
  );
}
