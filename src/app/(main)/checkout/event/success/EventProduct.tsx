import React from "react";
import DisplayImageProduct from "../../../../../components/common/DisplayImageProduct";
import GenerateQR from "./GenerateQR";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../../components/common";
import { COMMON, EVENT_ORDER_ITEM_STATUS } from "../../../../../constants";
import { IEventOrderItem } from "../../../../../lib/types";
import { formatCurrency } from "../../../../../utils";
import { useRouter } from "next/navigation";
import { EventProductTimeline } from "./EventProductTimeline";

interface Props {
  eventOrderItem: IEventOrderItem;
}

export default function EventProduct({ eventOrderItem }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const eventOrderItemId = eventOrderItem.id;
  const handleOnClick = (productId: string) => {
    router.push(`/products/review/${productId}`);
  };

  return (
    <>
      <div
        key={eventOrderItemId}
        className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
      >
        <div className="relative grid grid-cols-12 gap-x-8 p-8 px-4 py-6 sm:px-6 lg:grid-cols-12 lg:gap-x-8 lg:p-8">
          {/* Product status  */}
          <div className="col-span-12 my-4 mt-6 items-start md:col-span-12 md:mt-6">
            <div className="flex justify-around space-x-4 ">
              <span className="flex items-center text-2xl">
                {t("status")}
                <p className="ml-2 rounded-full bg-beer-gold px-2 py-2 font-semibold">
                  {t(eventOrderItem.status)}
                </p>
              </span>

              <span className="flex items-center text-2xl">
                {t("quantity_served")}
                <p className="ml-2 rounded-full bg-beer-gold px-2 py-2 font-semibold">
                  {eventOrderItem.quantity_served} / {eventOrderItem.quantity}
                </p>
              </span>
            </div>
          </div>

          {/* Product Multimedia  */}
          <div className="col-span-12 mt-6 flex justify-center sm:ml-6 md:col-span-2 md:mt-6">
            <div className="aspect-w-1 aspect-h-1 sm:aspect-none h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg lg:h-40 lg:w-40">
              <DisplayImageProduct
                width={120}
                height={120}
                alt={""}
                imgSrc={`${
                  eventOrderItem.product_multimedia &&
                  eventOrderItem.product_multimedia[0]
                    ? eventOrderItem.product_multimedia[0].p_principal
                    : COMMON.MARKETPLACE_PRODUCT
                }`}
                class="h-full w-full object-cover object-center sm:h-full sm:w-full"
              />
            </div>
          </div>

          {/* Product Information  */}
          <div className="col-span-12 mt-6 md:col-span-4 md:mt-6">
            <h3 className="text-base font-medium text-gray-900 hover:text-beer-draft">
              <Link href={`/products/${eventOrderItem.id}`}>
                {eventOrderItem.product_id.name}
              </Link>
            </h3>
            <p className="mt-2 text-sm font-medium text-gray-900">
              {t("price")} - {formatCurrency(eventOrderItem.product_id.price)}
            </p>
            <p className="mt-2 text-sm font-medium text-gray-900">
              {t("quantity")} -
            </p>
            <p className="mt-3 text-sm text-gray-500">
              {t("description")} - {eventOrderItem.product_id.description}
            </p>
          </div>

          {/* QR Code generator for barman */}
          <GenerateQR eventOrderItemId={eventOrderItemId} />

          {/* Review Product button */}
          <div className="col-span-12 mt-6">
            <span className="font-medium text-gray-900">
              {t("review_product")}
            </span>

            <div className="mt-3 space-y-3 text-beer-dark">
              {eventOrderItem.is_reviewed && (
                <span>{t("product_already_reviewed_condition")}</span>
              )}

              {eventOrderItem.status === EVENT_ORDER_ITEM_STATUS.INITIAL && (
                <span>{t("write_review_condition")}</span>
              )}

              <Button
                disabled={
                  eventOrderItem.is_reviewed ||
                  eventOrderItem.status === EVENT_ORDER_ITEM_STATUS.INITIAL
                    ? true
                    : false
                }
                primary
                medium
                class="my-6 font-medium text-beer-draft hover:text-beer-dark "
                onClick={() => {
                  if (
                    !eventOrderItem.is_reviewed &&
                    eventOrderItem.status !== EVENT_ORDER_ITEM_STATUS.INITIAL
                  ) {
                    handleOnClick(eventOrderItem.id);
                  }
                }}
              >
                {t("make_review_product_button")}
              </Button>
            </div>
          </div>
        </div>

        {/* Timeline  */}
        <EventProductTimeline status={eventOrderItem.status} />
      </div>
    </>
  );
}
