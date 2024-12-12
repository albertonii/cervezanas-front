'use client';

import Link from 'next/link';
import Image from 'next/image';
import ListTableWrapper from '@/app/[locale]/components/ui/ListTableWrapper';
import DeleteEventModal from '@/app/[locale]/components/modals/DeleteEventModal';
import UpdateEventModal from '@/app/[locale]/components/modals/event/UpdateEventModal';
import useFetchEventsByOwnerId from '../../../../../../../hooks/useFetchEventsByOwnerId';
import TableWithFooterAndSearch from '@/app/[locale]/components/ui/TableWithFooterAndSearch';
import React, { useEffect, useState } from 'react';
import { ROUTE_EVENTS } from '@/config';
import { IEvent } from '@/lib/types/eventOrders';
import { formatDateString } from '@/utils/formatDate';
import { useLocale, useTranslations } from 'next-intl';
import { IConsumptionPoint } from '@/lib/types/consumptionPoints';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@/app/[locale]/components/ui/buttons/IconButton';

interface Props {
    counter: number;
    cps: IConsumptionPoint[];
}

export default function EventList({ counter, cps }: Props) {
    const t = useTranslations();
    const locale = useLocale();

    const [currentPage, setCurrentPage] = useState(1);
    const [events, setEvents] = useState<IEvent[]>([]);
    const [isEditModal, setIsEditModal] = useState(false);
    const [isDeleteModal, setIsDeleteModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<IEvent>();

    const resultsPerPage = 10;

    const { data, isError, isLoading, refetch } = useFetchEventsByOwnerId(
        currentPage,
        resultsPerPage,
    );

    const editColor = { filled: '#90470b', unfilled: 'grey' };
    const deleteColor = { filled: '#90470b', unfilled: 'grey' };

    const columns = [
        {
            header: t('event_type_header'),
            accessor: 'type',
            render: () => (
                <Image
                    width={128}
                    height={128}
                    className="h-8 w-8 rounded-full"
                    src="/icons/people-line-solid.svg"
                    alt="Event Type"
                />
            ),
        },
        {
            header: t('name_header'),
            accessor: 'name',
            sortable: true,
            render: (value: string, row: IEvent) => (
                <Link href={`${ROUTE_EVENTS}/${row.id}`} locale={locale}>
                    <span className="font-semibold text-beer-blonde hover:text-beer-draft dark:text-beer-softBlonde dark:hover:text-beer-gold">
                        {value}
                    </span>
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
            accessor: 'actions',
            render: (_: any, row: IEvent) => (
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

    useEffect(() => {
        if (data) {
            refetch().then((res: any) => {
                const events = res.data as IEvent[];
                setEvents(events);
            });
        }
    }, [data, currentPage]);

    const handleEditClick = async (e: IEvent) => {
        setIsEditModal(true);
        setSelectedEvent(e);
    };

    const handleDeleteClick = async (e: IEvent) => {
        setIsDeleteModal(true);
        setSelectedEvent(e);
    };

    const handleEditModal = (isEdit: boolean) => {
        setIsEditModal(isEdit);
    };

    const handlDeleteModal = (isDelete: boolean) => {
        setIsDeleteModal(isDelete);
    };

    return (
        <ListTableWrapper
            isError={isError}
            isLoading={isLoading}
            errorMessage={'errors.fetching_events'}
        >
            {isEditModal && selectedEvent && (
                <UpdateEventModal
                    selectedEvent={selectedEvent}
                    isEditModal={isEditModal}
                    handleEditModal={handleEditModal}
                    cps={cps}
                />
            )}

            {isDeleteModal && selectedEvent && (
                <DeleteEventModal
                    selectedEventId={selectedEvent.id}
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
