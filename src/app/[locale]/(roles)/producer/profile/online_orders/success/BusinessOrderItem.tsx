import Link from "next/link";
import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { SupabaseProps } from "../../../../../../../constants";
import { IBusinessOrder, IOrderItem } from "../../../../../../../lib/types";
import DisplayImageProduct from "../../../../../components/common/DisplayImageProduct";
import { formatCurrency } from "../../../../../../../utils/formatCurrency";
import { StatusTimeline } from "../../../../../components/StatusTimeline";
import DisplayImageProfile from "../../../../../components/common/DisplayImageProfile";

const BASE_PRODUCTS_URL = SupabaseProps.BASE_PRODUCTS_URL;

interface Props {
  bOrder: IBusinessOrder;
  setPackStatusArray: React.Dispatch<React.SetStateAction<string[]>>;
  index: number;
}

export default function BusinessOrderItem({ bOrder }: Props) {
  const t = useTranslations();
  const locale = useLocale();

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
                {t("name")}:{" "}
                {bOrder.order_items[0].product_packs?.products?.name}
              </Link>
            </h3>

            <span className="space-y-1">
              <p className="text-sm text-gray-500">{t("description")}</p>
              <p className="truncate">
                {bOrder.order_items[0].product_packs?.products?.description}
              </p>
            </span>
          </div>
        )}

        {bOrder.order_items?.map((orderItem: IOrderItem) => (
          <article
            className="grid justify-between gap-2 rounded-lg border border-gray-200 sm:space-x-4 sm:p-4 lg:grid-cols-12 lg:space-x-2 lg:p-6"
            key={orderItem.business_order_id + "-" + orderItem.product_pack_id}
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
        ))}

        {/* Distributor information data  */}
        {bOrder.distributor_user && (
          <article className="col-span-12 ">
            <h3 className="text-xl ">{t("distributor_information")}</h3>

            <div className="flex space-x-4">
              <figure>
                <DisplayImageProfile
                  imgSrc={bOrder.distributor_user.users?.avatar_url ?? ""}
                  class={""}
                />
              </figure>

              <div>
                <span className="space-y-1">
                  <p className="text-sm text-gray-500">{t("username")}</p>
                  <p className="text-medium truncate font-medium text-gray-900 hover:text-beer-draft">
                    <Link
                      href={`/d-info/${bOrder.distributor_id}`}
                      locale={locale}
                      target={"_blank"}
                    >
                      {bOrder.distributor_user?.users?.username}
                    </Link>
                  </p>
                </span>

                <span className="space-y-1">
                  <p className="text-sm text-gray-500">{t("name")}</p>
                  <p className="truncate">
                    {bOrder.distributor_user?.users?.name}
                  </p>
                  <p className="truncate ">
                    {bOrder.distributor_user?.users?.lastname}
                  </p>
                </span>

                <span className="space-y-1">
                  <p className="text-sm text-gray-500">{t("email")}</p>
                  <p className="truncate">
                    {bOrder.distributor_user?.users?.email}
                  </p>
                </span>
              </div>
            </div>
          </article>
        )}
      </section>
    </section>
  );
}
