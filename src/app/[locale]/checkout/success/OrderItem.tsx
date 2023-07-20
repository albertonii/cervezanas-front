import React from "react";
import DisplayImageProduct from "../../../../components/common/DisplayImageProduct";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { SupabaseProps } from "../../../../constants";
import { formatCurrency, formatDateString } from "../../../../utils";
import { Button } from "../../../../components/common";
import {
  IOrder,
  IOrderItem,
  IProduct,
  IProductPack,
} from "../../../../lib/types";

const BASE_PRODUCTS_URL = SupabaseProps.BASE_PRODUCTS_URL;

interface Props {
  item: IOrderItem;
  productPack: IProductPack;
  product: IProduct;
  order: IOrder;
}

export default function OrderItem({
  item,
  productPack,
  product,
  order,
}: Props) {
  const t = useTranslations();

  const locale = useLocale();
  const router = useRouter();

  const handleOnClick = (productId: string) => {
    router.push(`/${locale}/products/review/${productId}`);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 lg:gap-x-8">
        <div className="relative p-4">
          {/* Product Multimedia  */}
          <div className="col-span-12 flex justify-center md:col-span-2">
            <div className="aspect-w-1 aspect-h-1 sm:aspect-none h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg lg:h-auto lg:w-32">
              {
                <DisplayImageProduct
                  width={120}
                  height={120}
                  alt={""}
                  imgSrc={`${
                    BASE_PRODUCTS_URL + decodeURIComponent(productPack.img_url)
                  }`}
                  class="h-full w-full object-cover object-center"
                />
              }
            </div>
          </div>

          {/* Product Information  */}
          <div className="col-span-12 mt-6 space-y-1 md:col-span-4 md:mt-6">
            <p className="text-lg font-medium text-gray-900">
              {productPack.name}
            </p>
            <p className="text-sm font-medium text-gray-900">
              {t("price")} - {formatCurrency(productPack.price)}
            </p>
            <p className="text-sm font-medium text-gray-900">
              {t("quantity")} - {productPack.quantity}
            </p>
          </div>
        </div>
      </div>

      {/* Shipping Information  */}
      {order.shipping_info && (
        <div className="col-span-12 mt-6 md:col-span-4 lg:col-span-5">
          <dt className="font-semibold text-gray-900">
            {t("shipping_address")}
          </dt>

          <dd className="mt-3 text-gray-500">
            <span className="block font-semibold">
              {order.shipping_info.name} {order.shipping_info.lastname}
            </span>
            <span className="block">
              {order.shipping_info.address}, {order.shipping_info.city},
              {order.shipping_info.state}, {order.shipping_info.zipcode},
              {order.shipping_info.country}
            </span>

            {order.shipping_info.address_extra && (
              <>
                <span className="block">
                  {order.shipping_info.address_extra}
                </span>
                <span className="block">
                  {order.shipping_info.address_observation}
                </span>
              </>
            )}
          </dd>
        </div>
      )}

      {/* Review Product  */}
      <div className="col-span-12 mt-6">
        <span className="font-medium text-gray-900">{t("review_product")}</span>

        <div className="mt-3 space-y-3 text-beer-dark">
          {item.is_reviewed && (
            <span>{t("product_already_reviewed_condition")}</span>
          )}

          {order.status !== "delivered" && (
            <span>{t("write_review_condition")}</span>
          )}

          <Button
            disabled={
              item.is_reviewed || order.status !== "delivered" ? true : false
            }
            primary
            medium
            class="my-6 font-medium text-beer-draft hover:text-beer-dark "
            onClick={() => {
              if (!item.is_reviewed && order.status === "delivered") {
                handleOnClick(product.id);
              }
            }}
          >
            {t("make_review_product_button")}
          </Button>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <h4 className="sr-only">Status</h4>
        <p className="text-md mt-6 font-medium text-gray-900 ">
          {t("preparing_to_ship")}{" "}
          <time dateTime="2021-03-24">
            {formatDateString(order.issue_date.toString())}{" "}
          </time>
        </p>
        <div className="mt-6" aria-hidden="true">
          <div className="overflow-hidden rounded-full bg-gray-200">
            <div className="h-2 rounded-full bg-beer-blonde"></div>
          </div>
          <div className="mt-6 hidden grid-cols-4 text-sm font-medium text-gray-600 sm:grid">
            <div className="text-beer-draft">{t("order_placed")}</div>
            <div className="text-center text-beer-draft">
              {t("status_processing")}
            </div>
            <div className="text-center">{t("status_shipped")}</div>
            <div className="text-right">{t("status_delivered")}</div>
          </div>
        </div>
      </div>
    </>
  );
}
