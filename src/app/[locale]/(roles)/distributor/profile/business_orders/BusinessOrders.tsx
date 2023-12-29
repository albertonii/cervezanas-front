"use client";

import { useTranslations } from "next-intl";
import { IOrder } from "../../../../../../lib/types";
import { BusinessOrderList } from "./BusinessOrderList";

interface Props {
  orders: IOrder[];
}

export function BusinessOrders({ orders }: Props) {
  const t = useTranslations();

  return (
    <section className="px-4 py-6" aria-label="Orders">
      <span className="flex flex-col space-y-4">
        <h2 className="text-4xl">{t("marketplace_orders")}</h2>
      </span>

      {orders && orders.length > 0 && <BusinessOrderList orders={orders} />}
    </section>
  );
}
