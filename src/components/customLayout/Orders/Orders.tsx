import { useTranslation } from "react-i18next";
import { OrderList } from "..";
import { Order } from "../../../lib/types";

interface Props {
  orders: Order[];
}

export function Orders(props: Props) {
  const { orders } = props;

  const { t } = useTranslation();

  return (
    <>
      <div className="py-6 px-4" aria-label="Products">
        <div className="flex flex-col">
          <div className="text-4xl pr-12">{t("orders")}</div>
        </div>{" "}
        {orders && orders.length > 0 && <OrderList orders={orders} />}
      </div>
    </>
  );
}
