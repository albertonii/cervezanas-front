'use client';

import EOTableData from './EOTableData';
import PaginationFooter from '@/app/[locale]/components/common/PaginationFooter';
import useFetchEventOrders from '../../../../../../hooks/useFetchEventOrders';
import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { useTranslations } from 'next-intl';
import { IEventOrder } from '@/lib//types/types';
import InputSearch from '@/app/[locale]/components/common/InputSearch';
import dynamic from 'next/dynamic';

const DynamicSpinner = dynamic(
    () => import('@/app/[locale]/components/common/Spinner'),
    {
        ssr: false,
    },
);

interface ColumnsProps {
    header: string;
}

export function EventOrderList() {
    const { user } = useAuth();
    if (!user) return null;

    const [isReady, setIsReady] = useState(false);

    const t = useTranslations();

    const [orders, setOrders] = useState<IEventOrder[]>([]);
    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const resultsPerPage = 100;

    const { isError, isLoading, refetch } = useFetchEventOrders(
        user.id,
        currentPage,
        resultsPerPage,
    );

    useEffect(() => {
        refetch().then((res: any) => {
            const orders = res.data as IEventOrder[];
            setOrders(orders);
            setIsReady(true);
        });
    }, [currentPage]);

    const COLUMNS = [
        { header: t('order_number_header') },
        { header: t('name_header') },
        { header: t('price_header') },
        { header: t('status_header') },
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
        <section className="mt-2 mb-4 space-y-3 rounded-md border-2 border-beer-blonde  bg-white px-6 py-4 shadow-2xl">
            {isError && (
                <div className="flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">
                        {t('error.fetching_event_orders')}
                    </span>
                </div>
            )}

            {isLoading && (
                <DynamicSpinner
                    color="beer-blonde"
                    size="xLarge"
                    absolute
                    center
                />
            )}

            {!isError && !isLoading && orders && orders.length === 0 ? (
                <p className="flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">
                        {t('no_orders')}
                    </span>
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
                                {COLUMNS.map(
                                    (column: ColumnsProps, index: number) => {
                                        return (
                                            <th
                                                key={index}
                                                scope="col"
                                                className="px-6 py-3"
                                            >
                                                {column.header}
                                            </th>
                                        );
                                    },
                                )}
                            </tr>
                        </thead>

                        <tbody>
                            {orders &&
                                filteredItemsByStatus.map(
                                    (order: IEventOrder) => {
                                        return (
                                            <EOTableData
                                                key={order.id}
                                                order={order}
                                            />
                                        );
                                    },
                                )}

                            {!orders && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-4 text-center"
                                    >
                                        {t('no_orders')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Prev and Next button for pagination  */}
                    <footer className="my-4 flex items-center justify-around">
                        <PaginationFooter
                            counter={orders.length}
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
