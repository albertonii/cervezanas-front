'use client';

import Link from 'next/link';
import EditCPMobileModal from './EditCPMobileModal';
import TR from '@/app/[locale]/components/ui/table/TR';
import TH from '@/app/[locale]/components/ui/table/TH';
import TD from '@/app/[locale]/components/ui/table/TD';
import DeleteCPMobileModal from './DeleteCPMobileModal';
import THead from '@/app/[locale]/components/ui/table/THead';
import Table from '@/app/[locale]/components/ui/table/Table';
import TBody from '@/app/[locale]/components/ui/table/TBody';
import InputSearch from '@/app/[locale]/components/form/InputSearch';
import TDActions from '@/app/[locale]/components/ui/table/TDActions';
import PaginationFooter from '@/app/[locale]/components/ui/PaginationFooter';
import React, { useMemo, useState } from 'react';
import { formatDateString } from '@/utils/formatDate';
import { useLocale, useTranslations } from 'next-intl';
import { ICPMobile } from '@/lib/types/consumptionPoints';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@/app/[locale]/components/ui/buttons/IconButton';

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
    cpsMobile: ICPMobile[];
}

export function ListCPMobile({ cpsMobile }: Props) {
    const t = useTranslations();
    const locale = useLocale();

    console.log('CPS MOBILE', cpsMobile);

    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const counter = 1;
    const resultsPerPage = 10;

    const [cpMobile, setCPMobile] = useState<ICPMobile[]>(cpsMobile);

    const editColor = { filled: '#90470b', unfilled: 'grey' };
    const deleteColor = { filled: '#90470b', unfilled: 'grey' };

    const [isEditModal, setIsEditModal] = useState(false);
    const [isDeleteModal, setIsDeleteModal] = useState(false);

    const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
    const [selectedCP, setSelectedCP] = useState<ICPMobile>();

    const filteredItems = useMemo<ICPMobile[]>(() => {
        if (!cpMobile) return [];
        return cpsMobile.filter((mobile) => {
            return mobile.cp_name.toLowerCase().includes(query.toLowerCase());
        });
    }, [cpMobile, query]);

    const sortedItems = useMemo(() => {
        if (sorting === SortBy.NONE) return filteredItems;

        const compareProperties: Record<string, (cp: ICPMobile) => any> = {
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

    const handleEditClick = async (cp: ICPMobile) => {
        setSelectedCP(cp);
        handleEditModal(true);
    };

    const handleDeleteClick = async (cp: ICPMobile) => {
        setIsDeleteModal(true);
        setSelectedCP(cp);
    };

    const handleEditModal = (isEdit: boolean) => {
        setIsEditModal(isEdit);
    };

    const handleDeleteModal = (isEdit: boolean) => {
        setIsEditModal(isEdit);
    };

    return (
        <section className="bg-beer-foam relative mt-6 space-y-4 overflow-x-auto shadow-md sm:rounded-lg">
            {/* Don't remove isEditModal or the selectedCP will not be updated when changed from selected CP  */}
            {isEditModal && selectedCP && (
                <>
                    <EditCPMobileModal
                        selectedCP={selectedCP}
                        isEditModal={isEditModal}
                        handleEditModal={handleEditModal}
                    />
                </>
            )}

            {isDeleteModal && selectedCP && (
                <DeleteCPMobileModal
                    selectedCPId={selectedCP.id}
                    isDeleteModal={isDeleteModal}
                    handleDeleteModal={handleDeleteModal}
                />
            )}

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
                                class_=" hover:cursor-pointer"
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
                        {sortedItems.map((cp: ICPMobile) => {
                            return (
                                <TR key={cp.id}>
                                    <TD class_="font-semibold text-beer-blonde hover:cursor-pointer hover:text-beer-draft">
                                        <Link
                                            target={'_blank'}
                                            href={`/consumption_points/mobile/${cp.id}`}
                                            locale={locale}
                                        >
                                            {cp.cp_name}
                                        </Link>
                                    </TD>

                                    <TD>{formatDateString(cp.created_at)}</TD>

                                    <TDActions>
                                        <IconButton
                                            icon={faEdit}
                                            onClick={() => {
                                                handleEditClick(cp);
                                            }}
                                            color={editColor}
                                            classContainer={
                                                'hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full'
                                            }
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
                                            title={t('delete')}
                                        />
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
            </>
        </section>
    );
}
