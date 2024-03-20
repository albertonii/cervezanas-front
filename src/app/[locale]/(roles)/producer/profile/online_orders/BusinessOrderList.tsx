'use client';

import PaginationFooter from '../../../../components/common/PaginationFooter';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IOrder } from '../../../../../../lib/types/types';
import Spinner from '../../../../components/common/Spinner';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import OProducerTableData from './OProducerTableData';
import InputSearch from '../../../../components/common/InputSearch';
import useFetchOrdersByProducerId from '../../../../../../hooks/useFetchOrdersByProducerId';

interface Props {
    orders: IOrder[];
}

interface ColumnsProps {
    header: string;
}

export function BusinessOrderList({ orders: os }: Props) {
    const { user } = useAuth();
    if (!user) return null;

    const t = useTranslations();

    const [orders, setOrders] = useState<IOrder[]>(os);
    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const counter = os.length;
    const resultsPerPage = 10;

    const { isError, isLoading, refetch } = useFetchOrdersByProducerId(
        user.id,
        currentPage,
        resultsPerPage,
    );

    useEffect(() => {
        refetch().then((res) => {
            const orders = res.data as IOrder[];
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
        <section className="relative mt-2 rounded-md border-2 border-beer-blonde px-2 py-4 shadow-xl">
            {isError && (
                <p className="flex items-center justify-center">
                    <h2 className="text-gray-500 dark:text-gray-400">
                        {t('error_fetching_online_orders')}
                    </h2>
                </p>
            )}

            {isLoading && (
                <Spinner color="beer-blonde" size="xLarge" absolute center />
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
                        <table className="text-center text-sm text-gray-500 dark:text-gray-400 border-2 ">
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
                                {filteredItemsByStatus.map((order) => {
                                    return (
                                        <OProducerTableData
                                            order={order}
                                            key={order.id}
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
