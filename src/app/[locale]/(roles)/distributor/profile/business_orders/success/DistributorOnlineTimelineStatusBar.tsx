import React from "react";
import { DISTRIBUTOR_ONLINE_ORDER_STATUS } from "../../../../../../../constants";

interface OrderTimelineProps {
  status: string;
}
export default function DistributorOnlineTimelineStatusBar({
  status,
}: OrderTimelineProps) {
  return (
    <section className="mt-6" aria-hidden="true">
      <div className="flex w-full flex-row overflow-hidden rounded-full bg-gray-200">
        {(status === DISTRIBUTOR_ONLINE_ORDER_STATUS.ERROR ||
          status === DISTRIBUTOR_ONLINE_ORDER_STATUS.CANCELED) && (
          <div className={`h-2 w-[100%] rounded-l-full bg-red-700`}></div>
        )}

        <div
          className={`h-2 rounded-l-full ${
            status === DISTRIBUTOR_ONLINE_ORDER_STATUS.PENDING &&
            "w-[10%] bg-beer-blonde"
          }`}
        ></div>

        <div
          className={`h-2  ${
            status === DISTRIBUTOR_ONLINE_ORDER_STATUS.PROCESSING &&
            "w-[30%] bg-beer-blonde "
          }`}
        ></div>

        <div
          className={`h-2   ${
            status === DISTRIBUTOR_ONLINE_ORDER_STATUS.IN_TRANSIT &&
            "w-[50%] bg-beer-blonde"
          }`}
        ></div>

        <div
          className={`h-2 rounded-r-full ${
            status === DISTRIBUTOR_ONLINE_ORDER_STATUS.SHIPPED &&
            "w-[70%] bg-beer-blonde"
          }`}
        ></div>

        <div
          className={`h-2 rounded-r-full ${
            status === DISTRIBUTOR_ONLINE_ORDER_STATUS.DELIVERED &&
            "w-[100%] bg-beer-blonde"
          }`}
        ></div>
      </div>
    </section>
  );
}
