"use client";

import { useTranslations } from "next-intl";
import { IEventOrder } from "../../../../../../lib/types";
import { EventOrderList } from "./EventOrderList";

interface Props {
  eventOrders: IEventOrder[];
}

export function EventOrders({ eventOrders }: Props) {
  const t = useTranslations();
  return (
    <div className="px-4 py-6" aria-label="Event Orders">
      <div className="flex flex-col space-y-4">
        <div className="text-4xl">{t("event_orders")}</div>
      </div>
      {eventOrders && eventOrders.length > 0 && (
        <EventOrderList eventOrders={eventOrders} />
      )}
    </div>
  );
}