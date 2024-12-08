'use client';

import Image from 'next/image';
import Link from 'next/link';
import useFetchCampaignsByOwnerAndPagination from '../../../../../../hooks/useFetchCampaignsByOwnerAndPagination';
import React, { ComponentProps, useEffect, useState } from 'react';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { ICampaign } from '@/lib/types/types';
import { formatDateString } from '@/utils/formatDate';
import { useLocale, useTranslations } from 'next-intl';
import { DeleteButton } from '@/app/[locale]/components/ui/buttons/DeleteButton';
import { EditButton } from '@/app/[locale]/components/ui/buttons/EditButton';
import Spinner from '@/app/[locale]/components/ui/Spinner';
import TableWithFooterAndSearch from '@/app/[locale]/components/ui/TableWithFooterAndSearch';

interface Props {
    handleEditShowModal: ComponentProps<any>;
    handleDeleteShowModal: ComponentProps<any>;
    handleCampaignModal: ComponentProps<any>;
    counter: number;
}

export function CampaignList({
    handleEditShowModal,
    handleDeleteShowModal,
    handleCampaignModal,
    counter,
}: Props) {
    const { user } = useAuth();

    const t = useTranslations();
    const locale = useLocale();

    const [campaigns, setCampaigns] = useState<ICampaign[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 10;

    const { data, isError, isLoading, refetch } =
        useFetchCampaignsByOwnerAndPagination(
            user?.id,
            currentPage,
            resultsPerPage,
        );

    useEffect(() => {
        refetch().then((res: any) => {
            const campaigns = res.data as ICampaign[];
            setCampaigns(campaigns);
        });
    }, [data, currentPage]);

    const handleEditClick = (campaign: ICampaign) => {
        handleEditShowModal(true);
        handleDeleteShowModal(false);
        handleCampaignModal(campaign);
    };

    const handleDeleteClick = (campaign: ICampaign) => {
        handleEditShowModal(false);
        handleDeleteShowModal(true);
        handleCampaignModal(campaign);
    };

    const columns = [
        {
            header: t('campaign_type_header'),
            accessor: 'type',
            sortable: true,
            render: () => (
                <Image
                    width={32}
                    height={32}
                    className="rounded-full"
                    src="/icons/stopwatch-solid.svg"
                    alt="Campaign"
                />
            ),
        },
        {
            header: t('name_header'),
            accessor: 'name',
            sortable: true,
            render: (value: string, row: ICampaign) => (
                <Link
                    href={`/campaigns/${row.id}`}
                    locale={locale}
                    className="font-semibold text-beer-blonde hover:text-beer-draft dark:text-beer-softBlonde dark:hover:text-beer-gold"
                >
                    {value}
                </Link>
            ),
        },
        {
            header: t('start_date_header'),
            accessor: 'start_date',
            sortable: true,
            render: (value: string) => formatDateString(value),
        },
        {
            header: t('end_date_header'),
            accessor: 'end_date',
            sortable: true,
            render: (value: string) => formatDateString(value),
        },
        {
            header: t('status'),
            accessor: 'status',
            sortable: true,
            render: (value: string) => t(value),
        },
        {
            header: t('is_public'),
            accessor: 'is_public',
            sortable: true,
            render: (value: boolean) => (value ? t('yes') : t('no')),
        },
        {
            header: t('action_header'),
            accessor: 'action',
            render: (value: any, row: ICampaign) => (
                <div className="flex space-x-1">
                    <EditButton onClick={() => handleEditClick(row)} />
                    <DeleteButton onClick={() => handleDeleteClick(row)} />
                </div>
            ),
        },
    ];

    return (
        <section className="bg-beer-foam relative mt-6 space-y-4 overflow-x-auto shadow-md sm:rounded-lg">
            {isError && (
                <div className="flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        {t('errors.fetching_campaigns')}
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

            {!isError && !isLoading && data?.length === 0 ? (
                <div className="my-[10vh] flex items-center justify-center">
                    <p className="text-2xl text-gray-500 dark:text-gray-400">
                        {t('no_campaigns')}
                    </p>
                </div>
            ) : (
                <TableWithFooterAndSearch
                    columns={columns}
                    data={campaigns}
                    initialQuery={''}
                    resultsPerPage={resultsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    searchPlaceHolder={'search_by_name'}
                    paginationCounter={counter}
                    sourceDataIsFromServer={false}
                />
            )}
        </section>
    );
}
