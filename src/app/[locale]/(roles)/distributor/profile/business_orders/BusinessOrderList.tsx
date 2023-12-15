"use client";

import PaginationFooter from "../../../../components/common/PaginationFooter";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { IBusinessOrder } from "../../../../../../lib/types";
import { formatCurrency } from "../../../../../../utils/formatCurrency";
import { IconButton } from "../../../../components/common/IconButton";
import Spinner from "../../../../components/common/Spinner";
import {  faTruck } from "@fortawesome/free-solid-svg-icons";
import { encodeBase64 } from "../../../../../../utils/utils";
import { useAuth } from "../../../../Auth/useAuth";
import InputSearch from "../../../../components/common/InputSearch";
import useFetchBusinessOrdersByDistributorId from "../../../../../../hooks/useFetchBusinessOrderByDistributorId";

interface Props {
  bOrders: IBusinessOrder[];
}

interface ColumnsProps {
  header: string;
}

export function BusinessOrderList({ bOrders: os }: Props) {
  const { user } = useAuth();
  if (!user) return null;

  const t = useTranslations();

  const [bOrders, setBOrders] = useState<IBusinessOrder[]>(os);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const counter = os.length;
  const resultsPerPage = 10;

  const locale = useLocale();
  const router = useRouter();

  const { isError, isLoading, refetch } = useFetchBusinessOrdersByDistributorId(
    user.id,
    currentPage,
    resultsPerPage
  );

  useEffect(() => {
    refetch().then((res) => {
      const bOrders = res.data as IBusinessOrder[];
      setBOrders(bOrders);
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

  const handleClickViewCompleteOrder = (bOrder: IBusinessOrder) => {
    if (!bOrder.orders) return null;

    const Ds_MerchantParameters = encodeBase64(
      JSON.stringify({ Ds_Order: bOrder.orders.order_number })
    );

    router.push(
      `/${locale}/distributor/profile/business_orders/success?Ds_MerchantParameters=${Ds_MerchantParameters}`
    );
  };


  const filteredItemsByStatus = useMemo(() => {
    if (!bOrders) return [];
    return bOrders.filter((bOrders) => {
      return bOrders.orders?.status.includes(query);
    });
  }, [bOrders, query]);

  return (
    <div className="relative mt-6 overflow-x-auto shadow-md sm:rounded-lg">
      {isError && (
        <div className="flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            {t("error_fetching_online_orders")}
          </p>
        </div>
      )}

      {isLoading && (
        <Spinner color="beer-blonde" size="xLarge" absolute center />
      )}

      {!isError && !isLoading && bOrders && bOrders.length === 0 ? (
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
              {bOrders &&
                filteredItemsByStatus.map((bOrder) => {
                  if (!bOrder.orders) return null;

                  return (
                    <tr
                      key={bOrder.id}
                      className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <td className="px-6 py-4">
                        {bOrder.orders.order_number}
                      </td>

                      <td className="px-6 py-4">
                        {bOrder.orders.customer_name}
                      </td>

                      <td className="px-6 py-4">
                        {formatCurrency(bOrder.orders.total)}
                      </td>

                      <td className="px-6 py-4">{t(bOrder.orders.status)}</td>

                      <td className="px-6 py-4">{bOrder.orders.tracking_id}</td>

                      <td className="item-center flex justify-center gap-2 px-6 py-4">
                        <IconButton
                          onClick={() => handleClickViewCompleteOrder(bOrder)}
                          icon={faTruck}
                          title={""}
                        />

                      </td>
                    </tr>
                  );
                })}
              {!bOrders && (
                <tr>
                  <td colSpan={6} className="py-4 text-center">
                    {t("no_business_orders")}
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
    </div>
  );
}
