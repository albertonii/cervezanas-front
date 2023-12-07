import React from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { IBusinessOrder } from "../../../../../../lib/types";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { formatCurrency } from "../../../../../../utils/formatCurrency";
import { IconButton } from "../../../../components/common/IconButton";
import { encodeBase64 } from "../../../../../../utils/utils";

interface Props {
  bOrder: IBusinessOrder;
  key: string;
}

export default function OTableData({ bOrder, key }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const { orders: order } = bOrder;

  if (!order) return null;

  const handleClickView = (bOrder: IBusinessOrder) => {
    const Ds_MerchantParameters = encodeBase64(
      JSON.stringify({ Ds_Order: bOrder.orders?.order_number })
    );

    router.push(
      `/${locale}/checkout/success?Ds_MerchantParameters=${Ds_MerchantParameters}`
    );
  };

  return (
    <tr
      key={key}
      className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <td className="px-6 py-4">{order.order_number}</td>

      <td className="px-6 py-4">{order.customer_name}</td>

      <td className="px-6 py-4">{formatCurrency(order.total)}</td>

      <td className="px-6 py-4">{t(order.status)}</td>

      <td className="px-6 py-4">{order.tracking_id}</td>

      <td className="item-center flex justify-center px-6 py-4">
        <IconButton
          onClick={() => handleClickView(bOrder)}
          icon={faEye}
          title={""}
        />
      </td>
    </tr>
  );
}
