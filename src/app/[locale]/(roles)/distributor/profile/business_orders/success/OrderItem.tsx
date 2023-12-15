import React from "react";
import { useTranslations } from "next-intl";
import {
  DISTRIBUTOR_ONLINE_ORDER_STATUS,
  SupabaseProps,
} from "../../../../../../../constants";
import { IOrder, IOrderItem } from "../../../../../../../lib/types";
import DisplayImageProduct from "../../../../../components/common/DisplayImageProduct";
import { formatCurrency } from "../../../../../../../utils/formatCurrency";
import { StatusTimeline } from "../../../../../components/StatusTimeline";
import { useAuth } from "../../../../../Auth/useAuth";
import { useQueryClient } from "react-query";

const BASE_PRODUCTS_URL = SupabaseProps.BASE_PRODUCTS_URL;

interface Props {
  orderItem: IOrderItem;
  order: IOrder;
}

export default function OrderItem({ orderItem, order }: Props) {
  const t = useTranslations();
  const { supabase } = useAuth();
  const { product_packs: productPack } = orderItem;
  const queryClient = useQueryClient();

  const [bOrderStatus, setBOrderStatus] = React.useState(order.status);

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

    if (error) throw error;

    queryClient.invalidateQueries({ queryKey: ["distribution"] });
  };

  if (!productPack) return <></>;

  return (
    <>
      <section className="grid grid-cols-1 gap-x-8 text-center sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 lg:gap-x-8">
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

          {/* Input select que actualizará el estado para ese business_order  */}
          <select
            id="status"
            name="status"
            autoComplete="status"
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-beer-blonde focus:outline-none focus:ring-beer-blonde sm:text-sm"
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
        </div>

        {/* Product Information  */}
        <div className="">
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

        {/* Shipping Information  */}
        {order.shipping_info && (
          <div className="">
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
          </div>
        )}
      </section>

      <StatusTimeline status={bOrderStatus} orderType={"distributor_online"} />
    </>
  );
}
