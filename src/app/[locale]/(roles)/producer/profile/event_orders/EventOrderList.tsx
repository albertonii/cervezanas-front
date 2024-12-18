'use client';

import ListTableWrapper from '@/app/[locale]/components/ui/ListTableWrapper';
import useFetchEventOrders from '../../../../../../hooks/useFetchEventOrders';
import TableWithFooterAndSearch from '@/app/[locale]/components/ui/TableWithFooterAndSearch';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { encodeBase64 } from '@/utils/utils';
import { IEventOrder } from '@/lib/types/eventOrders';
import { formatCurrency } from '@/utils/formatCurrency';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { IconButton } from '@/app/[locale]/components/ui/buttons/IconButton';

interface Props {
    eventOrders: IEventOrder[];
}

export function EventOrderList({ eventOrders: os }: Props) {
    const { user } = useAuth();
    if (!user) return null;

    const t = useTranslations();

    const [orders, setOrders] = useState<IEventOrder[]>(os);
    const [currentPage, setCurrentPage] = useState(1);

    const counter = os.length;
    const resultsPerPage = 10;

    const router = useRouter();

    const { isError, isLoading, refetch } = useFetchEventOrders(
        user.id,
        currentPage,
        resultsPerPage,
    );

    useEffect(() => {
        refetch().then((res: any) => {
            const orders = res.data as IEventOrder[];
            setOrders(orders);
        });
    }, [currentPage]);

    const handleClickView = (order: IEventOrder) => {
        const Ds_MerchantParameters = encodeBase64(
            JSON.stringify({ Ds_Order: order.order_number }),
        );

        // Get current url
        const currentUrl = window.location.href;

        router.push(
            `${currentUrl}/checkout/event/success?Ds_MerchantParameters=${Ds_MerchantParameters}`,
        );
    };

    const columns = [
        {
            header: t('order_number_header'),
            accessor: 'order_number',
        },
        {
            header: t('name_header'),
            accessor: 'users.username',
            render: (_: string, row: IEventOrder) =>
                row.users?.username ?? ' - ',
        },
        {
            header: t('price_header'),
            accessor: 'total',
            render: (_: number, row: IEventOrder) => formatCurrency(row.total),
        },
        {
            header: t('status_header'),
            accessor: 'status',
            render: (_: string, row: IEventOrder) => t(row.status),
        },
        {
            header: t('action_header'),
            accessor: 'action',
            render: (value: any, row: IEventOrder) => (
                <IconButton
                    onClick={() => handleClickView(row)}
                    icon={faEye}
                    title={t('view')}
                />
            ),
        },
    ];

    return (
        <ListTableWrapper
            isError={isError}
            isLoading={isLoading}
            errorMessage={'errors.fetching_event_orders'}
        >
            {!isError && !isLoading && orders && orders.length === 0 ? (
                <div className="flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        {t('no_orders')}
                    </p>
                </div>
            ) : (
                <TableWithFooterAndSearch
                    columns={columns}
                    data={orders}
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
