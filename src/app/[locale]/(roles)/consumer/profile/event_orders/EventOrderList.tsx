'use client';

import useFetchEventOrders from '../../../../../../hooks/useFetchEventOrders';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { encodeBase64 } from '@/utils/utils';
import { IEventOrder } from '@/lib//types/types';
import { formatDateString } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { IconButton } from '@/app/[locale]/components/ui/buttons/IconButton';
import TableWithFooterAndSearch from '@/app/[locale]/components/ui/TableWithFooterAndSearch';
import Spinner from '@/app/[locale]/components/ui/Spinner';

interface Props {
    counter: number;
}

export function EventOrderList({ counter }: Props) {
    const { user } = useAuth();
    if (!user) return null;

    const router = useRouter();

    const [isReady, setIsReady] = useState(false);

    const t = useTranslations();

    const [orders, setOrders] = useState<IEventOrder[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const resultsPerPage = 10;

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

    const handleClickView = (order: IEventOrder) => {
        const Ds_MerchantParameters = encodeBase64(
            JSON.stringify({ Ds_Order: order.order_number }),
        );

        // Get current url
        const currentUrl = window.location.href;

        router.push(
            `${currentUrl}/checkout/success?Ds_MerchantParameters=${Ds_MerchantParameters}`,
        );
    };

    const columns = [
        {
            header: t('order_number_header'),
            accessor: 'order_number',
            sortable: true,
            render: (value: string) => value,
        },
        {
            header: t('name_header'),
            accessor: 'users.username',
            sortable: true,
            render: (value: string, row: IEventOrder) =>
                row.users?.username ?? ' - ',
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
            header: t('date_header'),
            accessor: 'created_at',
            sortable: true,
            render: (value: string) => formatDateString(value),
        },
        {
            header: t('action_header'),
            accessor: 'action',
            render: (value: any, row: IEventOrder) => (
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
            <Spinner
                color="beer-blonde"
                size="xLarge"
                absolutePosition="center"
                absolute
            />
        );

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
                <Spinner
                    color="beer-blonde"
                    size="xLarge"
                    absolute
                    absolutePosition="center"
                />
            )}

            {!isError && !isLoading && orders && orders.length === 0 ? (
                <p className="flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">
                        {t('no_orders')}
                    </span>
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
