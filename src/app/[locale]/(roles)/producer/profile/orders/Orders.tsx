"use client";

import { useTranslations } from "next-intl";
import { IOrder } from "../../../../../../lib/types";
import { OrderList } from "./OrderList";

interface Props {
  orders: IOrder[];
}

export function Orders({ orders }: Props) {
  const t = useTranslations();

  return (
    <section className="px-4 py-6" aria-label="Orders">
      <p className="flex flex-col space-y-4">
        <h2 className="text-4xl">{t("marketplace_orders")}</h2>
      </p>

      {orders && orders.length > 0 && <OrderList orders={orders} />}
    </section>
  );
}
