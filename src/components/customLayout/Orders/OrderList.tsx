"use client";

import useFetchCPOrders from "../../../hooks/useFetchOrders";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { IOrder } from "../../../lib/types.d";
import { formatCurrency } from "../../../utils/formatCurrency";
import { Button, IconButton, Spinner } from "../../common";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { encodeBase64 } from "../../../utils/utils";
import { useAuth } from "../../Auth";

interface Props {
  orders: IOrder[];
}

interface ColumnsProps {
  header: string;
}

export function OrderList({ orders: os }: Props) {
  const { user } = useAuth();
  if (!user) return null;

  const { t } = useTranslation();

  const [orders, setOrders] = useState(os);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const ordersCount = os.length;
  const pageRange = 10;
  const finalPage =
    ordersCount < currentPage * pageRange
      ? ordersCount
      : currentPage * pageRange;

  const router = useRouter();

  const { isError, isLoading, refetch } = useFetchCPOrders(
    user.id,
    currentPage,
    pageRange
  );

  useEffect(() => {
    refetch().then((res) => {
      // const orders = res.data as IOrder[];
      const orders = res.data as any;
      setOrders(orders);
    });
  }, [currentPage]);

  const COLUMNS = [
    { header: t("order_number_header") },
    { header: t("name_header") },
    { header: t("price_header") },
    { header: t("status_header") },
    { header: t("tracking_number_header") },
    { header: t("action_header") },
  ];

  const handleClickView = (order: IOrder) => {
    const Ds_MerchantParameters = encodeBase64(
      JSON.stringify({ Ds_Order: order.order_number })
    );

    router.push(
      `/checkout/success?Ds_MerchantParameters=${Ds_MerchantParameters}`
    );
  };

  const filteredItemsByStatus = useMemo(() => {
    return orders.filter((orders) => {
      return orders.status.includes(query);
    });
  }, [orders, query]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(ordersCount / pageRange)) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="relative mt-6 overflow-x-auto shadow-md sm:rounded-lg">
      {isError && (
        <div className="flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            {t("error_fetching_products")}
          </p>
        </div>
      )}

      {isLoading && (
        <Spinner color="beer-blonde" size="xLarge" absolute center />
      )}

      {!isError && !isLoading && orders.length === 0 ? (
        <div className="flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">{t("no_orders")}</p>
        </div>
      ) : (
        <>
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                aria-hidden="true"
                className="h-5 w-5 text-gray-500 dark:text-gray-400"
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
              className="mb-6 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-beer-blonde focus:ring-beer-blonde  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Search order..."
            />
          </div>

          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                {COLUMNS.map((column: ColumnsProps, index: number) => {
                  return (
                    <th key={index} scope="col" className="px-6 py-3">
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
                      className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <td className="px-6 py-4">{order.order_number}</td>

                      <td className="px-6 py-4">{order.customer_name}</td>

                      <td className="px-6 py-4">
                        {formatCurrency(order.total)}
                      </td>

                      <td className="px-6 py-4">{t(order.status)}</td>

                      <td className="px-6 py-4">{order.tracking_id}</td>

                      <td className="item-center flex justify-center px-6 py-4">
                        <IconButton
                          onClick={() => handleClickView(order)}
                          icon={faEye}
                          title={""}
                        />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

          {/* Prev and Next button for pagination  */}
          <div className="my-4 flex items-center justify-around">
            <Button class="" onClick={() => handlePrevPage()} small primary>
              {t("prev")}
            </Button>

            <p className="text-sm text-gray-700 dark:text-gray-400">
              {t("pagination_footer_nums", {
                from: currentPage,
                to: finalPage,
                total: ordersCount,
              })}
            </p>

            <Button class="" onClick={() => handleNextPage()} small primary>
              {t("next")}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
