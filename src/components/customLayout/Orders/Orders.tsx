"use client";

import { useTranslation } from "react-i18next";
import { OrderList } from "..";
import { IOrder } from "../../../lib/types.d";

interface Props {
  orders: IOrder[];
}

export function Orders({ orders }: Props) {
  const { t } = useTranslation();

  return (
    <div className="px-4 py-6" aria-label="Orders">
      <div className="flex flex-col">
        <div className="pr-12 text-4xl">{t("orders")}</div>
      </div>
      {orders && orders.length > 0 && <OrderList orders={orders} />}
    </div>
  );
}
