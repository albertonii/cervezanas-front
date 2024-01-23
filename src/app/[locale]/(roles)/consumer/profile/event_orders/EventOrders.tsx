"use client";

import { useTranslations } from "next-intl";
import { EventOrderList } from "./EventOrderList";

export function EventOrders() {
  const t = useTranslations();
  return (
    <section className="px-4 py-6" aria-label="Event Orders">
      <div className="flex flex-col space-y-4 text-white uppercase font-semibold">
        <span className="text-5xl">{t("event_orders")}</span>
      </div>

      <EventOrderList />
    </section>
  );
}
