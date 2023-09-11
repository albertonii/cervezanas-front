"use client";

import { useTranslations } from "next-intl";
import { OrderList } from "./OrderList";

export function Orders() {
  const t = useTranslations();

  return (
    <div className="px-4 py-6" aria-label="Orders">
      <div className="flex flex-col space-y-4">
        <div className="text-4xl">{t("marketplace_orders")}</div>
      </div>

      <OrderList />
    </div>
  );
}
