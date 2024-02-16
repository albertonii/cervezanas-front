'use client';

import Link from 'next/link';
import useFetchCPMobile from '../../../../../../hooks/useFetchCPMobile';
import DeleteCPMobileModal from './DeleteCPMobileModal';
import EditCPMobileModal from './EditCPMobileModal';
import PaginationFooter from '../../../../components/common/PaginationFooter';
import React, { useEffect, useMemo, useState } from 'react';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useLocale, useTranslations } from 'next-intl';
import { ICPMobile } from '../../../../../../lib/types';
import { IconButton } from '../../../../components/common/IconButton';
import Spinner from '../../../../components/common/Spinner';
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

interface Props {
  cpsMobile: ICPMobile[];
}

export function ListCPMobile({ cpsMobile }: Props) {
  const t = useTranslations();
  const locale = useLocale();

  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const counter = 1;
  const resultsPerPage = 10;

  const [cpMobile, setCPMobile] = useState<ICPMobile[]>(cpsMobile);

  const editColor = { filled: '#90470b', unfilled: 'grey' };
  const deleteColor = { filled: '#90470b', unfilled: 'grey' };

  const [isEditModal, setIsEditModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const [selectedCP, setSelectedCP] = useState<ICPMobile>();

  const filteredItems = useMemo<ICPMobile[]>(() => {
    if (!cpMobile) return [];
    return cpsMobile.filter((mobile) => {
      return mobile.cp_name.toLowerCase().includes(query.toLowerCase());
    });
  }, [cpMobile, query]);

  const sortedItems = useMemo(() => {
    if (sorting === SortBy.NONE) return filteredItems;

    const compareProperties: Record<string, (cp: ICPMobile) => any> = {
      [SortBy.NAME]: (cp) => cp.cp_name,
      [SortBy.CREATED_DATE]: (cp) => cp.created_at,
    };

    return filteredItems.toSorted((a, b) => {
      const extractProperty = compareProperties[sorting];
      return extractProperty(a).localeCompare(extractProperty(b));
    });
  }, [filteredItems, sorting]);

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort);
  };

  const handleEditClick = async (cp: ICPMobile) => {
    setSelectedCP(cp);
    handleEditModal(true);
  };

  const handleDeleteClick = async (cp: ICPMobile) => {
    setIsDeleteModal(true);
    setSelectedCP(cp);
  };

  const handleEditModal = (isEdit: boolean) => {
    setIsEditModal(isEdit);
  };

  const handleDeleteModal = (isEdit: boolean) => {
    setIsEditModal(isEdit);
  };

  return (
    <section className="relative mt-6 space-y-4 overflow-x-auto shadow-md sm:rounded-lg">
      {/* Don't remove isEditModal or the selectedCP will not be updated when changed from selected CP  */}
      {isEditModal && selectedCP && (
        <>
          <EditCPMobileModal
            selectedCP={selectedCP}
            isEditModal={isEditModal}
            handleEditModal={handleEditModal}
          />
        </>
      )}

      {isDeleteModal && selectedCP && (
        <DeleteCPMobileModal
          selectedCPId={selectedCP.id}
          isDeleteModal={isDeleteModal}
          handleDeleteModal={handleDeleteModal}
        />
      )}

      <>
        <InputSearch
          query={query}
          setQuery={setQuery}
          searchPlaceholder={'search_by_name'}
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
                scope="col"
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
            {sortedItems.map((cp: ICPMobile) => {
              return (
                <tr key={cp.id} className="">
                  <td className="px-6 py-4 font-semibold text-beer-blonde hover:cursor-pointer hover:text-beer-draft">
                    <Link
                      target={'_blank'}
                      href={`/consumption_points/mobile/${cp.id}`}
                      locale={locale}
                    >
                      {cp.cp_name}
                    </Link>
                  </td>

                  <td className="px-6 py-4">
                    {formatDateString(cp.created_at)}
                  </td>

                  <td className="flex items-center justify-center px-6 py-4">
                    <IconButton
                      icon={faEdit}
                      onClick={() => {
                        handleEditClick(cp);
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
                        handleDeleteClick(cp);
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
    </section>
  );
}
