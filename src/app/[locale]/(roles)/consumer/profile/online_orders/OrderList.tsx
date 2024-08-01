'use client';

import dynamic from 'next/dynamic';
import useFetchOrders from '../../../../../../hooks/useFetchOrders';
import TableWithFooterAndSearch from '@/app/[locale]/components/TableWithFooterAndSearch';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IOrder } from '@/lib//types/types';
import { useRouter } from 'next/navigation';
import { encodeBase64 } from '@/utils/utils';
import { formatDateString } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { IconButton } from '@/app/[locale]/components/common/IconButton';

const DynamicSpinner = dynamic(
    () => import('@/app/[locale]/components/common/Spinner'),
    {
        ssr: false,
    },
);

interface Props {
    counter: number;
}

export function OrderList({ counter }: Props) {
    const { user } = useAuth();
    if (!user) return null;

    const router = useRouter();
    const [isReady, setIsReady] = useState(false);

    const t = useTranslations();

    const [orders, setOrders] = useState<IOrder[]>([]);
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

    const handleClickView = (order: IOrder) => {
        const Ds_MerchantParameters = encodeBase64(
            JSON.stringify({ Ds_Order: order.order_number }),
        );

        // Get current url
        const currentUrl = window.location.href;

        router.push(
            `${currentUrl}/checkout/success?Ds_MerchantParameters=${Ds_MerchantParameters}`,
        );
    };

    const COLUMNS = [
        { header: t('order_number_header') },
        { header: t('price_header') },
        { header: t('status_header') },
        { header: t('tracking_number_header') },
        { header: t('date_header') },
        { header: t('action_header') },
    ];

    const columns = [
        {
            header: t('order_number_header'),
            accessor: 'order_number',
            sortable: true,
            render: (value: string) => value,
        },
        {
            header: t('price_header'),
            accessor: 'total',
            sortable: true,
            render: (value: number) => formatCurrency(value),
        },
        {
            header: t('status_header'),
            accessor: 'status',
            sortable: true,
            render: (value: string) => t(value),
        },
        {
            header: t('tracking_number_header'),
            accessor: 'tracking_id',
            sortable: true,
            render: (value: string) => value,
        },
        {
            header: t('date_header'),
            accessor: 'created_at',
            sortable: true,
            render: (value: string) => formatDateString(value),
        },
        {
            header: t('action_header'),
            accessor: 'action',
            render: (value: any, row: IOrder) => (
                <IconButton
                    onClick={() => handleClickView(row)}
                    icon={faEye}
                    title={''}
                />
            ),
        },
    ];

    if (!isReady)
        return (
            <DynamicSpinner
                color="beer-blonde"
                size="xLarge"
                absolute
                absolutePosition="center"
            />
        );

    return (
        <section className="mt-2 mb-4 space-y-3 rounded-md border-2 border-beer-blonde  bg-white px-6 py-4 shadow-2xl">
            {isError && (
                <span className="flex items-center justify-center">
                    <h2 className="text-gray-500 dark:text-gray-400">
                        {t('errors.fetching_online_orders')}
                    </h2>
                </span>
            )}

            {isLoading && (
                <DynamicSpinner
                    color="beer-blonde"
                    size="xLarge"
                    absolute
                    absolutePosition="center"
                />
            )}

            {!isError && !isLoading && orders && orders.length === 0 ? (
                <p className="flex items-center justify-center">
                    <h3 className="text-gray-500 dark:text-gray-400">
                        {t('no_orders')}
                    </h3>
                </p>
            ) : (
                <TableWithFooterAndSearch
                    columns={columns}
                    data={orders}
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
