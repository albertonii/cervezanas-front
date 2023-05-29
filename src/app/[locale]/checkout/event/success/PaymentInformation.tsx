import React from "react";
import { useTranslations } from "next-intl";
import { IEventOrder } from "../../../../../lib/types";
import { formatCurrency } from "../../../../../utils";

interface Props {
  order: IEventOrder;
}

export default function PaymentInformation({ order }: Props) {
  const t = useTranslations();
  return (
    <div className="bg-gray-100 px-4 py-6 sm:rounded-lg sm:px-6 lg:grid lg:grid-cols-1 lg:gap-x-8 lg:px-8 lg:py-8">
      <dl className="mt-8 items-center divide-y divide-gray-200 text-sm lg:col-span-5 lg:mt-0">
        <div className="flex items-center justify-between pb-4">
          <dt className="text-gray-600">{t("subtotal")}</dt>
          <dd className="font-medium text-gray-900">
            {formatCurrency(order.subtotal)}
          </dd>
        </div>
        <div className="flex items-center justify-between pb-4">
          <dt className="text-gray-600">{t("discount")}</dt>
          <dd className="font-medium text-gray-900">
            {t("discount_code")} {order.discount_code} {" - "}{" "}
            {formatCurrency(order.discount)}
          </dd>
        </div>

        <div className="flex items-center justify-between py-4">
          <dt className="text-gray-600">{t("tax")}</dt>
          <dd className="font-medium text-gray-900">
            {formatCurrency(order.tax)}
          </dd>
        </div>
        <div className="flex items-center justify-between pt-4">
          <dt className="font-medium text-gray-900">{t("total")}</dt>
          <dd className="font-medium text-beer-draft">
            {formatCurrency(order.total)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
