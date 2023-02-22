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
      {orders && orders.length > 0 && (
        <div className="py-6 px-4 pt-12" aria-label="Products">
          <div className="flex">
            <div className="text-4xl pr-12">{t("orders")}</div>
          </div>

          <OrderList
            orders={orders}
            // handleEditShowModal={handleEditShowModal}
            // handleDeleteShowModal={handleDeleteShowModal}
            // handleProductModal={handleProductModal}
          />
        </div>
      )}
    </>
  );
}
