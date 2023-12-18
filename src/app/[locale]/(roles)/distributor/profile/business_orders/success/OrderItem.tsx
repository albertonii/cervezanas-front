import Link from "next/link";
import React from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  DISTRIBUTOR_ONLINE_ORDER_STATUS,
  SupabaseProps,
} from "../../../../../../../constants";
import { IBusinessOrder, IOrderItem } from "../../../../../../../lib/types";
import DisplayImageProduct from "../../../../../components/common/DisplayImageProduct";
import { formatCurrency } from "../../../../../../../utils/formatCurrency";
import { StatusTimeline } from "../../../../../components/StatusTimeline";
import { useAuth } from "../../../../../Auth/useAuth";
import { useQueryClient } from "react-query";
import { useMessage } from "../../../../../components/message/useMessage";

const BASE_PRODUCTS_URL = SupabaseProps.BASE_PRODUCTS_URL;

interface Props {
  orderItem: IOrderItem;
  bOrder: IBusinessOrder;
}

export default function OrderItem({ orderItem, bOrder }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const { supabase } = useAuth();
  const { product_packs: productPack } = orderItem;
  const queryClient = useQueryClient();
  const { handleMessage } = useMessage();

  const submitSuccessMessage = t("messages.updated_successfully");
  const submitErrorMessage = t("messages.updated_error");

  console.log(orderItem);
  console.log(bOrder);

  const [bOrderStatus, setBOrderStatus] = React.useState(bOrder.status);

  const handleBOrderStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setBOrderStatus(status);

    onClickOrderStatus(status);
  };

  // Update the status of the business_order
  const onClickOrderStatus = async (status: string) => {
    const { error } = await supabase
      .from("business_orders")
      .update({ status })
      .eq("id", orderItem.business_order_id)
      .select();

    if (error) {
      handleMessage({
        type: "error",
        message: submitErrorMessage,
      });
      throw error;
    }

    queryClient.invalidateQueries({ queryKey: ["distribution"] });

    handleMessage({
      type: "success",
      message: submitSuccessMessage,
    });
  };

  if (!productPack) return <></>;

  return (
    <section className="border-1 relative border-separate rounded-lg border p-2">
      {/* Input select que actualizará el estado para ese business_order  */}
      <select
        id="status"
        name="status"
        autoComplete="status"
        className="absolute right-0 top-0 m-2 block rounded-md border-gray-300 pl-3 pr-10 focus:border-beer-blonde focus:outline-none focus:ring-beer-blonde sm:text-sm md:text-base"
        onChange={(e) => handleBOrderStatus(e)}
        value={bOrderStatus}
      >
        <option value={DISTRIBUTOR_ONLINE_ORDER_STATUS.PENDING}>
          {t(DISTRIBUTOR_ONLINE_ORDER_STATUS.PENDING)}
        </option>
        <option value={DISTRIBUTOR_ONLINE_ORDER_STATUS.PROCESSING}>
          {t(DISTRIBUTOR_ONLINE_ORDER_STATUS.PROCESSING)}
        </option>
        <option value={DISTRIBUTOR_ONLINE_ORDER_STATUS.IN_TRANSIT}>
          {t(DISTRIBUTOR_ONLINE_ORDER_STATUS.IN_TRANSIT)}
        </option>
        <option value={DISTRIBUTOR_ONLINE_ORDER_STATUS.SHIPPED}>
          {t(DISTRIBUTOR_ONLINE_ORDER_STATUS.SHIPPED)}
        </option>
        <option value={DISTRIBUTOR_ONLINE_ORDER_STATUS.DELIVERED}>
          {t(DISTRIBUTOR_ONLINE_ORDER_STATUS.DELIVERED)}
        </option>
        <option value={DISTRIBUTOR_ONLINE_ORDER_STATUS.CANCELED}>
          {t(DISTRIBUTOR_ONLINE_ORDER_STATUS.CANCELED)}
        </option>
        <option value={DISTRIBUTOR_ONLINE_ORDER_STATUS.ERROR}>
          {t(DISTRIBUTOR_ONLINE_ORDER_STATUS.ERROR)}
        </option>
      </select>

      <StatusTimeline status={bOrderStatus} orderType={"distributor_online"} />

      <section className="grid grid-cols-1 gap-x-8 text-start sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 lg:gap-x-8">
        {/* Display the product information for this pack  */}
        <div className="col-span-12 md:col-span-4">
          <h3 className="text-xl font-medium text-gray-900 hover:text-beer-draft">
            <Link
              href={`/products/${orderItem.product_packs?.products?.id}`}
              locale={locale}
            >
              {t("name")}: {orderItem.product_packs?.products?.name}
            </Link>
          </h3>

          <span className="space-y-1">
            <p className="text-sm text-gray-500">{t("description")}</p>
            <p className="truncate">
              {orderItem.product_packs?.products?.description}
            </p>
          </span>
        </div>

        {/* Product Multimedia  */}
        <div className="flex flex-col items-center space-y-2 ">
          <figure className="aspect-w-1 aspect-h-1 sm:aspect-none h-20 w-20 flex-shrink-0 justify-center overflow-hidden rounded-lg lg:h-auto lg:w-32">
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

        {/* Product Pack Information  */}
        <div className="">
          {/* Información del pack del producto */}
          <p className="text-sm font-medium text-gray-900">
            {t("product_pack")}
          </p>

          <p className="text-lg font-medium text-gray-900">
            {productPack.name}
          </p>
          <p className="text-sm font-medium text-gray-900">
            {t("price")} - {formatCurrency(productPack.price)}
          </p>
          <p className="text-sm font-medium text-gray-900">
            {t("quantity_in_pack")} - {productPack.quantity}
          </p>
        </div>

        {/* Packs Information  */}
        <div className="">
          {/* Información del pack del producto */}
          <p className="text-sm font-medium text-gray-900">{t("packs")}</p>

          <p className="text-lg font-medium text-gray-900">
            {t("quantity")} - {orderItem.quantity} {t("packs")}
          </p>
        </div>
      </section>
    </section>
  );
}
