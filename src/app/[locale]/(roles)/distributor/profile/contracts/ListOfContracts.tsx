'use client';

import Link from 'next/link';
import RejectContractModal from './RejectContractModal';
import ApproveContractModal from './ApproveContractModal';
import useFetchDistributionContractsByDistributorId from '../../../../../../hooks/useFetchDistributionContractsByDistributorId';
import React, { useMemo, useState } from 'react';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { IconButton } from '../../../../components/common/IconButton';
import { faCancel, faCheck } from '@fortawesome/free-solid-svg-icons';
import { IDistributionContract } from '../../../../../../lib/types';
import { useLocale, useTranslations } from 'next-intl';
import { formatDateString } from '../../../../../../utils/formatDate';
import InputSearch from '../../../../components/common/InputSearch';

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

export default function ListOfContracts() {
  const t = useTranslations();
  const locale = useLocale();

  const acceptColor = { filled: '#90470b', unfilled: 'grey' };
  const rejectColor = { filled: 'red', unfilled: 'grey' };

  const [query, setQuery] = useState('');
  const { user } = useAuth();

  if (!user) return null;

  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);

  const [isApproveModal, setIsApproveModal] = useState(false);
  const [isRejectModal, setIsRejectModal] = useState(false);

  const [selectedContract, setSelectedContract] =
    useState<IDistributionContract>();

  const { data: contracts } = useFetchDistributionContractsByDistributorId(
    user?.id,
  );

  const filteredItems: IDistributionContract[] = useMemo<
    IDistributionContract[]
  >(() => {
    if (!contracts) return [];

    return contracts.filter((contract: IDistributionContract) => {
      return contract.producer_user && contract.producer_user.users
        ? contract.producer_user.users.username
            .toLowerCase()
            .includes(query.toLowerCase())
        : false;
    });
  }, [contracts, query]);

  const sortedItems = useMemo(() => {
    if (sorting === SortBy.NONE) return filteredItems;
    const compareProperties: Record<
      string,
      (contract: IDistributionContract) => any
    > = {
      [SortBy.USERNAME]: (contract) => {
        if (!contract.producer_user || !contract.producer_user.users) return '';
        return contract.producer_user.users.username;
      },
    };

    return filteredItems.toSorted((a, b) => {
      const extractProperty = compareProperties[sorting];
      return extractProperty(a).localeCompare(extractProperty(b));
    });
  }, [filteredItems, sorting]);

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort);
  };

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

  return (
    <div className="relative overflow-x-auto px-6 py-4 shadow-md sm:rounded-lg ">
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

      <InputSearch
        query={query}
        setQuery={setQuery}
        searchPlaceholder={'search_contracts'}
      />

      <table className="w-full text-center text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 hover:cursor-pointer"
              onClick={() => {
                handleChangeSort(SortBy.USERNAME);
              }}
            >
              {t('username_header')}
            </th>

            <th
              scope="col"
              className="px-6 py-3 hover:cursor-pointer"
              onClick={() => {
                handleChangeSort(SortBy.CREATED_DATE);
              }}
            >
              {t('created_date_header')}
            </th>

            <th scope="col" className="px-6 py-3 hover:cursor-pointer">
              {t('status_header')}
            </th>

            <th scope="col" className="px-6 py-3 ">
              {t('action_header')}
            </th>
          </tr>
        </thead>

        <tbody>
          {sortedItems.map((contract) => {
            return (
              <tr
                key={contract.distributor_id + '-' + contract.producer_id}
                className=""
              >
                <td className="px-6 py-4 font-semibold text-beer-blonde hover:text-beer-draft">
                  <Link
                    href={`/p-info/${contract.producer_id}`}
                    locale={locale}
                    target="_blank"
                  >
                    {contract?.producer_user?.users?.username}
                  </Link>
                </td>

                <td className="px-6 py-4">
                  {formatDateString(contract.created_at)}
                </td>

                <td className="px-6 py-4">{t(contract.status)}</td>

                <td className="flex items-center justify-center gap-2 px-6 py-4">
                  {!contract.distributor_accepted && (
                    <IconButton
                      icon={faCheck}
                      onClick={() => handleApproveClick(contract)}
                      color={acceptColor}
                      classContainer={
                        'hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full !m-0'
                      }
                      classIcon={''}
                      title={t('accept')}
                    />
                  )}

                  {contract.distributor_accepted && (
                    <IconButton
                      icon={faCancel}
                      onClick={() => handleRejectClick(contract)}
                      color={rejectColor}
                      classContainer={
                        'hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full !m-0 '
                      }
                      classIcon={''}
                      title={t('reject')}
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
