"use client";

import { useTranslations } from "next-intl";
import { OrderList } from "./OrderList";

export function Orders() {
  const t = useTranslations();

  return (
    <section className="px-4 py-6" aria-label="Orders">
      <span className="flex flex-col space-y-4">
        <h1 className="text-4xl">{t("marketplace_orders")}</h1>
      </span>

      <OrderList />
    </section>
  );
}
