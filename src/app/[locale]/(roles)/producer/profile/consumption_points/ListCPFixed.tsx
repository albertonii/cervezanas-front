"use client";

import Link from "next/link";
import useFetchCPFixed from "../../../../../../hooks/useFetchCPFixed";
import EditCPFixedModal from "./EditCPFixedModal";
import DeleteCPFixedModal from "./DeleteCPFixedModal";
import React, { useEffect, useMemo, useState } from "react";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useLocale, useTranslations } from "next-intl";
import { ICPFixed } from "../../../../../../lib/types";
import { formatDate } from "../../../../../../utils";
import {
  Button,
  IconButton,
  Spinner,
} from "../../../../../../components/common";
import PaginationFooter from "../../../../../../components/common/PaginationFooter";

interface Props {
  cpsId: string;
}

enum SortBy {
  NONE = "none",
  USERNAME = "username",
  NAME = "name",
  LAST = "last",
  COUNTRY = "country",
  CREATED_DATE = "created_date",
  START_DATE = "start_date",
  END_DATE = "end_date",
}

export function ListCPFixed({ cpsId }: Props) {
  const t = useTranslations();
  const locale = useLocale();

  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const counter = 10;
  const resultsPerPage = 10;
  const finalPage =
    counter < currentPage * resultsPerPage
      ? counter
      : currentPage * resultsPerPage;

  const { data, isError, isLoading, refetch } = useFetchCPFixed(
    cpsId,
    currentPage,
    resultsPerPage
  );

  const [cpFixed, setCPFixed] = useState<ICPFixed[]>(data ?? []);

  const editColor = { filled: "#90470b", unfilled: "grey" };
  const deleteColor = { filled: "#90470b", unfilled: "grey" };

  const [isEditModal, setIsEditModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const [selectedCP, setSelectedCP] = useState<ICPFixed>();

  useEffect(() => {
    refetch().then((res) => {
      const cpFixed = res.data as ICPFixed[];
      setCPFixed(cpFixed);
    });
  }, [currentPage]);

  const filteredItems = useMemo<ICPFixed[]>(() => {
    if (!data) return [];
    return data.filter((fixed) => {
      return fixed.cp_name.toLowerCase().includes(query.toLowerCase());
    });
  }, [data, cpFixed, query]);

  const sortedItems = useMemo(() => {
    if (sorting === SortBy.NONE) return filteredItems;

    const compareProperties: Record<string, (cp: ICPFixed) => any> = {
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

  const handleEditClick = async (cp: ICPFixed) => {
    setSelectedCP(cp);
    setIsEditModal(true);
  };

  const handleDeleteClick = async (cp: ICPFixed) => {
    setIsDeleteModal(true);
    setSelectedCP(cp);
  };

  const handleEditModal = (isEdit: boolean) => {
    setIsEditModal(isEdit);
  };

  return (
    <div className="relative overflow-x-auto px-6 py-4 shadow-md sm:rounded-lg ">
      {/* Don't remove isEditModal or the selectedCP will not be updated when changed from selected CP  */}
      {isEditModal && selectedCP && (
        <EditCPFixedModal
          selectedCP={selectedCP}
          isEditModal={isEditModal}
          handleEditModal={handleEditModal}
        />
      )}

      {isDeleteModal && selectedCP && (
        <DeleteCPFixedModal
          selectedCPId={selectedCP.id}
          isDeleteModal={isDeleteModal}
          handleDeleteModal={setIsDeleteModal}
        />
      )}

      {isError && (
        <div className="flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            {t("error_fetching_cp_fixed")}
          </p>
        </div>
      )}

      {isLoading && (
        <Spinner color="beer-blonde" size="xLarge" absolute center />
      )}

      {!isError && !isLoading && sortedItems.length === 0 ? (
        <div className="flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">{t("no_cp_fixed")}</p>
        </div>
      ) : (
        <>
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

            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="mb-6 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-beer-blonde focus:ring-beer-blonde  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder={t("search_by_name")}
            />
          </div>

          <table className="w-full text-center text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr className="w-full">
                <th
                  scope="col"
                  className="px-6 py-3 hover:cursor-pointer"
                  onClick={() => {
                    handleChangeSort(SortBy.NAME);
                  }}
                >
                  {t("name_header")}
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 hover:cursor-pointer"
                  onClick={() => {
                    handleChangeSort(SortBy.CREATED_DATE);
                  }}
                >
                  {t("created_date_header")}
                </th>

                <th scope="col" className="px-6 py-3 ">
                  {t("action_header")}
                </th>
              </tr>
            </thead>

            <tbody className="w-full">
              {sortedItems.map((cp: ICPFixed) => {
                return (
                  <tr
                    key={cp.id}
                    className="w-full border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <td className="px-6 py-4 font-semibold text-beer-blonde hover:cursor-pointer hover:text-beer-draft">
                      <Link
                        target={"_blank"}
                        href={`/consumption_points/fixed?id=${cp.id}`}
                        locale={locale}
                      >
                        {cp.cp_name}
                      </Link>
                    </td>

                    <td className="px-6 py-4">{formatDate(cp.created_at)}</td>

                    <td className="flex items-center justify-center px-6 py-4">
                      <IconButton
                        icon={faEdit}
                        onClick={() => {
                          handleEditClick(cp);
                        }}
                        color={editColor}
                        classContainer={
                          "hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full"
                        }
                        classIcon={""}
                        title={t("edit")}
                      />

                      <IconButton
                        icon={faTrash}
                        onClick={() => {
                          handleDeleteClick(cp);
                        }}
                        color={deleteColor}
                        classContainer={
                          "hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full "
                        }
                        classIcon={""}
                        title={t("delete")}
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
    </div>
  );
}
