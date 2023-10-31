import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { IOrder } from "../../../../../lib/types";
import { formatDateString } from "../../../../../utils/formatDate";

interface Props {
  order: IOrder;
}

export default function TimelineStatus({ order }: Props) {
  const t = useTranslations();

  const [barStatus, setBarStatus] = useState("w-1/4");

  useEffect(() => {
    switch (order.status) {
      case "pending": {
        setBarStatus("w-10");
        break;
      }

      case "processing": {
        setBarStatus("w-2/4");
        break;
      }

      case "shipped": {
        setBarStatus("w-3/4");
        break;
      }

      case "delivered": {
        setBarStatus("w-full");
        break;
      }

      default: {
        setBarStatus("w-1/4");
        break;
      }
    }
  }, [order.status]);

  return (
    <section className="border-t border-gray-200">
      <h4 className="sr-only">{t("status")}</h4>
      <p className="text-md mt-6 font-medium text-gray-900 ">
        {t("preparing_to_ship")}{" "}
        <time dateTime="2021-03-24">
          {formatDateString(order.issue_date.toString())}{" "}
        </time>
      </p>

      <div className="mt-6" aria-hidden="true">
        <div className="overflow-hidden rounded-full bg-gray-200">
          <div className={`${barStatus} h-2 rounded-full bg-beer-blonde`}></div>
        </div>

        <div className="mt-6 hidden grid-cols-4 text-sm font-medium text-gray-600 sm:grid">
          <span className="text-beer-draft">{t("order_placed")}</span>

          <span className="text-center text-beer-draft">
            {t("status_processing")}
          </span>

          <span className="text-center">{t("status_shipped")}</span>

          <span className="text-right">{t("status_delivered")}</span>
        </div>
      </div>
    </section>
  );
}
