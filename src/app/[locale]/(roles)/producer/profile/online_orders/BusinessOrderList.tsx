'use client';

import OProducerTableData from './OProducerTableData';
import Spinner from '@/app/[locale]/components/common/Spinner';
import InputSearch from '@/app/[locale]/components/common/InputSearch';
import PaginationFooter from '@/app/[locale]/components/common/PaginationFooter';
import useFetchOrdersByProducerId from '../../../../../../hooks/useFetchOrdersByProducerId';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { IBusinessOrder } from '@/lib//types/types';

interface Props {
    bOrders: IBusinessOrder[];
}

interface ColumnsProps {
    header: string;
}

export function BusinessOrderList({ bOrders: bOs }: Props) {
    const { user } = useAuth();
    if (!user) return null;

    const t = useTranslations();

    const [orders, setOrders] = useState<IBusinessOrder[]>(bOs);
    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const counter = bOs.length;
    const resultsPerPage = 100;

    const { isError, isLoading, refetch } = useFetchOrdersByProducerId(
        user.id,
        currentPage,
        resultsPerPage,
    );

    useEffect(() => {
        refetch().then((res) => {
            const orders = res.data as IBusinessOrder[];
            setOrders(orders);
        });
    }, [currentPage]);

    const COLUMNS = [
        { header: t('order_number_header') },
        { header: t('client_name_header') },
        { header: t('products_quantity_header') },
        { header: t('price_header') },
        { header: t('status_header') },
        { header: t('tracking_number_header') },
        { header: t('date_header') },
        { header: t('action_header') },
    ];

    const filteredItemsByStatus = useMemo(() => {
        if (!orders) return [];
        return orders.filter((order) => {
            return order.status.toLowerCase().includes(query.toLowerCase());
        });
    }, [orders, query]);

    return (
        <section className="bg-beer-foam relative mt-2 rounded-md border-2 border-beer-blonde px-2 py-4 shadow-xl">
            {isError && (
                <p className="flex items-center justify-center">
                    <h2 className="text-gray-500 dark:text-gray-400">
                        {t('errors.fetching_online_orders')}
                    </h2>
                </p>
            )}

            {isLoading && (
                <Spinner
                    color="beer-blonde"
                    size="xLarge"
                    absolute
                    flexCenter
                />
            )}

            {!isError && !isLoading && orders && orders.length === 0 ? (
                <p className="flex items-center justify-center">
                    <h3 className="text-gray-500 dark:text-gray-400">
                        {t('no_orders')}
                    </h3>
                </p>
            ) : (
                <div className="space-y-2">
                    <InputSearch
                        query={query}
                        setQuery={setQuery}
                        searchPlaceholder={'search_by_name'}
                    />

                    <div className="overflow-x-scroll border-2 ">
                        <table className="w-full text-center text-sm text-gray-500 dark:text-gray-400 border-2 ">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    {COLUMNS.map(
                                        (
                                            column: ColumnsProps,
                                            index: number,
                                        ) => {
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
                                {filteredItemsByStatus.map((bOrder) => {
                                    return (
                                        <OProducerTableData
                                            bOrder={bOrder}
                                            key={bOrder.id}
                                        />
                                    );
                                })}
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
                    </div>

                    {/* Prev and Next button for pagination  */}
                    <footer className="my-4 flex items-center justify-around">
                        <PaginationFooter
                            counter={counter}
                            resultsPerPage={resultsPerPage}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </footer>
                </div>
            )}
        </section>
    );
}
