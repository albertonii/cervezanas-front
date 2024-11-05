'use client';

import Link from 'next/link';
import EditCPFixedModal from './EditCPFixedModal';
import DeleteCPFixedModal from './DeleteCPFixedModal';
import useFetchCPFixed from '../../../../../../hooks/useFetchCPFixed';
import React, { useEffect, useState } from 'react';
import { ICPFixed } from '@/lib//types/types';
import { formatDateString } from '@/utils/formatDate';
import { useLocale, useTranslations } from 'next-intl';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@/app/[locale]/components/ui/buttons/IconButton';
import Spinner from '@/app/[locale]/components/ui/Spinner';
import TableWithFooterAndSearch from '@/app/[locale]/components/ui/TableWithFooterAndSearch';

interface Props {
    cpsId: string;
    counterCPFixed: number;
}

export function ListCPFixed({ cpsId, counterCPFixed }: Props) {
    const t = useTranslations();
    const locale = useLocale();

    const [currentPage, setCurrentPage] = useState(1);

    const resultsPerPage = 1;

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

    const [selectedCP, setSelectedCP] = useState<ICPFixed>();

    useEffect(() => {
        refetch().then((res) => {
            const cpFixed = res.data as ICPFixed[];
            setCPFixed(cpFixed);
        });
    }, [currentPage]);

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

    const columns = [
        {
            header: t('name_header'),
            accessor: 'cp_name',
            sortable: true,
            render: (value: string, row: ICPFixed) => (
                <Link
                    target={'_blank'}
                    href={`/consumption_points/fixed?id=${row.id}`}
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
            render: (value: any, row: ICPFixed) => (
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
                <TableWithFooterAndSearch
                    columns={columns}
                    data={cpFixed}
                    initialQuery={''}
                    resultsPerPage={resultsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    searchPlaceHolder={t('search_by_name')}
                    paginationCounter={counterCPFixed}
                    sourceDataIsFromServer={false}
                />
            )}
        </section>
    );
}
