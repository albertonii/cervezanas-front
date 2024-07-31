'use client';

import Link from 'next/link';
import DeleteCPMobileModal from './DeleteCPMobileModal';
import EditCPMobileModal from './EditCPMobileModal';
import Spinner from '@/app/[locale]/components/common/Spinner';
import useFetchCPMobile from '../../../../../../hooks/useFetchCPMobile';
import TableWithFooterAndSearch from '@/app/[locale]/components/TableWithFooterAndSearch';
import React, { useEffect, useState } from 'react';
import { ICPMobile } from '@/lib//types/types';
import { formatDateString } from '@/utils/formatDate';
import { useLocale, useTranslations } from 'next-intl';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@/app/[locale]/components/common/IconButton';

interface Props {
    cpsId: string;
    counterCPMobile: number;
}

export function ListCPMobile({ cpsId, counterCPMobile }: Props) {
    const t = useTranslations();
    const locale = useLocale();

    const [currentPage, setCurrentPage] = useState(1);

    const resultsPerPage = 10;

    const { data, isError, isLoading, refetch } = useFetchCPMobile(
        cpsId,
        currentPage,
        resultsPerPage,
    );

    const [cpMobile, setCPMobile] = useState<ICPMobile[]>(data ?? []);

    const editColor = { filled: '#90470b', unfilled: 'grey' };
    const deleteColor = { filled: '#90470b', unfilled: 'grey' };

    const [isEditModal, setIsEditModal] = useState(false);
    const [isDeleteModal, setIsDeleteModal] = useState(false);

    const [selectedCP, setSelectedCP] = useState<ICPMobile>();

    useEffect(() => {
        refetch().then((res) => {
            const cpMobile = res.data as ICPMobile[];
            setCPMobile(cpMobile);
        });
    }, [currentPage]);

    const handleEditClick = async (cp: ICPMobile) => {
        handleEditModal(true);
        setSelectedCP(cp);
    };

    const handleDeleteClick = async (cp: ICPMobile) => {
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
            render: (value: string, row: ICPMobile) => (
                <Link
                    target={'_blank'}
                    href={`/consumption_points/mobile/${row.id}`}
                    locale={locale}
                    className="font-semibold text-beer-blonde hover:text-beer-draft"
                >
                    {value}
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
            render: (value: any, row: ICPMobile) => (
                <div className="flex items-center justify-center space-x-2">
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
                            'hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full '
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

            {isError && (
                <div className="flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        {t('errors.fetching_cp_mobile')}
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

            {!isError && !isLoading && cpMobile.length === 0 ? (
                <div className="flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        {t('no_cp_mobile')}
                    </p>
                </div>
            ) : (
                <TableWithFooterAndSearch
                    columns={columns}
                    data={cpMobile}
                    initialQuery={''}
                    resultsPerPage={resultsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    searchPlaceHolder={'search_by_name'}
                    paginationCounter={counterCPMobile}
                    sourceDataIsFromServer={false}
                />
            )}
        </section>
    );
}
