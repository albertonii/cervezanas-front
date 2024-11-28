'use client';

import Image from 'next/image';
import Link from 'next/link';
import ListTableWrapper from '@/app/[locale]/components/ui/ListTableWrapper';
import TableWithFooterAndSearch from '@/app/[locale]/components/ui/TableWithFooterAndSearch';
import DeleteExperienceModal from '@/app/[locale]/components/modals/experiences/DeleteBeerMasterExperienceModal';
import useFetchExperiencesByProducerId from '../../../../../../hooks/useFetchExperiencesByProducerIdWithPagination';
import UpdateBeerMasterExperienceModalNew from '@/app/[locale]/components/modals/experiences/UpdateBeerMasterExperienceModal';
import React, { useEffect, useState } from 'react';
import { IExperience } from '@/lib/types/quiz';
import { formatDateString } from '@/utils/formatDate';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@/app/[locale]/components/ui/buttons/IconButton';

interface Props {
    experiences: IExperience[];
    counter: number;
}

export default function ExperienceList({ counter, experiences: es }: Props) {
    const t = useTranslations();
    const locale = useLocale();
    const { isLoggedIn } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);

    const resultsPerPage = 10;

    const { data, isError, isLoading, refetch } =
        useFetchExperiencesByProducerId(currentPage, resultsPerPage);

    const [experiences, setExperiences] = useState<IExperience[]>(es ?? []);

    const editColor = { filled: '#90470b', unfilled: 'grey' };
    const deleteColor = { filled: '#90470b', unfilled: 'grey' };

    const [isEditModal, setIsEditModal] = useState(false);
    const [isDeleteModal, setIsDeleteModal] = useState(false);

    const [selectedExperience, setSelectedExperience] = useState<IExperience>();

    useEffect(() => {
        if (isLoggedIn) {
            refetch().then((res: any) => {
                const experiences = res.data as IExperience[];
                setExperiences(experiences);
            });
        }
    }, [currentPage, data, isLoggedIn]);

    const handleEditClick = async (e: IExperience) => {
        setIsEditModal(true);
        setSelectedExperience(e);
    };

    const handleDeleteClick = async (e: IExperience) => {
        setIsDeleteModal(true);
        setSelectedExperience(e);
    };

    const handleEditModal = (isEdit: boolean) => {
        setIsEditModal(isEdit);
    };

    const handlDeleteModal = (isDelete: boolean) => {
        setIsDeleteModal(isDelete);
    };

    const columns = [
        {
            header: t('experience_type_header'),
            accessor: 'type',
            render: () => (
                <Image
                    width={128}
                    height={128}
                    className="h-8 w-8 rounded-full"
                    src="/icons/people-line-solid.svg"
                    alt="Beer Type"
                />
            ),
        },
        {
            header: t('name_header'),
            accessor: 'name',
            sortable: true,
            render: (value: string, row: IExperience) => (
                <Link href={`/experiences/${row.id}`} locale={locale}>
                    <span className="font-semibold text-beer-blonde hover:text-beer-draft dark:text-beer-softBlonde">
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
            render: (_: any, row: IExperience) => (
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
        <ListTableWrapper
            isError={isError}
            isLoading={isLoading}
            errorMessage={'errors.fetching_experiences'}
        >
            {isEditModal && selectedExperience && (
                <UpdateBeerMasterExperienceModalNew
                    selectedExperience={selectedExperience}
                    isEditModal={isEditModal}
                    handleEditModal={handleEditModal}
                />
            )}

            {isDeleteModal && selectedExperience && (
                <DeleteExperienceModal
                    selectedExperienceId={selectedExperience.id}
                    isDeleteModal={isDeleteModal}
                    handleDeleteModal={handlDeleteModal}
                />
            )}

            {!isError && !isLoading && experiences.length === 0 ? (
                <div className="flex h-40 items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        {t('no_experiences')}
                    </p>
                </div>
            ) : (
                <TableWithFooterAndSearch
                    columns={columns}
                    data={experiences}
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
