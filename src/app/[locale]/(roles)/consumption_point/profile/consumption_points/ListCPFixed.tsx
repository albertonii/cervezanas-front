'use client';

import Link from 'next/link';
import useFetchCPFixed from '../../../../../../hooks/useFetchCPFixed';
import EditCPFixedModal from './EditCPFixedModal';
import DeleteCPFixedModal from './DeleteCPFixedModal';
import React, { useEffect, useMemo, useState } from 'react';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useLocale, useTranslations } from 'next-intl';
import { ICPFixed } from '@/lib//types/types';
import { formatDateString } from '@/utils/formatDate';
import InputSearch from '@/app/[locale]/components/form/InputSearch';
import { IconButton } from '@/app/[locale]/components/ui/buttons/IconButton';
import PaginationFooter from '@/app/[locale]/components/ui/PaginationFooter';
import Spinner from '@/app/[locale]/components/ui/Spinner';

interface Props {
    cpsId: string;
}

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

export function ListCPFixed({ cpsId }: Props) {
    const t = useTranslations();
    const locale = useLocale();

    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const counter = 10;
    const resultsPerPage = 10;

    const { data, isError, isLoading, refetch } = useFetchCPFixed(
        cpsId,
        currentPage,
        resultsPerPage,
    );

    const [cpFixed, setCPFixed] = useState<ICPFixed[]>(data ?? []);

    const editColor = { filled: '#90470b', unfilled: 'grey' };
    const deleteColor = { filled: '#90470b', unfilled: 'grey' };

    const [isEditModal, setIsEditModal] = useState(false);
    const [isDeleteModal, setIsDeleteModal] = useState(false);

    const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
    const [selectedCP, setSelectedCP] = useState<ICPFixed>();

    useEffect(() => {
        refetch().then((res) => {
            const cpFixed = res.data as ICPFixed[];
            setCPFixed(cpFixed);
        });
    }, [currentPage]);

    const filteredItems = useMemo<ICPFixed[]>(() => {
        if (!data) return [];
        return data.filter((fixed) => {
            return fixed.cp_name.toLowerCase().includes(query.toLowerCase());
        });
    }, [data, cpFixed, query]);

    const sortedItems = useMemo(() => {
        if (sorting === SortBy.NONE) return filteredItems;

        const compareProperties: Record<string, (cp: ICPFixed) => any> = {
            [SortBy.NAME]: (cp) => cp.cp_name,
            [SortBy.CREATED_DATE]: (cp) => cp.created_at,
        };

        return filteredItems.toSorted((a, b) => {
            const extractProperty = compareProperties[sorting];
            return extractProperty(a).localeCompare(extractProperty(b));
        });
    }, [filteredItems, sorting]);

    const handleChangeSort = (sort: SortBy) => {
        setSorting(sort);
    };

    const handleEditClick = async (cp: ICPFixed) => {
        setSelectedCP(cp);
        setIsEditModal(true);
    };

    const handleDeleteClick = async (cp: ICPFixed) => {
        setIsDeleteModal(true);
        setSelectedCP(cp);
    };

    const handleEditModal = (isEdit: boolean) => {
        setIsEditModal(isEdit);
    };

    const handleDeleteModal = (isDelete: boolean) => {
        setIsDeleteModal(isDelete);
    };

    return (
        <section className="bg-beer-foam relative mt-2 rounded-md border-2 border-beer-blonde px-2 py-4 shadow-xl">
            {/* Don't remove isEditModal or the selectedCP will not be updated when changed from selected CP  */}
            {isEditModal && selectedCP && (
                <EditCPFixedModal
                    selectedCP={selectedCP}
                    isEditModal={isEditModal}
                    handleEditModal={handleEditModal}
                />
            )}

            {isDeleteModal && selectedCP && (
                <DeleteCPFixedModal
                    selectedCPId={selectedCP.id}
                    isDeleteModal={isDeleteModal}
                    handleDeleteModal={handleDeleteModal}
                />
            )}

            {isError && (
                <div className="flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        {t('errors.fetching_cp_fixed')}
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

            {!isError && !isLoading && cpFixed.length === 0 ? (
                <div className="flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        {t('no_cp_fixed')}
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
                                <tr className="w-full">
                                    <th
                                        scope="col"
                                        className="px-6 py-3 hover:cursor-pointer"
                                        onClick={() => {
                                            handleChangeSort(SortBy.NAME);
                                        }}
                                    >
                                        {t('name_header')}
                                    </th>

                                    <th
                                        scope="col"
                                        className="px-6 py-3 hover:cursor-pointer"
                                        onClick={() => {
                                            handleChangeSort(
                                                SortBy.CREATED_DATE,
                                            );
                                        }}
                                    >
                                        {t('created_date_header')}
                                    </th>

                                    <th scope="col" className="px-6 py-3 ">
                                        {t('action_header')}
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="w-full">
                                {sortedItems.map((cp: ICPFixed) => {
                                    return (
                                        <tr
                                            key={cp.id}
                                            className="w-full border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                                        >
                                            <td className="px-6 py-4 font-semibold text-beer-blonde hover:cursor-pointer hover:text-beer-draft">
                                                <Link
                                                    target={'_blank'}
                                                    href={`/consumption_points/fixed?id=${cp.id}`}
                                                    locale={locale}
                                                >
                                                    {cp.cp_name}
                                                </Link>
                                            </td>

                                            <td className="px-6 py-4">
                                                {formatDateString(
                                                    cp.created_at,
                                                )}
                                            </td>

                                            <td className="flex items-center justify-center px-6 py-4">
                                                <IconButton
                                                    icon={faEdit}
                                                    onClick={() => {
                                                        handleEditClick(cp);
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
                                                        handleDeleteClick(cp);
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
                    <footer className="my-4 flex items-center justify-around">
                        <PaginationFooter
                            counter={counter}
                            resultsPerPage={resultsPerPage}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </footer>
                </div>
            )}
        </section>
    );
}
