'use client';

import Spinner from '@/app/[locale]/components/common/Spinner';
import TableWithFooterAndSearch from '@/app/[locale]/components/TableWithFooterAndSearch';
import useFetchOrdersByDistributorId from '../../../../../../hooks/useFetchOrdersByDistributorId';
import React, { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { IBusinessOrder } from '@/lib//types/types';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { formatDateString } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import { IconButton } from '@/app/[locale]/components/common/IconButton';
import { encodeBase64 } from '@/utils/utils';
import { useRouter } from 'next/navigation';
import { faTruck } from '@fortawesome/free-solid-svg-icons';
import {
    ROUTE_BUSINESS_ORDERS,
    ROUTE_DISTRIBUTOR,
    ROUTE_PROFILE,
} from '@/config';

interface Props {
    bOrders: IBusinessOrder[];
}

export function BusinessOrderList({ bOrders: bOs }: Props) {
    const { user } = useAuth();
    if (!user) return null;

    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();

    const [bOrders, setBOrders] = useState<IBusinessOrder[]>(bOs);
    const [currentPage, setCurrentPage] = useState(1);

    const counter = bOs.length;
    const resultsPerPage = 10;

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

    const handleClickView = (bOrder_: IBusinessOrder) => {
        const Ds_MerchantParameters = encodeBase64(
            JSON.stringify({ Ds_Order: bOrder_.orders?.order_number }),
        );

        router.push(
            `/${locale}${ROUTE_DISTRIBUTOR}${ROUTE_PROFILE}${ROUTE_BUSINESS_ORDERS}/success?Ds_MerchantParameters=${Ds_MerchantParameters}`,
        );
    };

    const columns = [
        {
            header: t('order_number_header'),
            accessor: 'order_number',
            sortable: true,
            render: (value: string, row: IBusinessOrder) =>
                row.orders?.order_number,
        },
        {
            header: t('client_name_header'),
            accessor: 'client_name',
            sortable: true,
            render: (value: string, row: IBusinessOrder) =>
                row.orders?.customer_name,
        },
        {
            header: t('products_quantity_header'),
            accessor: 'products_quantity',
            sortable: true,
            render: (value: number, row: IBusinessOrder) => {
                return row.order_items?.length;
            },
        },
        {
            header: t('price_header'),
            accessor: 'price',
            sortable: true,
            render: (value: number, row: IBusinessOrder) =>
                formatCurrency(row.orders?.total),
        },
        {
            header: t('status_header'),
            accessor: 'status',
            sortable: true,
            render: (value: string, row: IBusinessOrder) =>
                t(row.orders?.status),
        },
        {
            header: t('tracking_number_header'),
            accessor: 'tracking_number',
            sortable: true,
            render: (value: string, row: IBusinessOrder) =>
                row.orders?.tracking_id,
        },
        {
            header: t('date_header'),
            accessor: 'created_at',
            sortable: true,
            render: (value: string, row: IBusinessOrder) =>
                formatDateString(value),
        },
        {
            header: t('action_header'),
            accessor: 'action',
            render: (value: any, row: IBusinessOrder) => (
                <IconButton
                    onClick={() => handleClickView(row)}
                    icon={faTruck}
                    title={''}
                />
            ),
        },
    ];

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
                <TableWithFooterAndSearch
                    columns={columns}
                    data={bOrders}
                    initialQuery={''}
                    resultsPerPage={resultsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    searchPlaceHolder={'search_order'}
                    paginationCounter={counter}
                    sourceDataIsFromServer={false}
                />
            )}
        </section>
    );
}
