import React from "react";
import { EVENT_ORDER_ITEM_STATUS } from "../../../../../../../../constants";

interface OrderTimelineProps {
  status: string;
}
export default function EventProductTimelineStatusText({
  status,
}: OrderTimelineProps) {
  return (
    <section className="mt-6" aria-hidden="true">
      <div className="flex w-full flex-row overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-2 rounded-l-full ${
            status === EVENT_ORDER_ITEM_STATUS.INITIAL &&
            "w-[10%] bg-beer-blonde"
          }`}
        ></div>

        <div
          className={`h-2  ${
            status === EVENT_ORDER_ITEM_STATUS.WITH_STOCK &&
            "w-[50%] bg-beer-blonde "
          }`}
        ></div>

        <div
          className={`h-2   ${
            status === EVENT_ORDER_ITEM_STATUS.CONSUMED &&
            "w-[100%] bg-beer-blonde"
          }`}
        ></div>
      </div>
    </section>
  );
}
