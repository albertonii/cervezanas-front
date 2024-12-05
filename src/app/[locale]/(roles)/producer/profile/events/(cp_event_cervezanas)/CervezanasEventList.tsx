'use client';

import Link from 'next/link';
import Image from 'next/image';
import ListTableWrapper from '@/app/[locale]/components/ui/ListTableWrapper';
import DeleteCPEventModal from '@/app/[locale]/components/modals/DeleteCPEventModal';
import TableWithFooterAndSearch from '@/app/[locale]/components/ui/TableWithFooterAndSearch';
import useFetchCervezanasEventsByOwnerId from '../../../../../../../hooks/useFetchCervezanasEventsByOwnerId';
import React, { useEffect, useState } from 'react';
import { formatDateString } from '@/utils/formatDate';
import { useLocale, useTranslations } from 'next-intl';
import { IConsumptionPointEvent } from '@/lib/types/consumptionPoints';
import { useAuth } from '@/app/[locale]/(auth)/Context/useAuth';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@/app/[locale]/components/ui/buttons/IconButton';
import UpdateCPEventModal from './UpdateCPMEvent';

interface Props {
    counter: number;
}

export default function CervezanasEventList({ counter }: Props) {
    const t = useTranslations();
    const locale = useLocale();
    const [currentPage, setCurrentPage] = useState(1);

    const { user } = useAuth();

    const resultsPerPage = 10;

    const { data, error, isError, isLoading, refetch } =
        useFetchCervezanasEventsByOwnerId(user.id, currentPage, resultsPerPage);

    const [events, setEvents] = useState<IConsumptionPointEvent[]>([]);

    const editColor = { filled: '#90470b', unfilled: 'grey' };
    const deleteColor = { filled: '#90470b', unfilled: 'grey' };

    const [isEditModal, setIsEditModal] = useState(false);
    const [isDeleteModal, setIsDeleteModal] = useState(false);
    const [selectedCPEvent, setSelectedCPEvent] =
        useState<IConsumptionPointEvent>();

    useEffect(() => {
        refetch().then((res: any) => {
            const events = res.data as any;
            if (events) setEvents(events);
        });
    }, [data, currentPage]);

    const handleEditClick = async (e: IConsumptionPointEvent) => {
        setIsEditModal(true);
        setSelectedCPEvent(e);
    };

    const handleDeleteClick = async (e: IConsumptionPointEvent) => {
        setIsDeleteModal(true);
        setSelectedCPEvent(e);
    };

    const handleEditModal = (isEdit: boolean) => {
        setIsEditModal(isEdit);
    };

    const handlDeleteModal = (isDelete: boolean) => {
        setIsDeleteModal(isDelete);
    };

    const columns = [
        {
            header: t('event_type_header'),
            accessor: 'event_type',
            render: (_: string, row: IConsumptionPointEvent) => (
                <Image
                    width={32}
                    height={32}
                    className="rounded-full"
                    src="/icons/beer-240.png"
                    alt="Beer Type"
                />
            ),
        },
        {
            header: t('cp_name_header'),
            accessor: 'cp_name',
            render: (_: string, row: IConsumptionPointEvent) => (
                <Link
                    href={`/cp/${row.cp_id}`}
                    locale={locale}
                    className="font-semibold text-beer-blonde hover:text-beer-draft dark:text-beer-softBlonde"
                >
                    {row.cp?.cp_name}
                </Link>
            ),
        },
        {
            header: t('event_name_header'),
            accessor: 'events.name',
            render: (_: string, row: IConsumptionPointEvent) =>
                row.events?.name,
        },
        {
            header: t('created_date_header'),
            accessor: 'created_at',
            render: (_: string, row: IConsumptionPointEvent) =>
                formatDateString(row.events?.created_at),
        },
        {
            header: t('action_header'),
            accessor: 'action',
            render: (value: any, row: IConsumptionPointEvent) => (
                <div className="flex justify-center space-x-2">
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
                            'hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full'
                        }
                        title={t('delete')}
                    />
                </div>
            ),
        },
    ];

    return (
        <ListTableWrapper
            isError={isError}
            isLoading={isLoading}
            errorMessage={'errors.fetching_events'}
        >
            {isEditModal && selectedCPEvent && (
                <UpdateCPEventModal
                    selectedCPEvent={selectedCPEvent}
                    isEditModal={isEditModal}
                    handleEditModal={handleEditModal}
                />
            )}

            {isDeleteModal && selectedCPEvent && (
                <DeleteCPEventModal
                    eventId={selectedCPEvent.event_id}
                    cpId={selectedCPEvent.cp_id}
                    isDeleteModal={isDeleteModal}
                    handleDeleteModal={handlDeleteModal}
                />
            )}

            {!isError && !isLoading && events.length === 0 ? (
                <div className="flex h-40 items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        {t('no_events')}
                    </p>
                </div>
            ) : (
                <TableWithFooterAndSearch
                    columns={columns}
                    data={events}
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
