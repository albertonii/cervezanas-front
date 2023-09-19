"use client";

import Link from "next/link";
import ApproveContractModal from "./ApproveContractModal";
import RejectContractModal from "./RejectContractModal";
import useFetchDistributionContractsByDistributorId from "../../../../../../hooks/useFetchDistributionContractsByDistributorId";
import React, { useMemo, useState } from "react";
import { useAuth } from "../../../../Auth/useAuth";
import { IconButton } from "../../../../components/common/IconButton";
import { faCancel, faCheck } from "@fortawesome/free-solid-svg-icons";
import { IDistributionContract } from "../../../../../../lib/types.d";
import { useLocale, useTranslations } from "next-intl";
import { formatDateString } from "../../../../../../utils/formatDate";

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

export default function ListOfContracts() {
  const t = useTranslations();
  const locale = useLocale();

  const acceptColor = { filled: "#90470b", unfilled: "grey" };
  const rejectColor = { filled: "red", unfilled: "grey" };

  const [query, setQuery] = useState("");
  const { user } = useAuth();

  if (!user) return null;

  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);

  const [isApproveModal, setIsApproveModal] = useState(false);
  const [isRejectModal, setIsRejectModal] = useState(false);

  const [selectedContract, setSelectedContract] =
    useState<IDistributionContract>();

  const { data: contracts } = useFetchDistributionContractsByDistributorId(
    user?.id
  );

  const filteredItems: IDistributionContract[] = useMemo<
    IDistributionContract[]
  >(() => {
    if (!contracts) return [];

    return contracts.filter((contract: IDistributionContract) => {
      return contract.producer_id.users.username
        .toLowerCase()
        .includes(query.toLowerCase());
    });
  }, [contracts, query]);

  const sortedItems = useMemo(() => {
    if (sorting === SortBy.NONE) return filteredItems;

    const compareProperties: Record<
      string,
      (contract: IDistributionContract) => any
    > = {
      [SortBy.USERNAME]: (contract) => contract.producer_id.users.username,
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
    if (typeof contract === "boolean") return; // IDK why contract is converting to boolean
    setSelectedContract(contract);
  };

  const handleApproveModal = (value: boolean) => {
    setIsApproveModal(value);
  };

  const handleRejectClick = async (contract: IDistributionContract) => {
    setIsRejectModal(true);
    setSelectedContract(contract);

    // await supabase
    //   .from("consumption_points")
    //   .update({ cp_organizer_status: 2 })
    //   .eq("id", cp.id)
    //   .then(async () => {
    //     await supabase
    //       .from("users")
    //       .update({ cp_organizer_status: 1 })
    //       .eq("id", cp.owner_id.id);
    //   });
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
          placeholder={t("search_products")}
        />
      </div>

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
              {t("username_header")}
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

            <th scope="col" className="px-6 py-3 hover:cursor-pointer">
              {t("status_header")}
            </th>

            <th scope="col" className="px-6 py-3 ">
              {t("action_header")}
            </th>
          </tr>
        </thead>

        <tbody>
          {sortedItems.map((contract) => {
            return (
              <tr
                key={contract.distributor_id + "-" + contract.producer_id}
                className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <td className="px-6 py-4 font-semibold text-beer-blonde hover:text-beer-draft">
                  <Link
                    href={`/p-info/${contract.producer_id.user}`}
                    locale={locale}
                  >
                    {contract.producer_id.users.username}
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
                        "hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full !m-0"
                      }
                      classIcon={""}
                      title={t("accept")}
                    />
                  )}

                  {contract.distributor_accepted && (
                    <IconButton
                      icon={faCancel}
                      onClick={() => handleRejectClick(contract)}
                      color={rejectColor}
                      classContainer={
                        "hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full !m-0 "
                      }
                      classIcon={""}
                      title={t("reject")}
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
