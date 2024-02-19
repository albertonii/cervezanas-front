'use client';

import OTableData from './OTableData';
import useFetchOrders from '../../../../../../hooks/useFetchOrders';
import PaginationFooter from '../../../../components/common/PaginationFooter';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IOrder } from '../../../../../../lib/types';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import InputSearch from '../../../../components/common/InputSearch';
import dynamic from 'next/dynamic';

const DynamicSpinner = dynamic(
  () => import('../../../../components/common/Spinner'),
  {
    ssr: false,
  },
);

interface ColumnsProps {
  header: string;
}

export function OrderList() {
  const { user } = useAuth();
  if (!user) return null;

  const [isReady, setIsReady] = useState(false);

  const t = useTranslations();

  const [orders, setOrders] = useState<IOrder[]>([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const resultsPerPage = 10;

  const { isError, isLoading, refetch } = useFetchOrders(
    user.id,
    currentPage,
    resultsPerPage,
  );

  useEffect(() => {
    refetch().then((res) => {
      const orders = res.data as IOrder[];
      setOrders(orders);
      setIsReady(true);
    });
  }, [currentPage]);

  const COLUMNS = [
    { header: t('order_number_header') },
    { header: t('price_header') },
    { header: t('status_header') },
    { header: t('tracking_number_header') },
    { header: t('date_header') },
    { header: t('action_header') },
  ];

  const filteredItemsByStatus = useMemo(() => {
    if (!orders) return [];
    return orders.filter((orders) => {
      return orders.status.toLowerCase().includes(query.toLowerCase());
    });
  }, [orders, query]);

  if (!isReady)
    return <DynamicSpinner color="beer-blonde" size="xLarge" center />;

  return (
    <section className="relative mt-6 overflow-x-auto shadow-md sm:rounded-lg">
      {isError && (
        <span className="flex items-center justify-center">
          <h2 className="text-gray-500 dark:text-gray-400">
            {t('error_fetching_online_orders')}
          </h2>
        </span>
      )}

      {isLoading && (
        <DynamicSpinner color="beer-blonde" size="xLarge" absolute center />
      )}

      {!isError && !isLoading && orders && orders.length === 0 ? (
        <p className="flex items-center justify-center">
          <h3 className="text-gray-500 dark:text-gray-400">{t('no_orders')}</h3>
        </p>
      ) : (
        <>
          <InputSearch
            query={query}
            setQuery={setQuery}
            searchPlaceholder={'search_order'}
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
                  return <OTableData key={order.id} order={order} />;
                })}
              {!orders && (
                <tr>
                  <td colSpan={6} className="py-4 text-center">
                    {t('no_orders')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Prev and Next button for pagination  */}
          <div className="my-4 flex items-center justify-around">
            <PaginationFooter
              counter={orders?.length}
              resultsPerPage={resultsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </>
      )}
    </section>
  );
}
