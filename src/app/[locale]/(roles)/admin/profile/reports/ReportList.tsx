'use client';

import Link from 'next/link';
import { IUserReport } from '@/lib//types/types';
import { useLocale, useTranslations } from 'next-intl';
import React, { useEffect, useMemo, useState } from 'react';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import InputSearch from '@/app/[locale]/components/form/InputSearch';
import { formatDateString } from '@/utils/formatDate';
import { ROUTE_ADMIN, ROUTE_PROFILE, ROUTE_REPORTS } from '@/config';
import { IconButton } from '@/app/[locale]/components/ui/buttons/IconButton';
import PaginationFooter from '@/app/[locale]/components/ui/PaginationFooter';
import THead from '@/app/[locale]/components/ui/table/THead';
import TR from '@/app/[locale]/components/ui/table/TR';
import TH from '@/app/[locale]/components/ui/table/TH';
import TBody from '@/app/[locale]/components/ui/table/TBody';
import TD from '@/app/[locale]/components/ui/table/TD';
import TDActions from '@/app/[locale]/components/ui/table/TDActions';
import Table from '@/app/[locale]/components/ui/table/Table';

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

            <Table>
                <THead>
                    <TR>
                        <TH
                            scope="col"
                            class_="hover:cursor-pointer"
                            onClick={() => {
                                handleChangeSort(SortBy.TITLE);
                            }}
                        >
                            {t('title_header')}
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

                        <TH scope="col">{t('description_header')}</TH>

                        <TH scope="col">{t('status_header')}</TH>

                        <TH scope="col">{t('action_header')}</TH>
                    </TR>
                </THead>

                <TBody>
                    {sortedItems.map((userReport: IUserReport) => {
                        return (
                            <TR key={userReport.id}>
                                <TD class_="text-beer-blonde hover:text-beer-draft dark:text-beer-softBlonde">
                                    <Link
                                        href={`${ROUTE_ADMIN}${ROUTE_PROFILE}${ROUTE_REPORTS}/${userReport.id}`}
                                        locale={locale}
                                    >
                                        {userReport.title}
                                    </Link>
                                </TD>

                                <TD>
                                    {formatDateString(userReport.created_at)}
                                </TD>

                                <TD class_="truncate">
                                    {userReport.description}
                                </TD>

                                <TD
                                    class_={`${
                                        userReport.is_resolved &&
                                        'font-semibold text-beer-gold'
                                    } cursor-pointer truncate px-6 py-4`}
                                >
                                    {userReport.is_resolved
                                        ? t('resolved')
                                        : t('pending')}
                                </TD>

                                <TDActions>
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
                                            title={t('view_report')}
                                        />
                                    </Link>
                                </TDActions>
                            </TR>
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
        </section>
    );
}
