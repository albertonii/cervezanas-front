'use client';

import ListTableWrapper from '@/app/[locale]/components/ui/ListTableWrapper';
import useFetchOrdersByProducerId from '../../../../../../hooks/useFetchOrdersByProducerId';
import TableWithFooterAndSearch from '@/app/[locale]/components/ui/TableWithFooterAndSearch';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { encodeBase64 } from '@/utils/utils';
import { IBusinessOrder } from '@/lib/types/types';
import { formatDateString } from '@/utils/formatDate';
import { useLocale, useTranslations } from 'next-intl';
import { formatCurrency } from '@/utils/formatCurrency';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { IconButton } from '@/app/[locale]/components/ui/buttons/IconButton';
import { ROUTE_ONLINE_ORDERS, ROUTE_PRODUCER, ROUTE_PROFILE } from '@/config';

interface Props {
    bOrders: IBusinessOrder[];
}

export function BusinessOrderList({ bOrders: bOs }: Props) {
    const { user } = useAuth();
    if (!user) return null;

    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();

    const [bOrders, setBOrders] = useState<IBusinessOrder[]>(
        Array.from(new Set(bOs.map((order) => order.orders?.order_number)))
            .map((orderNumber) =>
                bOs.find((order) => order.orders?.order_number === orderNumber),
            )
            .filter((order) => order !== undefined) as IBusinessOrder[],
    );
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
            const bOrdersData = res.data as IBusinessOrder[];
            const bOrders_ = Array.from(
                new Set(bOrdersData.map((order) => order.orders?.order_number)),
            )
                .map((orderNumber) =>
                    bOrdersData.find(
                        (order) => order.orders?.order_number === orderNumber,
                    ),
                )
                .filter((order) => order !== undefined) as IBusinessOrder[];

            setBOrders(bOrders_);
        });
    }, [currentPage]);

    const handleClickView = (bOrder_: IBusinessOrder) => {
        const Ds_MerchantParameters = encodeBase64(
            JSON.stringify({ Ds_Order: bOrder_.orders?.order_number }),
        );

        router.push(
            `/${locale}${ROUTE_PRODUCER}${ROUTE_PROFILE}${ROUTE_ONLINE_ORDERS}/success?Ds_MerchantParameters=${Ds_MerchantParameters}`,
        );
    };

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
            header: t('date_header'),
            accessor: 'date',
            sortable: true,
            render: (value: string, row: IBusinessOrder) =>
                formatDateString(row.created_at),
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

    return (
        <ListTableWrapper
            isError={isError}
            isLoading={isLoading}
            errorMessage={'errors.fetching_online_bOrders'}
        >
            {!isError && !isLoading && bOrders && bOrders.length === 0 ? (
                <p className="flex items-center justify-center">
                    <h3 className="text-gray-500 dark:text-gray-400">
                        {t('no_bOrders')}
                    </h3>
                </p>
            ) : (
                <TableWithFooterAndSearch
                    columns={columns}
                    data={bOrders}
                    initialQuery={''}
                    resultsPerPage={resultsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    searchPlaceHolder={'search_by_name'}
                    paginationCounter={counter}
                    sourceDataIsFromServer={false}
                />
            )}
        </ListTableWrapper>
    );
}
