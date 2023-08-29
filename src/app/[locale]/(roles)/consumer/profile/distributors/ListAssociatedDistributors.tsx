import { faTrash, faBan } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";
import React, { useEffect, useMemo, useState } from "react";
import { IconButton, Spinner } from "../../../../../../components/common";
import PaginationFooter from "../../../../../../components/common/PaginationFooter";
import useFetchDistributors from "../../../../../../hooks/useFetchDistributors";
import { IDistributorUser_Profile } from "../../../../../../lib/types";
import { formatDate } from "../../../../../../utils";
import DeleteDistributorModal from "./DeleteDistributorModal";

enum SortBy {
  NONE = "none",
  USERNAME = "username",
  NAME = "name",
  LAST = "last",
  COUNTRY = "country",
  CREATED_DATE = "created_date",
}

export default function ListAssociatedDistributors() {
  const t = useTranslations();

  const [currentPage, setCurrentPage] = useState(1);

  const [query, setQuery] = useState("");
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const [selectedDistributor, setSelectedDistributor] =
    useState<IDistributorUser_Profile>();

  const deleteColor = { filled: "#90470b", unfilled: "grey" };
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const counter = 1;
  const resultsPerPage = 10;
  const finalPage =
    counter < currentPage * resultsPerPage
      ? counter
      : currentPage * resultsPerPage;

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

  const filteredItems = useMemo<IDistributorUser_Profile[]>(() => {
    if (!distributors) return [];
    return distributors.filter((d) => {
      return d.username.toLowerCase().includes(query.toLowerCase());
    });
  }, [distributors, query]);

  const sortedItems = useMemo(() => {
    if (sorting === SortBy.NONE) return filteredItems;

    const compareProperties: Record<
      string,
      (d: IDistributorUser_Profile) => any
    > = {
      [SortBy.USERNAME]: (d) => d.username,
      [SortBy.CREATED_DATE]: (d) => d.created_at,
    };

    return filteredItems.toSorted(
      (a: IDistributorUser_Profile, b: IDistributorUser_Profile) => {
        const extractProperty = compareProperties[sorting];
        return extractProperty(a).localeCompare(extractProperty(b));
      }
    );
  }, [filteredItems, sorting]);

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort);
  };

  const handleDeleteClick = async (distributor: IDistributorUser_Profile) => {
    setIsDeleteModal(true);
    setSelectedDistributor(distributor);
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

  const handleCancelContractClick = async (
    distributor: IDistributorUser_Profile
  ) => {
    setIsDeleteModal(true);
  };

  return (
    <div className="relative space-y-4 overflow-x-auto px-6 py-4 shadow-md sm:rounded-lg">
      <h2 className="text-2xl">{t("distributors_list")}</h2>

      {isDeleteModal && selectedDistributor && (
        <DeleteDistributorModal
          selectedDistributor={selectedDistributor.id}
          isDeleteModal={isDeleteModal}
          handleDeleteModal={() => setIsDeleteModal(false)}
        />
      )}

      {isError && (
        <div className="flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            {t("error_fetching_distributors")}
          </p>
        </div>
      )}

      {isLoading && (
        <Spinner color="beer-blonde" size="xLarge" absolute center />
      )}

      {!isError && !isLoading && filteredItems.length === 0 ? (
        <div className="flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            {t("no_distributors")}
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

          <table className="w-full text-center text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 hover:cursor-pointer"
                  onClick={() => {
                    // handleChangeSort(SortBy.NAME);
                  }}
                >
                  {t("name_header")}
                </th>

                <th
                  className="px-6 py-3 hover:cursor-pointer"
                  onClick={() => {
                    // handleChangeSort(SortBy.CREATED_DATE);
                  }}
                >
                  {t("created_date_header")}
                </th>

                <th className="px-6 py-3 hover:cursor-pointer">
                  {t("status_header")}
                </th>

                <th scope="col" className="px-6 py-3 ">
                  {t("action_header")}
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map((distributor: IDistributorUser_Profile) => {
                return (
                  <tr
                    key={distributor.id}
                    className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <td className="px-6 py-4 font-semibold text-beer-blonde hover:cursor-pointer hover:text-beer-draft">
                      {distributor.username}
                    </td>

                    <td className="px-6 py-4">
                      {formatDate(distributor.created_at)}
                    </td>

                    <td className="px-6 py-4">{"estado del contrato"}</td>

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

                      {/* If the contract is not beign signed yet, we can cancel it  */}
                      <IconButton
                        icon={faBan}
                        onClick={() => {
                          handleCancelContractClick(distributor);
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

          <PaginationFooter
            counter={counter}
            resultsPerPage={resultsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
