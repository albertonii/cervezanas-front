import DisplayImageProduct from "../../../../../components/common/DisplayImageProduct";
import GenerateQR from "./GenerateQR";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../../components/common";
import { COMMON } from "../../../../../constants";
import { IOrderItem, IOrder } from "../../../../../lib/types";
import { formatCurrency } from "../../../../../utils";
import { EventOrderTimeline } from "./EventOrderTimeline";
import { useRouter } from "next/navigation";

interface Props {
  order: IOrder;
  product: IOrderItem;
}

export default function EventProduct({ order, product }: Props) {
  const { t } = useTranslation();
  const router = useRouter();

  const handleOnClick = (productId: string) => {
    router.push(`/products/review/${productId}`);
  };

  return (
    <>
      <div
        key={product.id}
        className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
      >
        <div className="relative grid grid-cols-12 gap-x-8 p-8 px-4 py-6 sm:px-6 lg:grid-cols-12 lg:gap-x-8 lg:p-8">
          {/* Product Multimedia  */}
          <div className="col-span-12 mt-6 flex justify-center sm:ml-6 md:col-span-2 md:mt-6">
            <div className="aspect-w-1 aspect-h-1 sm:aspect-none h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg lg:h-40 lg:w-40">
              <DisplayImageProduct
                width={120}
                height={120}
                alt={""}
                imgSrc={`${
                  product.product_multimedia[0]
                    ? product.product_multimedia[0].p_principal
                    : COMMON.MARKETPLACE_PRODUCT
                }`}
                class="h-full w-full object-cover object-center sm:h-full sm:w-full"
              />
            </div>
          </div>

          {/* Product Information  */}
          <div className="col-span-12 mt-6 md:col-span-4 md:mt-6">
            <h3 className="text-base font-medium text-gray-900 hover:text-beer-draft">
              <Link href={`/products/${product.id}`}>{product.name}</Link>
            </h3>
            <p className="mt-2 text-sm font-medium text-gray-900">
              {t("price")} - {formatCurrency(product.price)}
            </p>
            <p className="mt-2 text-sm font-medium text-gray-900">
              {t("quantity")} -
            </p>
            <p className="mt-3 text-sm text-gray-500">
              {t("description")} - {product.description}
            </p>
          </div>

          {/* QR Code generator for barman */}
          <GenerateQR />

          {/* Review Product  */}
          <div className="col-span-12 mt-6">
            <span className="font-medium text-gray-900">
              {t("review_product")}
            </span>

            <div className="mt-3 space-y-3 text-beer-dark">
              {product.is_reviewed && (
                <span>{t("product_already_reviewed_condition")}</span>
              )}

              {order.status !== "delivered" && (
                <span>{t("write_review_condition")}</span>
              )}

              <Button
                disabled={
                  product.is_reviewed || order.status !== "delivered"
                    ? true
                    : false
                }
                primary
                medium
                class="my-6 font-medium text-beer-draft hover:text-beer-dark "
                onClick={() => {
                  if (!product.is_reviewed && order.status === "delivered") {
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
        <EventOrderTimeline order={order} />
      </div>
    </>
  );
}
