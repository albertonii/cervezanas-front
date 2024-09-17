import Link from 'next/link';
import Spinner from '@/app/[locale]/components/common/Spinner';
import InputSearch from '@/app/[locale]/components/common/InputSearch';
import useFetchDistributorsByProducerId from '../../../../../../hooks/useFetchDistributors';
import PaginationFooter from '@/app/[locale]/components/common/PaginationFooter';
import React, { ComponentProps, useEffect, useMemo, useState } from 'react';
import { IDistributorUser } from '@/lib//types/types';
import { formatDateString } from '@/utils/formatDate';
import { useLocale, useTranslations } from 'next-intl';
import { faFileSignature } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@/app/[locale]/components/common/IconButton';

enum SortBy {
    NONE = 'none',
    USERNAME = 'username',
    NAME = 'name',
    LAST = 'last',
    CREATED_DATE = 'created_date',
}

interface Props {
    producerId: string;
    handleDistributor: ComponentProps<any>;
}

export default function AvailableDistributorsList({
    producerId,
    handleDistributor,
}: Props) {
    const t = useTranslations();
    const locale = useLocale();

    const [currentPage, setCurrentPage] = useState(1);

    const [query, setQuery] = useState('');
    const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);

    const deleteColor = { filled: '#90470b', unfilled: 'grey' };
    const [isDeleteModal, setIsDeleteModal] = useState(false);

    const counter = 1;
    const resultsPerPage = 10;

    /* Fetch the distributors that the user can be associated  */
    const {
        data: distributors,
        isError,
        isLoading,
        refetch,
    } = useFetchDistributorsByProducerId(producerId);

    const [listDistributors, setListDistributors] = useState(
        distributors ?? [],
    );

    useEffect(() => {
        refetch().then((res: any) => {
            const ds = res.data ?? [];

            setListDistributors(ds);
        });
    }, [currentPage]);

    const filteredItems = useMemo<IDistributorUser[]>(() => {
        if (!distributors) return [];
        return distributors.filter((d) => {
            return d.users?.username
                .toLowerCase()
                .includes(query.toLowerCase());
        });
    }, [distributors, query]);

    const sortedItems = useMemo(() => {
        if (sorting === SortBy.NONE) return filteredItems;

        const compareProperties: Record<string, (d: IDistributorUser) => any> =
            {
                [SortBy.USERNAME]: (d) => d.users?.username,
                [SortBy.CREATED_DATE]: (d) => d.created_at,
            };

        return filteredItems.toSorted(
            (a: IDistributorUser, b: IDistributorUser) => {
                const extractProperty = compareProperties[sorting];
                return extractProperty(a).localeCompare(extractProperty(b));
            },
        );
    }, [filteredItems, sorting]);

    const handleChangeSort = (sort: SortBy) => {
        setSorting(sort);
    };

    const handleSignContractlick = async (distributor: IDistributorUser) => {
        handleDistributor(distributor);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(counter / resultsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlDeleteModal = (isDelete: boolean) => {
        setIsDeleteModal(isDelete);
    };

    return (
        <section className="relative space-y-4 overflow-x-auto px-6 py-4 shadow-md sm:rounded-lg">
            <span className="text-slate-500 my-4 sm:text-md leading-relaxed">
                {t('form_submit_contract_description')}
            </span>

            <h2 className="text-4xl font-['NexaRust-script']">
                {t('distributors_list')}
            </h2>

            {isError && (
                <div className="flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        {t('errors.fetching_distributors')}
                    </p>
                </div>
            )}

            <div className="relative w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                        aria-hidden="true"
                        className="h-5 w-5 text-gray-500 dark:text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                </div>

                <InputSearch
                    query={query}
                    setQuery={setQuery}
                    searchPlaceholder={t('search_by_name')}
                />
            </div>

            {isLoading && (
                <Spinner
                    color="beer-blonde"
                    size="xLarge"
                    absolute
                    flexCenter
                />
            )}

            {!isError && !isLoading && filteredItems.length === 0 ? (
                <div className="flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        {t('no_distributors')}
                    </p>
                </div>
            ) : (
                <>
                    <table className="w-full text-center text-sm text-gray-500 dark:text-gray-400">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
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
                                    className="px-6 py-3 hover:cursor-pointer"
                                    onClick={() => {
                                        handleChangeSort(SortBy.CREATED_DATE);
                                    }}
                                >
                                    {t('created_date_header')}
                                </th>

                                <th scope="col" className="px-6 py-3 ">
                                    {t('action_header')}
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredItems.map(
                                (distributor: IDistributorUser) => {
                                    return (
                                        <tr
                                            key={distributor.user_id}
                                            className=""
                                        >
                                            <td className="px-6 py-4 font-semibold text-beer-blonde hover:cursor-pointer hover:text-beer-draft">
                                                <Link
                                                    href={`/user-info/${distributor.user_id}`}
                                                    locale={locale}
                                                    target="_blank"
                                                >
                                                    {
                                                        distributor.users
                                                            ?.username
                                                    }
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4">
                                                {formatDateString(
                                                    distributor.created_at,
                                                )}
                                            </td>
                                            <td className="flex items-center justify-center px-6 py-4">
                                                <IconButton
                                                    icon={faFileSignature}
                                                    onClick={() => {
                                                        handleSignContractlick(
                                                            distributor,
                                                        );
                                                    }}
                                                    color={deleteColor}
                                                    classContainer={
                                                        'hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full '
                                                    }
                                                    classIcon={''}
                                                    title={t(
                                                        'contract_with_distributor',
                                                    )}
                                                />
                                            </td>
                                        </tr>
                                    );
                                },
                            )}
                        </tbody>
                    </table>

                    <PaginationFooter
                        counter={counter}
                        resultsPerPage={resultsPerPage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                </>
            )}
        </section>
    );
}
