'use client';

import Link from 'next/link';
import RejectContractModal from './RejectContractModal';
import ApproveContractModal from './ApproveContractModal';
import TableWithFooterAndSearch from '@/app/[locale]/components/TableWithFooterAndSearch';
import useFetchDistributionContractsByDistributorId from '../../../../../../hooks/useFetchDistributionContractsByDistributorId';
import React, { useEffect, useState } from 'react';
import { formatDateString } from '@/utils/formatDate';
import { useLocale, useTranslations } from 'next-intl';
import { IDistributionContract } from '@/lib//types/types';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { faCancel, faCheck } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@/app/[locale]/components/common/IconButton';

interface Props {
    counter: number;
}

export default function AssociatedProducersList({ counter }: Props) {
    const { user } = useAuth();

    if (!user) return null;

    const t = useTranslations();
    const locale = useLocale();

    const acceptColor = { filled: '#90470b', unfilled: 'grey' };
    const rejectColor = { filled: 'red', unfilled: 'grey' };

    const resultsPerPage = 10;

    const { isLoggedIn } = useAuth();

    const [currentPage, setCurrentPage] = useState(1);
    const [isApproveModal, setIsApproveModal] = useState(false);
    const [isRejectModal, setIsRejectModal] = useState(false);

    const [selectedContract, setSelectedContract] =
        useState<IDistributionContract>();

    const [contracts, setContracts] = useState<IDistributionContract[]>([]);

    const { data, refetch } = useFetchDistributionContractsByDistributorId(
        user?.id,
    );

    useEffect(() => {
        if (isLoggedIn) {
            refetch().then((res: any) => {
                const contracts_ = res.data as IDistributionContract[];
                setContracts(contracts_);
            });
        }
    }, [currentPage, data]);

    const handleApproveClick = async (contract: IDistributionContract) => {
        setIsApproveModal(true);
        if (typeof contract === 'boolean') return; // IDK why contract is converting to boolean
        setSelectedContract(contract);
    };

    const handleApproveModal = (value: boolean) => {
        setIsApproveModal(value);
    };

    const handleRejectClick = async (contract: IDistributionContract) => {
        setIsRejectModal(true);
        setSelectedContract(contract);
    };

    const handleRejectModal = (value: boolean) => {
        setIsRejectModal(value);
    };

    const columns = [
        {
            header: t('username_header'),
            accessor: 'producer_user.users.username',
            sortable: true,
            render: (value: string, row: IDistributionContract) => (
                <Link
                    href={`/user-info/${row.producer_id}`}
                    locale={locale}
                    target="_blank"
                    className="font-semibold text-beer-blonde hover:text-beer-draft"
                >
                    {row.producer_user?.users?.username}
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
            header: t('status_header'),
            accessor: 'status',
            sortable: true,
            render: (value: string) => t(value),
        },
        {
            header: t('action_header'),
            accessor: 'action',
            render: (value: any, row: IDistributionContract) => (
                <div className="flex items-center justify-center gap-2">
                    {!row.distributor_accepted && (
                        <IconButton
                            icon={faCheck}
                            onClick={() => handleApproveClick(row)}
                            color={acceptColor}
                            classContainer={
                                'hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full !m-0'
                            }
                            classIcon={''}
                            title={t('accept')}
                        />
                    )}

                    {row.distributor_accepted && (
                        <IconButton
                            icon={faCancel}
                            onClick={() => handleRejectClick(row)}
                            color={rejectColor}
                            classContainer={
                                'hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full !m-0 '
                            }
                            classIcon={''}
                            title={t('reject')}
                        />
                    )}
                </div>
            ),
        },
    ];

    return (
        <section className="bg-beer-foam relative mt-2 rounded-md border-2 border-beer-blonde px-2 py-4 shadow-xl">
            {isApproveModal && selectedContract && (
                <>
                    <ApproveContractModal
                        selectedContract={selectedContract}
                        isApproveModal={isApproveModal}
                        handleApproveModal={handleApproveModal}
                    />
                </>
            )}

            {isRejectModal && selectedContract && (
                <>
                    <RejectContractModal
                        selectedContract={selectedContract}
                        isRejectModal={isRejectModal}
                        handleRejectModal={handleRejectModal}
                    />
                </>
            )}

            <TableWithFooterAndSearch
                columns={columns}
                data={contracts}
                initialQuery={''}
                resultsPerPage={resultsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                searchPlaceHolder={'search'}
                paginationCounter={counter}
                sourceDataIsFromServer={false}
            />
        </section>
    );
}
