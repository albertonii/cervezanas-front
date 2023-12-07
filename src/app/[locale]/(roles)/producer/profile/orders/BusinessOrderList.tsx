"use client";

import PaginationFooter from "../../../../components/common/PaginationFooter";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { IBusinessOrder } from "../../../../../../lib/types";
import { Spinner } from "../../../../components/common/Spinner";
import { useAuth } from "../../../../Auth/useAuth";
import OTableData from "./OTableData";
import InputSearch from "../../../../components/common/InputSearch";
import useFetchBusinessOrders from "../../../../../../hooks/useFetchBusinessOrders";

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

  const { isError, isLoading, refetch } = useFetchBusinessOrders(
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

  const filteredItemsByStatus = useMemo(() => {
    if (!bOrders) return [];
    return bOrders.filter((bOrders) => {
      return bOrders.orders?.status.includes(query);
    });
  }, [bOrders, query]);

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

      {!isError && !isLoading && bOrders && bOrders.length === 0 ? (
        <p className="flex items-center justify-center">
          <h3 className="text-gray-500 dark:text-gray-400">{t("no_orders")}</h3>
        </p>
      ) : (
        <>
          <InputSearch
            query={query}
            setQuery={setQuery}
            searchPlaceholder={"search_by_name"}
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
                  return <OTableData bOrder={bOrder} key={bOrder.id} />;
                })}
              {!bOrders && (
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
