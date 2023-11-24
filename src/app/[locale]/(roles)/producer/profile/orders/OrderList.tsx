"use client";

import PaginationFooter from "../../../../components/common/PaginationFooter";
import useFetchCPOrders from "../../../../../../hooks/useFetchOrders";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { IOrder } from "../../../../../../lib/types";
import { Spinner } from "../../../../components/common/Spinner";
import { useAuth } from "../../../../Auth/useAuth";
import OTableData from "./OTableData";

interface Props {
  orders: IOrder[];
}

interface ColumnsProps {
  header: string;
}

export function OrderList({ orders: os }: Props) {
  const { user } = useAuth();
  if (!user) return null;

  const t = useTranslations();

  const [orders, setOrders] = useState<IOrder[]>(os);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const counter = os.length;
  const resultsPerPage = 10;

  const { isError, isLoading, refetch } = useFetchCPOrders(
    user.id,
    currentPage,
    resultsPerPage
  );

  useEffect(() => {
    refetch().then((res) => {
      const orders = res.data as IOrder[];
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

  const filteredItemsByStatus = useMemo(() => {
    if (!orders) return [];
    return orders.filter((orders) => {
      return orders.status.includes(query);
    });
  }, [orders, query]);

  return (
    <section className="relative mt-6 overflow-x-auto shadow-md sm:rounded-lg">
      {isError && (
        <p className="flex items-center justify-center">
          <h2 className="text-gray-500 dark:text-gray-400">
            {t("error_fetching_online_orders")}
          </h2>
        </p>
      )}

      {isLoading && (
        <Spinner color="beer-blonde" size="xLarge" absolute center />
      )}

      {!isError && !isLoading && orders && orders.length === 0 ? (
        <p className="flex items-center justify-center">
          <h3 className="text-gray-500 dark:text-gray-400">{t("no_orders")}</h3>
        </p>
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
              placeholder={t("search_order") ?? "Search order..."}
            />
          </div>

          <table className="w-full text-center text-sm text-gray-500 dark:text-gray-400">
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
                  return <OTableData order={order} key={order.id} />;
                })}
              {!orders && (
                <tr>
                  <td colSpan={6} className="py-4 text-center">
                    {t("no_orders")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Prev and Next button for pagination  */}
          <footer className="my-4 flex items-center justify-around">
            <PaginationFooter
              counter={counter}
              resultsPerPage={resultsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </footer>
        </>
      )}
    </section>
  );
}
