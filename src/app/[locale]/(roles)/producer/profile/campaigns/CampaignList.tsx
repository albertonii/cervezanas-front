'use client';

import Image from 'next/image';
import Link from 'next/link';
import PaginationFooter from '../../../../components/common/PaginationFooter';
import React, { ComponentProps, useMemo, useState } from 'react';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { useLocale, useTranslations } from 'next-intl';
import { ICampaign } from '../../../../../../lib/types/types';
import Spinner from '../../../../components/common/Spinner';
import { EditButton } from '../../../../components/common/EditButton';
import { DeleteButton } from '../../../../components/common/DeleteButton';
import InputSearch from '../../../../components/common/InputSearch';
import useFetchCampaignsByOwnerAndPagination from '../../../../../../hooks/useFetchCampaignsByOwnerAndPagination';
import { formatDateString } from '../../../../../../utils/formatDate';

interface Props {
    handleEditShowModal: ComponentProps<any>;
    handleDeleteShowModal: ComponentProps<any>;
    handleCampaignModal: ComponentProps<any>;
}

interface ColumnsProps {
    header: string;
}

export function CampaignList({
    handleEditShowModal,
    handleDeleteShowModal,
    handleCampaignModal,
}: Props) {
    const { user } = useAuth();

    const t = useTranslations();
    const locale = useLocale();

    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 100;

    const {
        data: campaigns,
        isError,
        isLoading,
    } = useFetchCampaignsByOwnerAndPagination(
        user?.id,
        currentPage,
        resultsPerPage,
    );

    const counter = campaigns?.filter((campaign) => !campaign).length ?? 0;

    const COLUMNS = [
        { header: t('campaign_type_header') },
        { header: t('name_header') },
        { header: t('start_date_header') },
        { header: t('end_date_header') },
        { header: t('status') },
        { header: t('is_public') },
        { header: t('action_header') },
    ];

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

    const filteredItems = useMemo<any[]>(() => {
        if (!campaigns) return [];
        return campaigns.filter((campaign) => {
            return campaign.name?.toLowerCase().includes(query.toLowerCase());
        });
    }, [campaigns, query]);

    return (
        <section className="bg-beer-foam relative mt-6 space-y-4 overflow-x-auto shadow-md sm:rounded-lg">
            {isError && (
                <div className="flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        {t('error_fetching_campaigns')}
                    </p>
                </div>
            )}

            {isLoading && (
                <Spinner color="beer-blonde" size="xLarge" absolute center />
            )}

            {!isError && !isLoading && campaigns?.length === 0 ? (
                <div className="my-[10vh] flex items-center justify-center">
                    <p className="text-2xl text-gray-500 dark:text-gray-400">
                        {t('no_campaigns')}
                    </p>
                </div>
            ) : (
                <>
                    <InputSearch
                        query={query}
                        setQuery={setQuery}
                        searchPlaceholder={'search_campaigns'}
                    />

                    <table className="bg-beer-foam w-full text-center text-sm text-gray-500 dark:text-gray-400 ">
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
                            {campaigns &&
                                filteredItems.map((campaign) => {
                                    return (
                                        <tr key={campaign.id} className="">
                                            <>
                                                <th
                                                    scope="row"
                                                    className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                                                >
                                                    <Image
                                                        width={128}
                                                        height={128}
                                                        className="h-8 w-8 rounded-full"
                                                        src="/icons/stopwatch-solid.svg"
                                                        alt="Campaign"
                                                    />
                                                </th>

                                                <td className="px-6 py-4 font-semibold text-beer-blonde hover:text-beer-draft">
                                                    <Link
                                                        href={`/campaigns/${campaign.id}`}
                                                        locale={locale}
                                                    >
                                                        {campaign.name}
                                                    </Link>
                                                </td>

                                                <td className="px-6 py-4">
                                                    {formatDateString(
                                                        campaign.start_date,
                                                    )}
                                                </td>

                                                <td className="px-6 py-4">
                                                    {formatDateString(
                                                        campaign.end_date,
                                                    )}
                                                </td>

                                                <td className="px-6 py-4">
                                                    {t(campaign.status)}
                                                </td>

                                                <td className="px-6 py-4">
                                                    {campaign.is_public
                                                        ? t('yes')
                                                        : t('no')}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex space-x-1">
                                                        <EditButton
                                                            onClick={() =>
                                                                handleEditClick(
                                                                    campaign,
                                                                )
                                                            }
                                                        />

                                                        <DeleteButton
                                                            onClick={() =>
                                                                handleDeleteClick(
                                                                    campaign,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </td>
                                            </>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>

                    {/* Prev and Next button for pagination  */}
                    <div className="my-4 flex items-center justify-around">
                        <PaginationFooter
                            counter={counter}
                            resultsPerPage={resultsPerPage}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                </>
            )}
        </section>
    );
}
