import Image from "next/image";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Order } from "../../../lib/types";
import { formatCurrency } from "../../../utils/formatCurrency";
import Button from "../../common/Button";

interface Props {
  orders: Order[];
  //   handleEditShowModal: React.Dispatch<React.SetStateAction<any>>;
  //   handleDeleteShowModal: React.Dispatch<React.SetStateAction<any>>;
  //   handleProductModal: React.Dispatch<React.SetStateAction<any>>;
}

interface ColumnsProps {
  header: string;
}

export default function OrderList(props: Props) {
  const { t } = useTranslation();

  const router = useRouter();

  const { orders } = props;

  const [query, setQuery] = React.useState("");

  const COLUMNS = [
    { header: t("order_number_header") },
    { header: t("name_header") },
    { header: t("price_header") },
    { header: t("status_header") },
    { header: t("tracking_number_header") },
    { header: t("action_header") },
  ];

  const handleClickView = (order: Order) => {
    router.push(`/checkout/success/${order.id}`);
  };

  const filteredItemsByStatus = useMemo(() => {
    return orders.filter((orders) => {
      return orders.status.includes(query);
    });
  }, [orders, query]);

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg mt-6">
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search order..."
        />
      </div>

      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {COLUMNS.map((column: ColumnsProps, index: number) => {
              return (
                <th key={index} scope="col" className="py-3 px-6">
                  {column.header}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {orders &&
            filteredItemsByStatus.map((order) => {
              return (
                <tr
                  key={order.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td className="py-4 px-6">{order.order_number}</td>

                  <td className="py-4 px-6">{order.customer_name}</td>

                  <td className="py-4 px-6">{formatCurrency(order.total)}</td>

                  <td className="py-4 px-6">{order.status}</td>

                  <td className="py-4 px-6">{order.tracking_id}</td>

                  <td className="py-4 px-6">
                    <div className="flex">
                      <Button
                        onClick={() => handleClickView(order)}
                        class="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-2 w-[45px]"
                      >
                        <Image
                          width={45}
                          height={45}
                          alt="Edit"
                          src="/icons/view-240.png"
                        />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}