"use client";

import useFetchEventOrders from "../../../../../../hooks/useFetchEventOrders";
import PaginationFooter from "../../../../components/common/PaginationFooter";
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../../Auth/useAuth";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { IEventOrder } from "../../../../../../lib/types";
import { IconButton } from "../../../../components/common/IconButton";
import { Spinner } from "../../../../components/common/Spinner";
import { encodeBase64 } from "../../../../../../utils/utils";
import { formatCurrency } from "../../../../../../utils/formatCurrency";
import InputSearch from "../../../../components/common/InputSearch";

interface Props {
  eventOrders: IEventOrder[];
}

interface ColumnsProps {
  header: string;
}

export function EventOrderList({ eventOrders: os }: Props) {
  const { user } = useAuth();
  if (!user) return null;

  const t = useTranslations();
  const locale = useLocale();

  const [orders, setOrders] = useState<IEventOrder[]>(os);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const counter = os.length;
  const resultsPerPage = 10;

  const router = useRouter();

  const { isError, isLoading, refetch } = useFetchEventOrders(
    user.id,
    currentPage,
    resultsPerPage
  );

  useEffect(() => {
    refetch().then((res: any) => {
      const orders = res.data as IEventOrder[];
      setOrders(orders);
    });
  }, [currentPage]);

  const COLUMNS = [
    { header: t("order_number_header") },
    { header: t("name_header") },
    { header: t("price_header") },
    { header: t("status_header") },
    { header: t("action_header") },
  ];

  const handleClickView = (order: IEventOrder) => {
    const Ds_MerchantParameters = encodeBase64(
      JSON.stringify({ Ds_Order: order.order_number })
    );

    router.push(
      `/${locale}/checkout/event/success?Ds_MerchantParameters=${Ds_MerchantParameters}`
    );
  };

  const filteredItemsByStatus = useMemo(() => {
    if (!orders) return [];
    return orders.filter((orders) => {
      return orders.status.includes(query);
    });
  }, [orders, query]);

  return (
    <div className="relative mt-6 overflow-x-auto shadow-md sm:rounded-lg">
      {isError && (
        <div className="flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            {t("error_fetching_event_orders")}
          </p>
        </div>
      )}

      {isLoading && (
        <Spinner color="beer-blonde" size="xLarge" absolute center />
      )}

      {!isError && !isLoading && orders && orders.length === 0 ? (
        <div className="flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">{t("no_orders")}</p>
        </div>
      ) : (
        <>
          <InputSearch
            query={query}
            setQuery={setQuery}
            searchPlaceholder={"search_order"}
          />

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
                  return (
                    <tr
                      key={order.id}
                      className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <td className="px-6 py-4">{order.order_number}</td>

                      <td className="px-6 py-4">
                        {order.users?.username ?? " - "}
                      </td>

                      <td className="px-6 py-4">
                        {formatCurrency(order.total)}
                      </td>

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
          <div className="my-4 flex items-center justify-around">
            <PaginationFooter
              counter={counter}
              resultsPerPage={resultsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
