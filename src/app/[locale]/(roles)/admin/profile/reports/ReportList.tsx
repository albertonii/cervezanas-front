'use client';

import Link from 'next/link';
import { IUserReport } from '@/lib//types/types';
import { useLocale, useTranslations } from 'next-intl';
import React, { useEffect, useMemo, useState } from 'react';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import InputSearch from '@/app/[locale]/components/common/InputSearch';
import { IconButton } from '@/app/[locale]/components/common/IconButton';
import { formatDateString } from '@/utils/formatDate';
import PaginationFooter from '@/app/[locale]/components/common/PaginationFooter';
import { ROUTE_ADMIN, ROUTE_PROFILE, ROUTE_REPORTS } from '@/config';

enum SortBy {
    NONE = 'none',
    CREATED_DATE = 'created_date',
    TITLE = 'title',
}

interface Props {
    reports: IUserReport[];
}

export default function EventList({ reports: rs }: Props) {
    const t = useTranslations();
    const locale = useLocale();

    const counter = rs.length;
    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const resultsPerPage = 10;

    const [reports, setReports] = useState<IUserReport[]>(rs ?? []);

    const viewColor = { filled: '#90470b', unfilled: 'grey' };

    const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);

    useEffect(() => {
        // Si se cambia de página, debemos de actualizar los datos que se muestran en el listado
        setReports(rs);
    }, [currentPage]);

    const filteredItems = useMemo<IUserReport[]>(() => {
        if (!reports) return [];
        return reports.filter((report: IUserReport) => {
            return report.title.toLowerCase().includes(query.toLowerCase());
        });
    }, [reports, query]);

    const sortedItems = useMemo(() => {
        if (sorting === SortBy.NONE) return filteredItems;

        const compareProperties: Record<string, (event: IUserReport) => any> = {
            [SortBy.TITLE]: (e) => e.title,
            [SortBy.CREATED_DATE]: (e) => e.created_at,
        };

        return filteredItems.toSorted((a, b) => {
            const extractProperty = compareProperties[sorting];
            return extractProperty(a).localeCompare(extractProperty(b));
        });
    }, [filteredItems, sorting]);

    const handleChangeSort = (sort: SortBy) => {
        setSorting(sort);
    };

    return (
        <section className="relative overflow-x-auto px-6 py-4 shadow-md sm:rounded-lg ">
            <InputSearch
                query={query}
                setQuery={setQuery}
                searchPlaceholder={'search_by_name'}
            />

            <table className="w-full text-center text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th
                            scope="col"
                            className="px-6 py-3 hover:cursor-pointer"
                            onClick={() => {
                                handleChangeSort(SortBy.TITLE);
                            }}
                        >
                            {t('title_header')}
                        </th>

                        <th
                            scope="col"
                            className="px-6 py-3 hover:cursor-pointer"
                            onClick={() => {
                                handleChangeSort(SortBy.CREATED_DATE);
                            }}
                        >
                            {t('created_date_header')}
                        </th>

                        <th scope="col" className="hover px-6 py-3">
                            {t('description_header')}
                        </th>

                        <th scope="col" className="hover px-6 py-3">
                            {t('status_header')}
                        </th>

                        <th scope="col" className="px-6 py-3 ">
                            {t('action_header')}
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {sortedItems.map((userReport: IUserReport) => {
                        return (
                            <tr key={userReport.id} className="">
                                <td className="px-6 py-4 font-semibold text-beer-blonde hover:text-beer-draft">
                                    <Link
                                        href={`${ROUTE_ADMIN}${ROUTE_PROFILE}${ROUTE_REPORTS}/${userReport.id}`}
                                        locale={locale}
                                    >
                                        {userReport.title}
                                    </Link>
                                </td>

                                <td className="px-6 py-4">
                                    {formatDateString(userReport.created_at)}
                                </td>

                                <td className="cursor-pointer truncate px-6 py-4">
                                    {userReport.description}
                                </td>

                                <td
                                    className={`${
                                        userReport.is_resolved &&
                                        'font-semibold text-beer-gold'
                                    } cursor-pointer truncate px-6 py-4`}
                                >
                                    {userReport.is_resolved
                                        ? t('resolved')
                                        : t('pending')}
                                </td>

                                <td className="flex items-center justify-center px-6 py-4">
                                    <Link
                                        href={`${ROUTE_ADMIN}${ROUTE_PROFILE}${ROUTE_REPORTS}/${userReport.id}`}
                                        locale={locale}
                                    >
                                        <IconButton
                                            icon={faEye}
                                            color={viewColor}
                                            classContainer={
                                                'hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full'
                                            }
                                            classIcon={''}
                                            title={t('view_report')}
                                        />
                                    </Link>
                                </td>
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
        </section>
    );
}
