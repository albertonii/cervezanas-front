'use client';

import Image from 'next/image';
import Link from 'next/link';
import DeleteCPM_event_Modal from '../../../../../components/modals/DeleteCPM_event_Modal';
import UpdateCPMEventModal from './UpdateCPMEvent';
import useFetchCervezanasEventsByOwnerId from '../../../../../../../hooks/useFetchCervezanasEventsByOwnerId';
import PaginationFooter from '../../../../../components/common/PaginationFooter';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ICPM_events } from '../../../../../../../lib/types/types';
import Spinner from '../../../../../components/common/Spinner';
import InputSearch from '../../../../../components/common/InputSearch';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { formatDateString } from '../../../../../../../utils/formatDate';
import { IconButton } from '../../../../../components/common/IconButton';
import { ROUTE_CP_MOBILE, ROUTE_EVENTS } from '../../../../../../../config';

enum SortBy {
    NONE = 'none',
    USERNAME = 'username',
    NAME = 'name',
    LAST = 'last',
    COUNTRY = 'country',
    CREATED_DATE = 'created_date',
    START_DATE = 'start_date',
    END_DATE = 'end_date',
}
interface ColumnsProps {
    header: string;
}

interface Props {
    counter: number;
}

export default function CervezanasEventList({ counter }: Props) {
    const t = useTranslations();
    const locale = useLocale();
    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const resultsPerPage = 100;

    const { data, isError, isLoading, refetch } =
        useFetchCervezanasEventsByOwnerId(currentPage, resultsPerPage);

    const [events, setEvents] = useState<ICPM_events[]>(data ?? []);

    const editColor = { filled: '#90470b', unfilled: 'grey' };
    const deleteColor = { filled: '#90470b', unfilled: 'grey' };

    const [isEditModal, setIsEditModal] = useState(false);
    const [isDeleteModal, setIsDeleteModal] = useState(false);

    const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
    const [selectedCPMEvent, setSelectedCPMEvent] = useState<ICPM_events>();

    const COLUMNS = [
        { header: t('event_type_header') },
        { header: t('cp_name_header') },
        { header: t('event_name_header') },
        { header: t('created_date_header') },
        { header: t('action_header') },
    ];

    useEffect(() => {
        refetch().then((res: any) => {
            const events = res.data as any;
            setEvents(events);
        });
    }, [data, currentPage]);

    const filteredItems = useMemo<ICPM_events[]>(() => {
        if (!data) return [];
        return data.filter((cpm_event) => {
            return cpm_event.events?.name
                .toLowerCase()
                .includes(query.toLowerCase());
        });
    }, [events, query]);

    // const sortedItems = useMemo(() => {
    //     if (sorting === SortBy.NONE) return filteredItems;

    //     const compareProperties: Record<string, (event: ICPM_events) => any> = {
    //         [SortBy.NAME]: (e) => e.events?.name,
    //         [SortBy.CREATED_DATE]: (e) => e.events?.created_at,
    //         [SortBy.START_DATE]: (e) => e.events?.start_date,
    //     };

    //     return filteredItems.toSorted((a, b) => {
    //         if (!a.events || !b.events) return 0;
    //         const extractProperty = compareProperties[sorting];

    //         return extractProperty(a.events.name).localeCompare(
    //             extractProperty(b.events.name),
    //         );
    //     });
    // }, [filteredItems, sorting]);

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

    return (
        <section className="relative mt-2 rounded-md border-2 border-beer-blonde px-2 py-4 shadow-xl">
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
                        {t('error_fetching_events')}
                    </p>
                </div>
            )}

            {isLoading && (
                <Spinner color="beer-blonde" size="xLarge" absolute center />
            )}

            {!isError && !isLoading && events.length === 0 ? (
                <div className="flex h-40 items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        {t('no_events')}
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    <InputSearch
                        query={query}
                        setQuery={setQuery}
                        searchPlaceholder={'search_by_name'}
                    />

                    <div className="overflow-x-scroll border-2 ">
                        <table className="w-full text-center text-sm text-gray-500 dark:text-gray-400 border-2 ">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    {COLUMNS.map(
                                        (
                                            column: ColumnsProps,
                                            index: number,
                                        ) => {
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
                                {filteredItems.map((e: ICPM_events) => {
                                    {
                                        /* {sortedItems.map((e: IEvent) => { */
                                    }
                                    return (
                                        <tr key={e.event_id} className="">
                                            <th
                                                scope="row"
                                                className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                                            >
                                                <Image
                                                    width={128}
                                                    height={128}
                                                    className="h-8 w-8 rounded-full"
                                                    src="/icons/people-line-solid.svg"
                                                    alt=""
                                                />
                                            </th>

                                            <td className="px-6 py-4 font-semibold text-beer-blonde hover:text-beer-draft">
                                                <Link
                                                    href={`${ROUTE_EVENTS}/${e.event_id}${ROUTE_CP_MOBILE}/${e.cp_id}`}
                                                    locale={locale}
                                                >
                                                    {e.cp_mobile?.cp_name}
                                                </Link>
                                            </td>

                                            <td className="px-6 py-4 font-semibold text-beer-blonde hover:text-beer-draft">
                                                <Link
                                                    href={`${ROUTE_EVENTS}/${e.event_id}`}
                                                    locale={locale}
                                                >
                                                    {e.events?.name}
                                                </Link>
                                            </td>

                                            <td className="px-6 py-4">
                                                {formatDateString(
                                                    e.events?.created_at ?? '',
                                                )}
                                            </td>

                                            <td className="flex items-center justify-center px-6 py-4">
                                                <IconButton
                                                    icon={faEdit}
                                                    onClick={() => {
                                                        handleEditClick(e);
                                                    }}
                                                    color={editColor}
                                                    classContainer={
                                                        'hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full'
                                                    }
                                                    classIcon={''}
                                                    title={t('edit')}
                                                />

                                                <IconButton
                                                    icon={faTrash}
                                                    onClick={() => {
                                                        handleDeleteClick(e);
                                                    }}
                                                    color={deleteColor}
                                                    classContainer={
                                                        'hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full '
                                                    }
                                                    classIcon={''}
                                                    title={t('delete')}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Prev and Next button for pagination  */}
                    <div className="my-4 flex items-center justify-around">
                        <PaginationFooter
                            counter={counter}
                            resultsPerPage={resultsPerPage}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
