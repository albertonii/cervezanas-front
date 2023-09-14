import React from "react";
import GenerateQR from "./GenerateQR";
import Link from "next/link";
import DisplayImageProduct from "../../../../components/common/DisplayImageProduct";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { EventProductTimeline } from "./EventProductTimeline";
import { IEventOrderItem } from "../../../../../../lib/types.d";
import {
  EVENT_ORDER_ITEM_STATUS,
  SupabaseProps,
} from "../../../../../../constants";
import { Button } from "../../../../components/common";
import { formatCurrency } from "../../../../../../utils/formatCurrency";

interface Props {
  eventOrderItem: IEventOrderItem;
}

const BASE_PRODUCTS_URL = SupabaseProps.BASE_PRODUCTS_URL;

export default function EventProduct({ eventOrderItem }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const eventOrderItemId = eventOrderItem.id;

  const handleOnClick = (productId: string) => {
    router.push(`/${locale}/products/review/${productId}`);
  };

  const { product_pack_id: pack, product_id: product } = eventOrderItem;

  return (
    <>
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
              imgSrc={`${BASE_PRODUCTS_URL + decodeURIComponent(pack.img_url)}`}
              class="h-full w-full object-cover object-center sm:h-full sm:w-full"
            />
          </div>
        </div>

        {/* Product Information  */}
        <div className="col-span-12 mt-6 space-y-4 md:col-span-4 md:mt-6">
          <h3 className="text-base  text-gray-900">
            <span className="font-medium">{t("product")}: </span>
            <Link
              className="hover:text-beer-draft"
              href={`/products/${eventOrderItem.id}`}
              locale={locale}
            >
              {product.name}
            </Link>
          </h3>

          <h3 className="space-x-2 text-sm text-gray-900">
            <span className="font-medium">{t("pack")}: </span>
            <span>{pack.name}</span>
          </h3>

          <h4 className="space-x-2 text-sm text-gray-900">
            <span className="font-medium">{t("price")}:</span>
            <span>{formatCurrency(pack.price)}</span>
          </h4>

          <p className="space-x-2 text-sm text-gray-900">
            <span className="font-medium">{t("quantity")}:</span>
            <span>{pack.quantity}</span>
          </p>

          <p className="space-x-2 text-sm text-gray-900">
            <span className="font-medium">{t("total")}:</span>
            <span>{formatCurrency(pack.quantity * pack.price)}</span>
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
                  handleOnClick(product.id);
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
    </>
  );
}
