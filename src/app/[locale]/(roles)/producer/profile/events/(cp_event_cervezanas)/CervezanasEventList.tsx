'use client';

import Link from 'next/link';
import Image from 'next/image';
import UpdateCPMEventModal from './UpdateCPMEvent';
import Spinner from '@/app/[locale]/components/ui/Spinner';
import DeleteCPM_event_Modal from '@/app/[locale]/components/modals/DeleteCPM_event_Modal';
import TableWithFooterAndSearch from '@/app/[locale]/components/ui/TableWithFooterAndSearch';
import useFetchCervezanasEventsByOwnerId from '../../../../../../../hooks/useFetchCervezanasEventsByOwnerId';
import React, { useEffect, useState } from 'react';
import { ICPM_events } from '@/lib/types/types';
import { formatDateString } from '@/utils/formatDate';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from '@/app/[locale]/(auth)/Context/useAuth';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@/app/[locale]/components/ui/buttons/IconButton';

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

    const [events, setEvents] = useState<ICPM_events[]>([]);

    const editColor = { filled: '#90470b', unfilled: 'grey' };
    const deleteColor = { filled: '#90470b', unfilled: 'grey' };

    const [isEditModal, setIsEditModal] = useState(false);
    const [isDeleteModal, setIsDeleteModal] = useState(false);
    const [selectedCPMEvent, setSelectedCPMEvent] = useState<ICPM_events>();

    useEffect(() => {
        refetch().then((res: any) => {
            const events = res.data as any;
            if (events) setEvents(events);
        });
    }, [data, currentPage]);

    const handleEditClick = async (e: ICPM_events) => {
        setIsEditModal(true);
        setSelectedCPMEvent(e);
    };

    const handleDeleteClick = async (e: ICPM_events) => {
        setIsDeleteModal(true);
        setSelectedCPMEvent(e);
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
            render: (_: string, row: ICPM_events) => (
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
            render: (_: string, row: ICPM_events) => (
                <Link
                    href={`/cpm/${row.cp_id}`}
                    locale={locale}
                    className="font-semibold text-beer-blonde hover:text-beer-draft"
                >
                    {row.cp_mobile?.cp_name}
                </Link>
            ),
        },
        {
            header: t('event_name_header'),
            accessor: 'events.name',
            render: (_: string, row: ICPM_events) => row.events?.name,
        },
        {
            header: t('created_date_header'),
            accessor: 'created_at',
            render: (_: string, row: ICPM_events) =>
                formatDateString(row.events?.created_at),
        },
        {
            header: t('action_header'),
            accessor: 'action',
            render: (value: any, row: ICPM_events) => (
                <div className="flex justify-center space-x-2">
                    <IconButton
                        icon={faEdit}
                        onClick={() => handleEditClick(row)}
                        color={editColor}
                        classContainer={
                            'hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full'
                        }
                        classIcon={''}
                        title={t('edit')}
                    />
                    <IconButton
                        icon={faTrash}
                        onClick={() => handleDeleteClick(row)}
                        color={deleteColor}
                        classContainer={
                            'hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full'
                        }
                        classIcon={''}
                        title={t('delete')}
                    />
                </div>
            ),
        },
    ];

    return (
        <section className="bg-beer-foam relative mt-2 rounded-md border-2 border-beer-blonde px-2 py-4 shadow-xl">
            {isEditModal && selectedCPMEvent && (
                <UpdateCPMEventModal
                    selectedCPMEvent={selectedCPMEvent}
                    isEditModal={isEditModal}
                    handleEditModal={handleEditModal}
                />
            )}

            {isDeleteModal && selectedCPMEvent && (
                <DeleteCPM_event_Modal
                    eventId={selectedCPMEvent.event_id}
                    cpId={selectedCPMEvent.cp_id}
                    isDeleteModal={isDeleteModal}
                    handleDeleteModal={handlDeleteModal}
                />
            )}

            {isError && (
                <div className="flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        {t('errors.fetching_events')}
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
        </section>
    );
}
