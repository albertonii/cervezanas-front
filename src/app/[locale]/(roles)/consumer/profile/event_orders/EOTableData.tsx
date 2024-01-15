import React from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { IEventOrder } from "../../../../../../lib/types";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { formatCurrency } from "../../../../../../utils/formatCurrency";
import { IconButton } from "../../../../components/common/IconButton";
import { encodeBase64 } from "../../../../../../utils/utils";

interface Props {
  order: IEventOrder;
  key: string;
}

export default function EOTableData({ order, key }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const handleClickView = (order: IEventOrder) => {
    const Ds_MerchantParameters = encodeBase64(
      JSON.stringify({ Ds_Order: order.order_number })
    );

    router.push(
      `/${locale}/checkout/event/success?Ds_MerchantParameters=${Ds_MerchantParameters}`
    );
  };

  return (
    <tr
      key={key}
      className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <td className="px-6 py-4">{order.order_number}</td>

      <td className="px-6 py-4">{order.users?.username ?? " - "}</td>

      <td className="px-6 py-4">{formatCurrency(order.total)}</td>

      <td className="px-6 py-4">{t(order.status)}</td>

      <td className="item-center flex justify-center px-6 py-4">
        <IconButton
          onClick={() => handleClickView(order)}
          icon={faEye}
          title={""}
        />
      </td>
    </tr>
  );
}
