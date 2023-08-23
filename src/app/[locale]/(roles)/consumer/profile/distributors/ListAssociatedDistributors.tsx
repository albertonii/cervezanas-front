import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";
import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  IconButton,
  Spinner,
} from "../../../../../../components/common";
import useFetchDistributors from "../../../../../../hooks/useFetchDistributors";
import { IDistributorUser, SortBy } from "../../../../../../lib/types";
import { formatDate } from "../../../../../../utils";

export default function ListAssociatedDistributors() {
  const t = useTranslations();

  const [currentPage, setCurrentPage] = useState(1);

  const [query, setQuery] = useState("");
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const [selectedDistributor, setSelectedDistributor] =
    useState<IDistributorUser>();

  const deleteColor = { filled: "#90470b", unfilled: "grey" };
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const count = 1;
  const resultsPerPage = 10;
  const finalPage =
    count < currentPage * resultsPerPage ? count : currentPage * resultsPerPage;

  /* Fetch the distributors that the user can be associated  */
  const {
    data: distributors,
    isError,
    isLoading,
    refetch,
  } = useFetchDistributors();

  const [listDistributors, setListDistributors] = useState(distributors ?? []);

  useEffect(() => {
    refetch().then((res: any) => {
      const ds = res.data ?? [];
      setListDistributors(ds);
    });
  }, [currentPage]);

  const filteredItems = useMemo<IDistributorUser[]>(() => {
    if (!distributors) return [];
    return distributors.filter((d) => {
      return d.user.username.toLowerCase().includes(query.toLowerCase());
    });
  }, [distributors, query]);

  const sortedItems = useMemo(() => {
    if (sorting === SortBy.NONE) return filteredItems;

    const compareProperties: Record<string, (d: IDistributorUser) => any> = {
      [SortBy.USERNAME]: (d) => d.user.username,
      [SortBy.CREATED_DATE]: (d) => d.created_at,
    };

    return filteredItems.toSorted(
      (a: IDistributorUser, b: IDistributorUser) => {
        const extractProperty = compareProperties[sorting];
        return extractProperty(a).localeCompare(extractProperty(b));
      }
    );
  }, [filteredItems, sorting]);

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort);
  };

  const handleDeleteClick = async (distributor: IDistributorUser) => {
    setIsDeleteModal(true);
    setSelectedDistributor(distributor);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(count / resultsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="relative overflow-x-auto px-6 py-4 shadow-md sm:rounded-lg ">
      {/* 
      {isDeleteModal && selectedCP && (
        <DeleteCPMobileModal
          selectedCPId={selectedCP.id}
          isDeleteModal={isDeleteModal}
          handleDeleteModal={handleDeleteModal}
        />
      )} */}

      {isError && (
        <div className="flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            {t("error_fetching_cp_mobile")}
          </p>
        </div>
      )}

      {isLoading && (
        <Spinner color="beer-blonde" size="xLarge" absolute center />
      )}

      {!isError && !isLoading && sortedItems.length === 0 ? (
        <div className="flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            {t("no_cp_mobile")}
          </p>
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

          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
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

            <tbody>
              {sortedItems.map((distributor: IDistributorUser) => {
                return (
                  <tr
                    key={distributor.id}
                    className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <td className="px-6 py-4 font-semibold text-beer-blonde hover:cursor-pointer hover:text-beer-draft">
                      {distributor.user.username}
                    </td>

                    <td className="px-6 py-4">
                      {formatDate(distributor.created_at)}
                    </td>

                    <td className="flex space-x-2 px-6 py-4">
                      <IconButton
                        icon={faTrash}
                        onClick={() => {
                          handleDeleteClick(distributor);
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
            <Button class="" onClick={() => handlePrevPage()} small primary>
              {t("prev")}
            </Button>

            <p className="text-sm text-gray-700 dark:text-gray-400">
              {t("pagination_footer_nums", {
                from: currentPage,
                to: finalPage,
                total: count,
              })}
            </p>

            <Button class="" onClick={() => handleNextPage()} small primary>
              {t("next")}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
