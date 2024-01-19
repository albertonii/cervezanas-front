import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { SupabaseProps } from "../../../../../constants";
import { IBusinessOrder, IOrderItem } from "../../../../../lib/types";
import { formatCurrency } from "../../../../../utils/formatCurrency";
import { Button } from "../../../components/common/Button";
import DisplayImageProduct from "../../../components/common/DisplayImageProduct";
import { StatusTimeline } from "../../../components/StatusTimeline";

const BASE_PRODUCTS_URL = SupabaseProps.BASE_PRODUCTS_URL;

interface Props {
  bOrder: IBusinessOrder;
}

export default function BusinessOrderDetails({ bOrder }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  if (!bOrder.order_items) return <></>;

  const productName = bOrder.order_items[0].product_packs?.products?.name;
  const productDescription =
    bOrder.order_items[0].product_packs?.products?.description;

  const handleOnClick = (productId: string) => {
    router.push(`/${locale}/products/review/${productId}`);
  };

  return (
    <section className="relative border-separate space-y-8 rounded-lg border p-2">
      <StatusTimeline status={bOrder.status} orderType={"distributor_online"} />

      <section className="grid grid-cols-1 space-y-4 text-start sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4">
        {/* Display the product information for this pack  */}
        {bOrder.order_items && (
          <div className="col-span-12">
            <h3 className="text-xl font-medium text-gray-900 hover:text-beer-draft">
              <Link
                href={`/products/${bOrder.order_items[0].product_packs?.products?.id}`}
                locale={locale}
              >
                {t("name")}: {productName}
              </Link>
            </h3>

            <span className="space-y-1">
              <p className="text-sm text-gray-500">{t("description")}</p>
              <p className="truncate">{productDescription}</p>
            </span>
          </div>
        )}

        {bOrder.order_items?.map((orderItem: IOrderItem) => (
          <>
            <article
              className="grid justify-between gap-2 rounded-lg border border-gray-200 sm:space-x-4 sm:p-4 lg:grid-cols-12 lg:space-x-2 lg:p-6"
              key={
                orderItem.business_order_id + "-" + orderItem.product_pack_id
              }
            >
              {orderItem.product_packs && (
                <>
                  <header className="col-span-12">
                    <h3 className="text-xl font-medium text-gray-900 hover:text-beer-draft">
                      <p className="text-lg font-medium text-gray-900">
                        {orderItem.product_packs.name}
                      </p>
                    </h3>
                  </header>

                  <figure className="aspect-w-1 aspect-h-1 sm:aspect-none col-span-4 h-20 w-auto flex-shrink-0 justify-center overflow-hidden rounded-lg lg:h-auto ">
                    {
                      <DisplayImageProduct
                        width={120}
                        height={120}
                        alt={""}
                        imgSrc={`${
                          BASE_PRODUCTS_URL +
                          decodeURIComponent(orderItem.product_packs.img_url)
                        }`}
                        class="h-full w-full object-cover object-center"
                      />
                    }
                  </figure>

                  <div className="col-span-8 flex flex-col gap-2">
                    <p className="text-sm font-medium text-gray-900 ">
                      {formatCurrency(orderItem.product_packs.price)}
                    </p>

                    <span className="text-sm text-gray-900">
                      <p>{t("quantity_in_pack")}:</p>

                      <p className="font-medium">
                        {orderItem.product_packs.quantity} {t("units")}
                      </p>
                    </span>

                    <span className="text-sm text-gray-900">
                      <p>{t("quantity_bought")}:</p>
                      <p className="font-medium">
                        {orderItem.quantity} {t("packs")}
                      </p>
                    </span>
                  </div>
                </>
              )}
            </article>

            {/* Review Product  */}
            <section className="col-span-12 mt-6">
              <span className="font-medium text-gray-900">
                {t("review_product")}
              </span>

              <div className="mt-3 space-y-3 text-beer-dark">
                {orderItem.is_reviewed && (
                  <span>{t("product_already_reviewed_condition")}</span>
                )}

                {bOrder.status !== "delivered" && (
                  <span>{t("write_review_condition")}</span>
                )}

                <Button
                  disabled={
                    orderItem.is_reviewed || bOrder.status !== "delivered"
                      ? true
                      : false
                  }
                  primary
                  medium
                  class="my-6 font-medium text-beer-draft hover:text-beer-dark "
                  onClick={() => {
                    if (
                      !orderItem.is_reviewed &&
                      bOrder.status === "delivered"
                    ) {
                      handleOnClick(orderItem.product_pack_id);
                    }
                  }}
                >
                  {t("make_review_product_button")}
                </Button>
              </div>
            </section>
          </>
        ))}
      </section>
    </section>
  );
}
