import React from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { IOrder } from "../../../../../../lib/types";
import { faTruck } from "@fortawesome/free-solid-svg-icons";
import { formatCurrency } from "../../../../../../utils/formatCurrency";
import { IconButton } from "../../../../components/common/IconButton";
import { encodeBase64 } from "../../../../../../utils/utils";
import { formatDateString } from "../../../../../../utils/formatDate";

interface Props {
  order: IOrder;
  key: string;
}

export default function ODistributorTableData({ order, key }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  if (!order) return null;

  const handleClickView = (order: IOrder) => {
    const Ds_MerchantParameters = encodeBase64(
      JSON.stringify({ Ds_Order: order.order_number })
    );

    router.push(
      `/${locale}/distributor/profile/online_orders/success?Ds_MerchantParameters=${Ds_MerchantParameters}`
    );
  };

  return (
    <tr
      key={key}
      className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <td className="px-6 py-4">{order.order_number}</td>

      <td className="px-6 py-4">{order.customer_name}</td>

      <td className="px-6 py-4">{order.business_orders?.length}</td>

      <td className="px-6 py-4">{formatCurrency(order.total)}</td>

      <td className="px-6 py-4">{t(order.status)}</td>

      <td className="px-6 py-4">{order.tracking_id}</td>

      <td className="px-6 py-4">{formatDateString(order.created_at)}</td>

      <td className="item-center flex justify-center gap-2 px-6 py-4">
        <IconButton
          onClick={() => handleClickView(order)}
          icon={faTruck}
          title={""}
        />
      </td>
    </tr>
  );
}
