"use client";

import { useTranslations } from "next-intl";
import { IBusinessOrder } from "../../../../../../lib/types";
import { BusinessOrderList } from "./BusinessOrderList";

interface Props {
  bOrders: IBusinessOrder[];
}

export function BusinessOrders({ bOrders }: Props) {
  const t = useTranslations();

  return (
    <section className="px-4 py-6" aria-label="Orders">
      <span className="flex flex-col space-y-4">
        <h2 className="text-4xl">{t("marketplace_orders")}</h2>
      </span>

      {bOrders && bOrders.length > 0 && <BusinessOrderList bOrders={bOrders} />}
    </section>
  );
}
