'use client';

import Image from 'next/image';
import Link from 'next/link';
import Spinner from '../../../../components/common/Spinner';
import InputSearch from '../../../../components/common/InputSearch';
import PaginationFooter from '../../../../components/common/PaginationFooter';
import useFetchExperiencesByProducerId from '../../../../../../hooks/useFetchExperiencesByProducerIdWithPagination';
import DeleteExperienceModal from '../../../../components/modals/experiences/DeleteBeerMasterExperienceModal';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { formatDateString } from '../../../../../../utils/formatDate';
import { IconButton } from '../../../../components/common/IconButton';
import UpdateBeerMasterExperienceModalNew from '../../../../components/modals/experiences/UpdateBeerMasterExperienceModal';
import { IExperience } from '../../../../../../lib/types/quiz';
import { useAuth } from '../../../../(auth)/Context/useAuth';

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
    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const resultsPerPage = 10;

    const { data, isError, isLoading, refetch } =
        useFetchExperiencesByProducerId(currentPage, resultsPerPage);

    const [experiences, setExperiences] = useState<IExperience[]>(es ?? []);

    const editColor = { filled: '#90470b', unfilled: 'grey' };
    const deleteColor = { filled: '#90470b', unfilled: 'grey' };

    const [isEditModal, setIsEditModal] = useState(false);
    const [isDeleteModal, setIsDeleteModal] = useState(false);

    const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
    const [selectedExperience, setSelectedExperience] = useState<IExperience>();

    const COLUMNS = [
        { header: t('experience_type_header') },
        { header: t('name_header') },
        { header: t('created_date_header') },
        { header: t('action_header') },
    ];

    useEffect(() => {
        if (isLoggedIn) {
            refetch().then((res: any) => {
                const experiences = res.data as IExperience[];
                setExperiences(experiences);
            });
        }
    }, [currentPage, data, isLoggedIn]);

    const filteredItems = useMemo<IExperience[]>(() => {
        if (!data) return [];
        return data.filter((experience) => {
            return experience.name.toLowerCase().includes(query.toLowerCase());
        });
    }, [data, experiences, query]);

    const sortedItems = useMemo(() => {
        if (sorting === SortBy.NONE) return filteredItems;

        const compareProperties: Record<
            string,
            (experience: IExperience) => any
        > = {
            [SortBy.NAME]: (e) => e.name,
            [SortBy.CREATED_DATE]: (e) => e.created_at,
        };

        return filteredItems.toSorted((a, b) => {
            const extractProperty = compareProperties[sorting];
            return extractProperty(a).localeCompare(extractProperty(b));
        });
    }, [filteredItems, sorting]);

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
        <section className="mt-2 mb-4 space-y-3  rounded-md border-2 border-beer-blonde  bg-white px-6 py-4 shadow-2xl">
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
                        {t('error_fetching_experiences')}
                    </p>
                </div>
            )}

            {isLoading && (
                <Spinner color="beer-blonde" size="xLarge" absolute center />
            )}

            {!isError && !isLoading && experiences.length === 0 ? (
                <div className="flex h-40 items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        {t('no_experiences')}
                    </p>
                </div>
            ) : (
                <>
                    <InputSearch
                        query={query}
                        setQuery={setQuery}
                        searchPlaceholder={'search_by_name'}
                    />

                    <table className="w-full text-center text-sm text-gray-500 dark:text-gray-400">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                {COLUMNS.map(
                                    (column: ColumnsProps, index: number) => {
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
                            {sortedItems.map((e: IExperience) => {
                                return (
                                    <tr key={e.id} className="">
                                        <th
                                            scope="row"
                                            className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                                        >
                                            <Image
                                                width={128}
                                                height={128}
                                                className="h-8 w-8 rounded-full"
                                                src="/icons/people-line-solid.svg"
                                                alt="Beer Type"
                                            />
                                        </th>

                                        <td className="px-6 py-4 font-semibold text-beer-blonde hover:text-beer-draft">
                                            <Link
                                                href={`/experiences/${e.id}`}
                                                locale={locale}
                                            >
                                                {e.name}
                                            </Link>
                                        </td>

                                        <td className="px-6 py-4">
                                            {formatDateString(e.created_at)}
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
        </section>
    );
}
