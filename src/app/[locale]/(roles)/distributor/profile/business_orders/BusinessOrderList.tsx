'use client';

import PaginationFooter from '@/app/[locale]/components/common/PaginationFooter';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IBusinessOrder } from '@/lib//types/types';
import Spinner from '@/app/[locale]/components/common/Spinner';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import InputSearch from '@/app/[locale]/components/common/InputSearch';
import useFetchOrdersByDistributorId from '../../../../../../hooks/useFetchOrdersByDistributorId';
import ODistributorTableData from './ODistributorTableData';

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

    const [bOrders, setBOrders] = useState<IBusinessOrder[]>(bOs);
    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const counter = bOs.length;
    const resultsPerPage = 100;

    const { isError, isLoading, refetch } = useFetchOrdersByDistributorId(
        user.id,
        currentPage,
        resultsPerPage,
    );

    useEffect(() => {
        refetch().then((res) => {
            const orders = res.data as IBusinessOrder[];
            setBOrders(orders);
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
        if (!bOrders) return [];
        return bOrders.filter((bOrder) => {
            return bOrder.status.toLowerCase().includes(query.toLowerCase());
        });
    }, [bOrders, query]);

    return (
        <section className="relative mt-6 overflow-x-auto shadow-md sm:rounded-lg bg-beer-foam">
            {isError && (
                <div className="flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        {t('errors.fetching_online_orders')}
                    </p>
                </div>
            )}

            {isLoading && (
                <Spinner
                    color="beer-blonde"
                    size="xLarge"
                    absolute
                    flexCenter
                />
            )}

            {!isError && !isLoading && bOrders && bOrders.length === 0 ? (
                <div className="flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        {t('no_orders')}
                    </p>
                </div>
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
                            {filteredItemsByStatus.map((bOrder) => {
                                return (
                                    <ODistributorTableData
                                        bOrder={bOrder}
                                        key={bOrder.id}
                                    />
                                );
                            })}
                            {!bOrders && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-4 text-center"
                                    >
                                        {t('no_business_orders')}
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
