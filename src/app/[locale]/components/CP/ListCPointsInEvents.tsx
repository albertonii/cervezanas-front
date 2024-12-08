'use client';

import Link from 'next/link';
import DeleteCPModal from './DeleteCPModal';
import EditCPointEventModal from './EditCPointEventModal';
import ListTableWrapper from '@/app/[locale]/components/ui/ListTableWrapper';
import useFetchCPointInEventsByOwnerId from '@/hooks/useFetchCPointInEventsByOwnerId';
import TableWithFooterAndSearch from '@/app/[locale]/components/ui/TableWithFooterAndSearch';
import React, { useEffect, useState } from 'react';
import { formatDateString } from '@/utils/formatDate';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from '../../(auth)/Context/useAuth';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { IConsumptionPointEvent } from '@/lib/types/consumptionPoints';
import { IconButton } from '@/app/[locale]/components/ui/buttons/IconButton';

interface Props {
    counterCP: number;
}

export function ListCPointsInEvents({ counterCP }: Props) {
    const t = useTranslations();
    const locale = useLocale();

    const { user } = useAuth();

    const [currentPage, setCurrentPage] = useState(1);

    const resultsPerPage = 10;

    const { data, isError, isLoading, refetch, isFetchedAfterMount } =
        useFetchCPointInEventsByOwnerId(user.id, currentPage, resultsPerPage);

    const [cPoint, setCPoint] = useState<IConsumptionPointEvent[]>(data ?? []);

    const editColor = { filled: '#90470b', unfilled: 'grey' };
    const deleteColor = { filled: '#90470b', unfilled: 'grey' };

    const [isEditModal, setIsEditModal] = useState(false);
    const [isDeleteModal, setIsDeleteModal] = useState(false);

    const [selectedCP, setSelectedCP] = useState<IConsumptionPointEvent>();

    useEffect(() => {
        console.log('REFETCH', data);
        if (isFetchedAfterMount) {
            setCPoint(data as IConsumptionPointEvent[]);
        }
    }, [isFetchedAfterMount, data]);

    useEffect(() => {
        refetch().then((res) => {
            const cp = res.data as IConsumptionPointEvent[];
            setCPoint(cp);
        });
    }, [currentPage]);

    const handleEditClick = async (cp: IConsumptionPointEvent) => {
        handleEditModal(true);
        setSelectedCP(cp);
    };

    const handleDeleteClick = async (cp: IConsumptionPointEvent) => {
        setIsDeleteModal(true);
        setSelectedCP(cp);
    };

    const handleEditModal = (isEdit: boolean) => {
        setIsEditModal(isEdit);
    };

    const handleDeleteModal = (isDelete: boolean) => {
        setIsDeleteModal(isDelete);
    };

    const columns = [
        {
            header: t('name_header'),
            accessor: 'cp_name',
            sortable: true,
            render: (value: string, row: IConsumptionPointEvent) => (
                <Link
                    target={'_blank'}
                    href={`/producer/profile/consumption_points/${row.id}`}
                    locale={locale}
                    className="font-semibold text-beer-blonde hover:text-beer-draft dark:text-beer-softBlonde dark:hover:text-beer-gold"
                >
                    {row.cp_name}
                </Link>
            ),
        },
        {
            header: t('event_name_header'),
            accessor: 'event_name',
            sortable: true,
            render: (value: string, row: IConsumptionPointEvent) => (
                <Link
                    target={'_blank'}
                    href={`/events/${row.event_id}`}
                    locale={locale}
                    className="font-semibold text-beer-blonde hover:text-beer-draft dark:text-beer-softBlonde dark:hover:text-beer-gold"
                >
                    {row.events?.name}
                </Link>
            ),
        },
        {
            header: t('created_date_header'),
            accessor: 'created_at',
            sortable: true,
            render: (value: string) => formatDateString(value),
        },
        {
            header: t('action_header'),
            accessor: 'action',
            render: (value: any, row: IConsumptionPointEvent) => (
                <div className="flex items-center justify-center space-x-2">
                    <IconButton
                        icon={faEdit}
                        onClick={() => handleEditClick(row)}
                        color={editColor}
                        classContainer={
                            'hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full'
                        }
                        title={t('edit')}
                    />
                    <IconButton
                        icon={faTrash}
                        onClick={() => handleDeleteClick(row)}
                        color={deleteColor}
                        classContainer={
                            'hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full '
                        }
                        title={t('delete')}
                    />
                </div>
            ),
        },
    ];
    if (!user) return null;

    return (
        <ListTableWrapper
            isError={isError}
            isLoading={isLoading}
            errorMessage={'errors.fetching_cp'}
        >
            {/* Don't remove isEditModal or the selectedCP will not be updated when changed from selected CP  */}
            {isEditModal && selectedCP && (
                <>
                    <EditCPointEventModal
                        selectedCP={selectedCP}
                        isEditModal={isEditModal}
                        handleEditModal={handleEditModal}
                    />
                </>
            )}

            {isDeleteModal && selectedCP && (
                <DeleteCPModal
                    selectedCPId={selectedCP.id}
                    isDeleteModal={isDeleteModal}
                    handleDeleteModal={handleDeleteModal}
                />
            )}

            {!isError && !isLoading && cPoint.length === 0 ? (
                <div className="flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        {t('no_cp')}
                    </p>
                </div>
            ) : (
                <TableWithFooterAndSearch
                    columns={columns}
                    data={cPoint}
                    initialQuery={''}
                    resultsPerPage={resultsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    searchPlaceHolder={'search_by_name'}
                    paginationCounter={counterCP}
                    sourceDataIsFromServer={false}
                />
            )}
        </ListTableWrapper>
    );
}
