'use client';

import Spinner from '@/app/[locale]/components/common/Spinner';
import TableWithFoorterAndSearch from '@/app/[locale]/components/TableWithFoorterAndSearch';
import useFetchOrdersByProducerId from '../../../../../../hooks/useFetchOrdersByProducerId';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { encodeBase64 } from '@/utils/utils';
import { IBusinessOrder } from '@/lib//types/types';
import { useLocale, useTranslations } from 'next-intl';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { IconButton } from '@/app/[locale]/components/common/IconButton';
import { ROUTE_ONLINE_ORDERS, ROUTE_PRODUCER, ROUTE_PROFILE } from '@/config';
import { formatDateString } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';

interface Props {
    bOrders: IBusinessOrder[];
}

export function BusinessOrderList({ bOrders: bOs }: Props) {
    const { user } = useAuth();
    if (!user) return null;

    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();

    const [orders, setOrders] = useState<IBusinessOrder[]>(bOs);
    const [currentPage, setCurrentPage] = useState(1);

    const counter = bOs.length;
    const resultsPerPage = 10;

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

    console.log('ORDERS ', orders);

    const columns = [
        {
            header: t('order_number_header'),
            accessor: 'order_number',
            sortable: true,
            render: (_: string, row: IBusinessOrder) =>
                row.orders?.order_number ?? '',
        },
        {
            header: t('client_name_header'),
            accessor: 'client_name',
            sortable: true,
            render: (_: string, row: IBusinessOrder) =>
                row?.orders?.customer_name ?? '',
        },
        {
            header: t('products_quantity_header'),
            accessor: 'products_quantity',
            sortable: true,
            render: (_: string, row: IBusinessOrder) =>
                row?.orders?.business_orders?.length ?? '',
        },
        {
            header: t('price_header'),
            accessor: 'price',
            sortable: true,
            render: (_: string, row: IBusinessOrder) =>
                formatCurrency(row?.orders?.total) ?? '',
        },
        {
            header: t('status_header'),
            accessor: 'status',
            sortable: true,
            render: (_: string, row: IBusinessOrder) => t(row?.orders?.status),
        },
        {
            header: t('tracking_number_header'),
            accessor: 'tracking_number',
            sortable: true,
            render: (_: string, row: IBusinessOrder) =>
                row?.orders?.tracking_id ?? '',
        },
        {
            header: t('date_header'),
            accessor: 'date',
            sortable: true,
            render: (_: string, row: IBusinessOrder) =>
                formatDateString(row.orders?.created_at) ?? '',
        },
        {
            header: t('action_header'),
            accessor: 'action',
            render: (_: string, row: IBusinessOrder) => (
                <IconButton
                    onClick={() => handleClickView(row)}
                    icon={faEye}
                    title={''}
                />
            ),
        },
    ];

    const handleClickView = (order: IBusinessOrder) => {
        console.log('HANDLE VIEW ', order);
        const Ds_MerchantParameters = encodeBase64(
            JSON.stringify({ Ds_Order: order.orders?.order_number }),
        );

        router.push(
            `/${locale}${ROUTE_PRODUCER}${ROUTE_PROFILE}${ROUTE_ONLINE_ORDERS}/success?Ds_MerchantParameters=${Ds_MerchantParameters}`,
        );
    };

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
                <TableWithFoorterAndSearch
                    columns={columns}
                    data={orders}
                    initialQuery={''}
                    resultsPerPage={resultsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    searchPlaceHolder={'search_by_name'}
                    paginationCounter={counter}
                />
            )}
        </section>
    );
}
