'use client';

import EventItems from './EventItems';
import TR from '@/app/[locale]/components/ui/table/TR';
import TH from '@/app/[locale]/components/ui/table/TH';
import Spinner from '@/app/[locale]/components/ui/Spinner';
import THead from '@/app/[locale]/components/ui/table/THead';
import Table from '@/app/[locale]/components/ui/table/Table';
import TBody from '@/app/[locale]/components/ui/table/TBody';
import useFetchEvents from '../../../../../../hooks/useFetchEvents';
import InputSearch from '@/app/[locale]/components/form/InputSearch';
import PaginationFooter from '@/app/[locale]/components/ui/PaginationFooter';
import DeleteCEventModal from '@/app/[locale]/components/modals/DeleteEventModal';
import UpdateEventModal from '@/app/[locale]/components/modals/event/UpdateEventModal';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IEvent } from '@/lib/types/eventOrders';
import { IConsumptionPoint } from '@/lib/types/consumptionPoints';

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

interface Props {
    counter: number;
    cps: IConsumptionPoint[];
}

export default function EventList({ counter, cps }: Props) {
    const t = useTranslations();

    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const resultsPerPage = 10;

    const { data, isError, isLoading, refetch } = useFetchEvents(
        currentPage,
        resultsPerPage,
    );

    const [events, setEvents] = useState<IEvent[]>(data ?? []);

    const [isEditModal, setIsEditModal] = useState(false);
    const [isDeleteModal, setIsDeleteModal] = useState(false);

    const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
    const [selectedEvent, setSelectedEvent] = useState<IEvent>();

    useEffect(() => {
        refetch().then((res: any) => {
            const events = res.data as any;
            setEvents(events);
        });
    }, [currentPage]);

    const filteredItems = useMemo<IEvent[]>(() => {
        if (!data) return [];
        return data.filter((event: IEvent) => {
            return event.name.toLowerCase().includes(query.toLowerCase());
        });
    }, [data, events, query]);

    const sortedItems = useMemo(() => {
        if (sorting === SortBy.NONE) return filteredItems;

        const compareProperties: Record<string, (event: IEvent) => any> = {
            [SortBy.NAME]: (e) => e.name,
            [SortBy.CREATED_DATE]: (e) => e.created_at,
            [SortBy.START_DATE]: (e) => e.start_date,
        };

        return filteredItems.toSorted((a, b) => {
            const extractProperty = compareProperties[sorting];
            return extractProperty(a).localeCompare(extractProperty(b));
        });
    }, [filteredItems, sorting]);

    const handleChangeSort = (sort: SortBy) => {
        setSorting(sort);
    };

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
        <div className="relative overflow-x-auto px-6 py-4 shadow-md sm:rounded-lg ">
            {isEditModal && selectedEvent && (
                <UpdateEventModal
                    selectedEvent={selectedEvent}
                    isEditModal={isEditModal}
                    handleEditModal={handleEditModal}
                    cps={cps}
                />
            )}

            {isDeleteModal && selectedEvent && (
                <DeleteCEventModal
                    selectedEventId={selectedEvent.id}
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
                <Spinner
                    color="beer-blonde"
                    size="xLarge"
                    absolute
                    absolutePosition="center"
                />
            )}

            {!isError && !isLoading && events?.length === 0 ? (
                <div className="flex h-40 items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        {t('no_events')}
                    </p>
                </div>
            ) : (
                <>
                    <InputSearch
                        query={query}
                        setQuery={setQuery}
                        searchPlaceholder={'search_by_name'}
                    />

                    <Table>
                        <THead>
                            <TR>
                                <TH
                                    scope="col"
                                    class_=" hover:cursor-pointer"
                                    onClick={() => {
                                        handleChangeSort(SortBy.NAME);
                                    }}
                                >
                                    {t('name_header')}
                                </TH>

                                <TH
                                    scope="col"
                                    class_="hover:cursor-pointer"
                                    onClick={() => {
                                        handleChangeSort(SortBy.CREATED_DATE);
                                    }}
                                >
                                    {t('created_date_header')}
                                </TH>

                                <TH scope="col">{t('action_header')}</TH>
                            </TR>
                        </THead>

                        <TBody>
                            {sortedItems.map((event: IEvent) => {
                                return (
                                    <tr key={event.id} className="">
                                        <EventItems
                                            event={event}
                                            handleEditClick={handleEditClick}
                                            handleDeleteClick={
                                                handleDeleteClick
                                            }
                                        />
                                    </tr>
                                );
                            })}
                        </TBody>
                    </Table>

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
        </div>
    );
}
