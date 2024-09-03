import Link from 'next/link';
import DeleteContractModal from './DeleteContractModal';
import CancelContractModal from './CancelContractModal';
import Spinner from '@/app/[locale]/components/common/Spinner';
import TableWithFooterAndSearch from '@/app/[locale]/components/TableWithFooterAndSearch';
import useFetchDistributionContractsByProducerId from '../../../../../../hooks/useFetchDistributionContractsByProducerId';
import React, { useEffect, useState } from 'react';
import { DistributionStatus } from '@/lib//enums';
import { formatDateString } from '@/utils/formatDate';
import { useLocale, useTranslations } from 'next-intl';
import { IDistributionContract } from '@/lib//types/types';
import { faTrash, faBan } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@/app/[locale]/components/common/IconButton';
import { useAuth } from '@/app/[locale]/(auth)/Context/useAuth';

interface Props {
    counter: number;
}

export default function AssociatedDistributorsList({ counter }: Props) {
    const locale = useLocale();
    const t = useTranslations();

    const deleteColor = { filled: '#90470b', unfilled: 'grey' };
    const cancelColor = { filled: '#90470b', unfilled: 'grey' };

    const [currentPage, setCurrentPage] = useState(1);

    const [selectedContract, setSelectedContract] =
        useState<IDistributionContract>();

    const [isDeleteModal, setIsDeleteModal] = useState(false);
    const [isCancelModal, setIsCancelModal] = useState(false);

    const resultsPerPage = 10;

    const { user } = useAuth();

    /* Fetch the distributors that the user can be associated  */
    const {
        data: distributionContracts,
        isError,
        isLoading,
        refetch,
    } = useFetchDistributionContractsByProducerId(user.id);

    const [listDistributionContracts, setListDistributionContracts] = useState<
        IDistributionContract[]
    >(distributionContracts ?? []);

    useEffect(() => {
        refetch().then((res: any) => {
            const ds = res.data ?? [];
            setListDistributionContracts(ds);
        });
    }, [currentPage, distributionContracts]);

    const handleDeleteClick = async (contract: IDistributionContract) => {
        setIsDeleteModal(true);
        setSelectedContract(contract);
    };

    const handleCancelClick = (contract: IDistributionContract) => {
        setIsCancelModal(true);
        setSelectedContract(contract);
    };

    const columns = [
        {
            header: t('name_header'),
            accessor: 'distributor_user.users.username',
            sortable: true,
            render: (_: any, row: IDistributionContract) => (
                <Link
                    href={`/user-info/${row.distributor_id}`}
                    locale={locale}
                    target="_blank"
                >
                    <span className="font-semibold text-beer-blonde hover:text-beer-draft">
                        {row.distributor_user?.users?.username ?? '-'}
                    </span>
                </Link>
            ),
        },
        {
            header: t('created_date_header'),
            accessor: 'created_at',
            sortable: true,
            render: (created_at: string) => formatDateString(created_at),
        },
        {
            header: t('status_header'),
            accessor: 'status',
            render: (status: DistributionStatus) => t(status),
        },
        {
            header: t('action_header'),
            accessor: 'actions',
            render: (_: any, row: IDistributionContract) => (
                <div className="flex items-center justify-center gap-2">
                    <IconButton
                        icon={faTrash}
                        onClick={() => handleDeleteClick(row)}
                        color={deleteColor}
                        classContainer="hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full"
                        classIcon=""
                        title={t('delete')}
                    />
                    {row.status !== DistributionStatus.ACCEPTED && (
                        <IconButton
                            icon={faBan}
                            onClick={() => handleCancelClick(row)}
                            color={cancelColor}
                            classContainer="hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full"
                            classIcon=""
                            title={t('cancel_contract')}
                        />
                    )}
                </div>
            ),
        },
    ];

    return (
        <section className="bg-beer-foam relative mt-2 rounded-md border-2 border-beer-blonde px-2 py-4 shadow-xl">
            {isDeleteModal &&
                selectedContract &&
                selectedContract.distributor_user && (
                    <DeleteContractModal
                        distributor_id={selectedContract.distributor_id}
                        producer_id={user.id}
                        handleDeleteModal={() => setIsDeleteModal(false)}
                    />
                )}

            {isCancelModal &&
                selectedContract &&
                selectedContract.distributor_user && (
                    <CancelContractModal
                        distributor_id={selectedContract.distributor_id}
                        producer_id={user.id}
                        handleCancelModal={() => setIsCancelModal(false)}
                    />
                )}

            {isError && (
                <span className="flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        {t('errors.fetching_distributors')}
                    </p>
                </span>
            )}

            {isLoading && (
                <Spinner
                    color="beer-blonde"
                    size="xLarge"
                    absolute
                    flexCenter
                />
            )}

            {!isError && !isLoading && (
                <TableWithFooterAndSearch
                    columns={columns}
                    data={listDistributionContracts ?? []}
                    initialQuery={''}
                    resultsPerPage={resultsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    searchPlaceHolder={t('search_by_name')}
                    paginationCounter={counter}
                    sourceDataIsFromServer={true}
                />
            )}
        </section>
    );
}

{
    /* <div className="space-y-2">
                    <InputSearch
                        query={query}
                        setQuery={setQuery}
                        searchPlaceholder={t('search_by_name')}
                    />

                    <div className="overflow-x-scroll border-2 ">
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
                                            handleChangeSort(
                                                SortBy.CREATED_DATE,
                                            );
                                        }}
                                    >
                                        {t('created_date_header')}
                                    </th>

                                    <th className="px-6 py-3">
                                        {t('status_header')}
                                    </th>

                                    <th scope="col" className="px-6 py-3 ">
                                        {t('action_header')}
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {sortedItems.map(
                                    (contract: IDistributionContract) => {
                                        return (
                                            <tr
                                                key={
                                                    contract.distributor_id +
                                                    '-' +
                                                    contract.producer_id
                                                }
                                                className=""
                                            >
                                                <td className="px-6 py-4 font-semibold text-beer-blonde hover:cursor-pointer hover:text-beer-draft">
                                                    <Link
                                                        href={`/user-info/${contract.distributor_id}`}
                                                        locale={locale}
                                                        target="_blank"
                                                    >
                                                        {contract
                                                            .distributor_user
                                                            ?.users?.username ??
                                                            '-'}
                                                    </Link>
                                                </td>

                                                <td className="px-6 py-4">
                                                    {formatDateString(
                                                        contract.created_at,
                                                    )}
                                                </td>

                                                <td className="px-6 py-4">
                                                    {t(contract.status)}
                                                </td>

                                                <td className="flex items-center justify-center gap-2 px-6 py-4">
                                                    <IconButton
                                                        icon={faTrash}
                                                        onClick={() => {
                                                            handleDeleteClick(
                                                                contract,
                                                            );
                                                        }}
                                                        color={deleteColor}
                                                        classContainer={
                                                            'hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full '
                                                        }
                                                        classIcon={''}
                                                        title={t('delete')}
                                                    />

                                                    {contract.status !==
                                                        DistributionStatus.ACCEPTED && (
                                                        <IconButton
                                                            icon={faBan}
                                                            onClick={() => {
                                                                handleCancelClick(
                                                                    contract,
                                                                );
                                                            }}
                                                            color={cancelColor}
                                                            classContainer={
                                                                'hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full '
                                                            }
                                                            classIcon={''}
                                                            title={t(
                                                                'cancel_contract',
                                                            )}
                                                        />
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    },
                                )}
                            </tbody>
                        </table>
                    </div>

                    <PaginationFooter
                        counter={counter}
                        resultsPerPage={resultsPerPage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                </div> */
}
