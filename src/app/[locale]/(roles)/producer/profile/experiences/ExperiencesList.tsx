'use client';

import Image from 'next/image';
import Link from 'next/link';
import Spinner from '@/app/[locale]/components/common/Spinner';
import InputSearch from '@/app/[locale]/components/common/InputSearch';
import PaginationFooter from '@/app/[locale]/components/common/PaginationFooter';
import useFetchExperiencesByProducerId from '../../../../../../hooks/useFetchExperiencesByProducerIdWithPagination';
import DeleteExperienceModal from '@/app/[locale]/components/modals/experiences/DeleteBeerMasterExperienceModal';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { formatDateString } from '@/utils/formatDate';
import { IconButton } from '@/app/[locale]/components/common/IconButton';
import UpdateBeerMasterExperienceModalNew from '@/app/[locale]/components/modals/experiences/UpdateBeerMasterExperienceModal';
import { IExperience } from '@/lib//types/quiz';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import TableWithFoorterAndSearch from '@/app/[locale]/components/TableWithFoorterAndSearch';

enum SortBy {
    NONE = 'none',
    NAME = 'name',
    CREATED_DATE = 'created_date',
}
interface ColumnsProps {
    header: string;
}

interface Props {
    experiences: IExperience[];
    counter: number;
}

export default function ExperienceList({ counter, experiences: es }: Props) {
    const t = useTranslations();
    const locale = useLocale();
    const { isLoggedIn } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);

    const resultsPerPage = 1;

    const { data, isError, isLoading, refetch } =
        useFetchExperiencesByProducerId(currentPage, resultsPerPage);

    const [experiences, setExperiences] = useState<IExperience[]>(es ?? []);

    const editColor = { filled: '#90470b', unfilled: 'grey' };
    const deleteColor = { filled: '#90470b', unfilled: 'grey' };

    const [isEditModal, setIsEditModal] = useState(false);
    const [isDeleteModal, setIsDeleteModal] = useState(false);

    const [selectedExperience, setSelectedExperience] = useState<IExperience>();

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
            render: (value: string, row: IExperience) => (
                <Link href={`/experiences/${row.id}`} locale={locale}>
                    <span className="font-semibold text-beer-blonde hover:text-beer-draft">
                        {value}
                    </span>
                </Link>
            ),
        },
        {
            header: t('created_date_header'),
            accessor: 'created_at',
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

    useEffect(() => {
        if (isLoggedIn) {
            refetch().then((res: any) => {
                const experiences = res.data as IExperience[];
                setExperiences(experiences);
            });
        }
    }, [currentPage, data, isLoggedIn]);

    // const filteredItems = useMemo<IExperience[]>(() => {
    //     if (!data) return [];
    //     return data.filter((experience) => {
    //         return experience.name?.toLowerCase().includes(query.toLowerCase());
    //     });
    // }, [data, experiences, query]);

    // const sortedItems = useMemo(() => {
    //     if (sorting === SortBy.NONE) return filteredItems;

    //     const compareProperties: Record<
    //         string,
    //         (experience: IExperience) => any
    //     > = {
    //         [SortBy.NAME]: (e) => e.name,
    //         [SortBy.CREATED_DATE]: (e) => e.created_at,
    //     };

    //     return filteredItems.toSorted((a, b) => {
    //         const extractProperty = compareProperties[sorting];
    //         return extractProperty(a).localeCompare(extractProperty(b));
    //     });
    // }, [filteredItems, sorting]);

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

    return (
        <section className="bg-beer-foam relative mt-2 rounded-md border-2 border-beer-blonde px-2 py-4 shadow-xl">
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

            {isError && (
                <div className="flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        {t('errors.fetching_experiences')}
                    </p>
                </div>
            )}

            {isLoading && (
                <Spinner
                    color="beer-blonde"
                    size="xLarge"
                    absolute
                    flexCenter
                />
            )}

            {!isError && !isLoading && experiences.length === 0 ? (
                <div className="flex h-40 items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        {t('no_experiences')}
                    </p>
                </div>
            ) : (
                <>
                    <TableWithFoorterAndSearch
                        columns={columns}
                        data={experiences}
                        initialQuery={''}
                        resultsPerPage={resultsPerPage}
                        searchPlaceHolder={'search_by_name'}
                        paginationCounter={counter}
                    />
                </>
            )}
        </section>
    );
}
