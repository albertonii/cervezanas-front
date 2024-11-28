import Link from 'next/link';
import DeleteContractModal from './DeleteContractModal';
import CancelContractModal from './CancelContractModal';
import useFetchDistributionContractsByProducerId from '../../../../../../hooks/useFetchDistributionContractsByProducerId';
import React, { useEffect, useState } from 'react';
import { DistributionStatus } from '@/lib//enums';
import { formatDateString } from '@/utils/formatDate';
import { useLocale, useTranslations } from 'next-intl';
import { IDistributionContract } from '@/lib/types/types';
import { faTrash, faBan } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/app/[locale]/(auth)/Context/useAuth';
import { IconButton } from '@/app/[locale]/components/ui/buttons/IconButton';
import Spinner from '@/app/[locale]/components/ui/Spinner';
import TableWithFooterAndSearch from '@/app/[locale]/components/ui/TableWithFooterAndSearch';
import ListTableWrapper from '@/app/[locale]/components/ui/ListTableWrapper';

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
                    <span className="font-semibold text-beer-blonde hover:text-beer-draft dark:text-beer-softBlonde">
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
                        title={t('delete')}
                    />
                    {row.status !== DistributionStatus.ACCEPTED && (
                        <IconButton
                            icon={faBan}
                            onClick={() => handleCancelClick(row)}
                            color={cancelColor}
                            classContainer="hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full"
                            title={t('cancel_contract')}
                        />
                    )}
                </div>
            ),
        },
    ];

    return (
        <ListTableWrapper
            isError={isError}
            isLoading={isLoading}
            errorMessage={'errors.fetching_distributors'}
        >
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
        </ListTableWrapper>
    );
}
