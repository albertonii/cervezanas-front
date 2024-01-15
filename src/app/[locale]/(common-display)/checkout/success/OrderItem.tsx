import DisplayImageProduct from "../../../components/common/DisplayImageProduct";
import React from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { SupabaseProps } from "../../../../../constants";
import { Button } from "../../../components/common/Button";
import { IOrder, IOrderItem } from "../../../../../lib/types";
import { formatCurrency } from "../../../../../utils/formatCurrency";
import { StatusTimeline } from "../../../components/StatusTimeline";

const BASE_PRODUCTS_URL = SupabaseProps.BASE_PRODUCTS_URL;

interface Props {
  orderItem: IOrderItem;
  order: IOrder;
}

export default function OrderItem({ orderItem, order }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const { product_packs: productPack } = orderItem;

  if (!productPack) return <></>;

  const handleOnClick = (productId: string) => {
    router.push(`/${locale}/products/review/${productId}`);
  };

  return (
    <>
      <section className="grid grid-cols-1 gap-x-8 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 lg:gap-x-8">
        <div className="relative">
          {/* Product Multimedia  */}
          <div className="col-span-12 flex justify-center md:col-span-2">
            <figure className="aspect-w-1 aspect-h-1 sm:aspect-none h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg lg:h-auto lg:w-32">
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
            </figure>
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
      </section>

      {/* Shipping Information  */}
      {order.shipping_info && (
        <section className="col-span-12 mt-6 md:col-span-4 lg:col-span-5">
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
                  {order.shipping_info.address_observations}
                </span>
              </>
            )}
          </dd>
        </section>
      )}

      {/* Review Product  */}
      <section className="col-span-12 mt-6">
        <span className="font-medium text-gray-900">{t("review_product")}</span>

        <div className="mt-3 space-y-3 text-beer-dark">
          {orderItem.is_reviewed && (
            <span>{t("product_already_reviewed_condition")}</span>
          )}

          {order.status !== "delivered" && (
            <span>{t("write_review_condition")}</span>
          )}

          <Button
            disabled={
              orderItem.is_reviewed || order.status !== "delivered"
                ? true
                : false
            }
            primary
            medium
            class="my-6 font-medium text-beer-draft hover:text-beer-dark "
            onClick={() => {
              if (!orderItem.is_reviewed && order.status === "delivered") {
                handleOnClick(orderItem.product_pack_id);
              }
            }}
          >
            {t("make_review_product_button")}
          </Button>
        </div>
      </section>

      <StatusTimeline status={order.status} orderType={"online"} />
    </>
  );
}
