import PaginationFooter from '../../../../components/common/PaginationFooter';
import DeleteContractModal from './DeleteContractModal';
import CancelContractModal from './CancelContractModal';
import useFetchDistributionContractsByProducerId from '../../../../../../hooks/useFetchDistributionContractsByProducerId';
import React, { useEffect, useMemo, useState } from 'react';
import { IconButton } from '../../../../components/common/IconButton';
import Spinner from '../../../../components/common/Spinner';
import { faTrash, faBan } from '@fortawesome/free-solid-svg-icons';
import { IDistributionContract } from '../../../../../../lib/types/types';
import { useLocale, useTranslations } from 'next-intl';
import { DistributionStatus } from '../../../../../../lib/enums';
import { formatDateString } from '../../../../../../utils/formatDate';
import InputSearch from '../../../../components/common/InputSearch';
import Link from 'next/link';

enum SortBy {
  NONE = 'none',
  USERNAME = 'username',
  NAME = 'name',
  LAST = 'last',
  COUNTRY = 'country',
  CREATED_DATE = 'created_date',
}

interface Props {
  producerId: string;
}

export default function AssociatedDistributorsList({ producerId }: Props) {
  const locale = useLocale();
  const t = useTranslations();

  const deleteColor = { filled: '#90470b', unfilled: 'grey' };
  const cancelColor = { filled: '#90470b', unfilled: 'grey' };

  const [currentPage, setCurrentPage] = useState(1);

  const [query, setQuery] = useState('');
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const [selectedContract, setSelectedContract] =
    useState<IDistributionContract>();

  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isCancelModal, setIsCancelModal] = useState(false);

  const counter = 1;
  const resultsPerPage = 10;

  /* Fetch the distributors that the user can be associated  */
  const {
    data: distributionContracts,
    isError,
    isLoading,
    refetch,
  } = useFetchDistributionContractsByProducerId(producerId);

  const [listDistributionContracts, setListDistributionContracts] = useState<
    IDistributionContract[]
  >(distributionContracts ?? []);

  useEffect(() => {
    refetch().then((res: any) => {
      const ds = res.data ?? [];
      setListDistributionContracts(ds);
    });
  }, [currentPage, distributionContracts]);

  const filteredItems = useMemo<IDistributionContract[]>(() => {
    if (!listDistributionContracts) return [];
    return listDistributionContracts.filter((d: IDistributionContract) => {
      if (!d.distributor_user || !d.distributor_user.users) return false;
      return d.distributor_user.users.username
        .toLowerCase()
        .includes(query?.toLowerCase());
    });
  }, [listDistributionContracts, query]);

  const sortedItems = useMemo(() => {
    if (sorting === SortBy.NONE) return filteredItems;

    const compareProperties: Record<string, (d: IDistributionContract) => any> =
      {
        [SortBy.USERNAME]: (d) => d.distributor_user?.user_id,
        [SortBy.CREATED_DATE]: (d) => d.created_at,
      };

    return filteredItems.toSorted(
      (a: IDistributionContract, b: IDistributionContract) => {
        const extractProperty = compareProperties[sorting];
        return extractProperty(a).localeCompare(extractProperty(b));
      },
    );
  }, [filteredItems, sorting]);

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort);
  };

  const handleDeleteClick = async (contract: IDistributionContract) => {
    setIsDeleteModal(true);
    setSelectedContract(contract);
  };

  const handleCancelClick = (contract: IDistributionContract) => {
    setIsCancelModal(true);
    setSelectedContract(contract);
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

  return (
    <section className="bg-beer-foam relative mt-6 space-y-4 overflow-x-auto shadow-md sm:rounded-lg">
      {isDeleteModal &&
        selectedContract &&
        selectedContract.distributor_user && (
          <DeleteContractModal
            distributor_id={selectedContract.distributor_id}
            producer_id={producerId}
            handleDeleteModal={() => setIsDeleteModal(false)}
          />
        )}

      {isCancelModal &&
        selectedContract &&
        selectedContract.distributor_user && (
          <CancelContractModal
            distributor_id={selectedContract.distributor_id}
            producer_id={producerId}
            handleCancelModal={() => setIsCancelModal(false)}
          />
        )}

      {isError && (
        <span className="flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            {t('error_fetching_distributors')}
          </p>
        </span>
      )}

      {isLoading && (
        <Spinner color="beer-blonde" size="xLarge" absolute center />
      )}

      {!isError && !isLoading && sortedItems.length > 0 && (
        <>
          <InputSearch
            query={query}
            setQuery={setQuery}
            searchPlaceholder={t('search_by_name')}
          />

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

                <th className="px-6 py-3">{t('status_header')}</th>

                <th scope="col" className="px-6 py-3 ">
                  {t('action_header')}
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedItems.map((contract: IDistributionContract) => {
                return (
                  <tr
                    key={contract.distributor_id + '-' + contract.producer_id}
                    className=""
                  >
                    <td className="px-6 py-4 font-semibold text-beer-blonde hover:cursor-pointer hover:text-beer-draft">
                      <Link
                        href={`/d-info/${contract.distributor_id}`}
                        locale={locale}
                        target="_blank"
                      >
                        {contract.distributor_user?.users?.username ?? '-'}
                      </Link>
                    </td>

                    <td className="px-6 py-4">
                      {formatDateString(contract.created_at)}
                    </td>

                    <td className="px-6 py-4">{t(contract.status)}</td>

                    <td className="flex items-center justify-center gap-2 px-6 py-4">
                      <IconButton
                        icon={faTrash}
                        onClick={() => {
                          handleDeleteClick(contract);
                        }}
                        color={deleteColor}
                        classContainer={
                          'hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full '
                        }
                        classIcon={''}
                        title={t('delete')}
                      />

                      {/* If the contract is not beign signed yet, we can cancel it  */}
                      {contract.status !== DistributionStatus.ACCEPTED && (
                        <IconButton
                          icon={faBan}
                          onClick={() => {
                            handleCancelClick(contract);
                          }}
                          color={cancelColor}
                          classContainer={
                            'hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full '
                          }
                          classIcon={''}
                          title={t('cancel_contract')}
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
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
