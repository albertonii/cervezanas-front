"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import {
  faCancel,
  faCheck,
  faFileArrowDown,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocale, useTranslations } from "next-intl";
import { IConsumptionPoints, SortBy } from "../../../../../lib/types.d";
import { generateDownloadableLink } from "../../../../../utils/utils";
import { IconButton } from "../../../components/common";
import { Modal } from "../../../components/modals/Modal";
import { useAuth } from "../../../Auth/useAuth";
import { useSupabase } from "../../../../../context/SupabaseProvider";
import { formatDateString } from "../../../../../utils/formatDate";

interface Props {
  submittedCPs: IConsumptionPoints[];
}

export default function ListPendingCP({ submittedCPs }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const [query, setQuery] = useState("");

  const { supabase } = useSupabase();

  const { user } = useAuth();

  const [submittedList, setSubmittedList] = useState(submittedCPs);

  const acceptColor = { filled: "#90470b", unfilled: "grey" };
  const rejectColor = { filled: "red", unfilled: "grey" };

  const [isAcceptModal, setIsAcceptModal] = useState(false);
  const [isRejectModal, setIsRejectModal] = useState(false);

  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const [selectedCP, setSelectedCP] = useState<IConsumptionPoints>();

  const filteredItems: IConsumptionPoints[] = useMemo<
    IConsumptionPoints[]
  >(() => {
    return submittedList.filter((submittedCP) => {
      return submittedCP.owner_id.username
        .toLowerCase()
        .includes(query.toLowerCase());
    });
  }, [submittedList, query]);

  const sortedItems = useMemo(() => {
    if (sorting === SortBy.NONE) return filteredItems;

    const compareProperties: Record<string, (cp: IConsumptionPoints) => any> = {
      [SortBy.USERNAME]: (cp) => cp.owner_id.username,
    };

    return filteredItems.toSorted((a, b) => {
      const extractProperty = compareProperties[sorting];
      return extractProperty(a).localeCompare(extractProperty(b));
    });
  }, [filteredItems, sorting]);

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort);
  };

  // Remove from submitted list after accepting or rejecting
  const removeFromSubmittedList = (id: string) => {
    const newList = submittedList.filter((item) => item.id !== id);
    setSubmittedList(newList);
  };

  const handleCoverLetterClick = async (cp: IConsumptionPoints) => {
    await supabase.storage
      .from("public/documents")

      .download(`cover_letter/${cp.owner_id.id}_${cp.cover_letter_name}`)
      .then((blob: any) => {
        generateDownloadableLink(blob, cp.cover_letter_name);
      });
  };

  const handleCVClick = async (cp: IConsumptionPoints) => {
    await supabase.storage
      .from("public/documents")
      .download(`cv/${cp.owner_id.id}_${cp.cv_name}`)
      .then((blob: any) => {
        generateDownloadableLink(blob, cp.cv_name);
      });
  };

  const handleApproveClick = async (cp: IConsumptionPoints) => {
    setIsAcceptModal(true);
    setSelectedCP(cp);
  };

  const handleRejectClick = async (cp: IConsumptionPoints) => {
    setIsRejectModal(true);
    setSelectedCP(cp);

    await supabase
      .from("consumption_points")
      .update({ cp_organizer_status: 2 })
      .eq("id", cp.id)
      .then(async () => {
        await supabase
          .from("users")
          .update({ cp_organizer_status: 1 })
          .eq("id", cp.owner_id.id);
      });
  };

  if (submittedList.length === 0) {
    return (
      <div className="my-[10vh] flex items-center justify-center">
        <p className="text-2xl text-gray-500 dark:text-gray-400">
          {t("no_pending_cp")}
        </p>
      </div>
    );
  }
  const sendNotification = async (message: string) => {
    // Notify user that has been assigned as organizer
    const { error } = await supabase.from("notifications").insert({
      message: `${message}`,
      user_id: submittedCPs[0].owner_id.id,
      link: "/profile?a=consumption_points",
      source: user?.id, // User that has created the consumption point
    });

    if (error) {
      throw error;
    }
  };

  const handleUpdateStatus = async (status: number) => {
    supabase
      .from("consumption_points")
      .update({ cp_organizer_status: status })
      .eq("id", selectedCP?.id)
      .then(async () => {
        await supabase
          .from("users")
          .update({ cp_organizer_status: status })
          .eq("id", selectedCP?.owner_id.id);
      });
  };

  return (
    <div className="relative overflow-x-auto px-6 py-4 shadow-md sm:rounded-lg ">
      {selectedCP && isAcceptModal && (
        <Modal
          title={t("accept")}
          icon={faCheck}
          color={acceptColor}
          handler={async () => {
            handleUpdateStatus(1);
            removeFromSubmittedList(selectedCP.id);
            setIsAcceptModal(false);
            sendNotification("Your consumption point has been accepted");
          }}
          handlerClose={() => setIsAcceptModal(false)}
          showModal={isAcceptModal}
          setShowModal={setIsAcceptModal}
          description={"accept_cp_description_modal"}
          classIcon={""}
          classContainer={""}
          btnTitle={t("accept")}
        >
          <></>
        </Modal>
      )}

      {selectedCP && isRejectModal && (
        <Modal
          title={t("reject")}
          icon={faCheck}
          color={acceptColor}
          handler={async () => {
            handleUpdateStatus(2);
            removeFromSubmittedList(selectedCP.id);
            setIsRejectModal(false);
          }}
          handlerClose={() => setIsRejectModal(false)}
          showModal={isRejectModal}
          setShowModal={setIsRejectModal}
          description={t("reject_cp_description_modal")}
          classIcon={""}
          classContainer={""}
          btnTitle={t("accept")}
        >
          <></>
        </Modal>
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
            <th scope="col" className="px-6 py-3 hover:cursor-pointer">
              .
            </th>

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

            <th scope="col" className="px-6 py-3">
              {t("cover_letter_header")}
            </th>

            <th scope="col" className="px-6 py-3 ">
              {t("cv_header")}
            </th>

            <th scope="col" className="px-6 py-3 ">
              {t("action_header")}
            </th>
          </tr>
        </thead>

        <tbody>
          {sortedItems.map((cp) => {
            return (
              <tr
                key={cp.id}
                className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <th
                  scope="row"
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    style={{ color: "#fdc300" }}
                    title={"check_warning"}
                    width={80}
                    height={80}
                  />
                </th>

                <td className="px-6 py-4 font-semibold text-beer-blonde hover:text-beer-draft">
                  <Link href={`/products/${cp.owner_id.id}`} locale={locale}>
                    {cp.owner_id.username}
                  </Link>
                </td>

                <td className="px-6 py-4">{formatDateString(cp.created_at)}</td>

                <td className="cursor-pointer px-6 py-4">
                  <FontAwesomeIcon
                    icon={faFileArrowDown}
                    style={{
                      color: "",
                      width: 30,
                      height: 30,
                    }}
                    title={"download file"}
                    onClick={() => handleCoverLetterClick(cp)}
                  />
                </td>

                <td className="cursor-pointer px-6 py-4">
                  <FontAwesomeIcon
                    icon={faFileArrowDown}
                    style={{
                      color: "",
                      width: 30,
                      height: 30,
                    }}
                    title={"download file"}
                    onClick={() => handleCVClick(cp)}
                  />
                </td>

                <td className="flex items-center justify-center px-6 py-4">
                  <IconButton
                    icon={faCheck}
                    onClick={() => handleApproveClick(cp)}
                    color={acceptColor}
                    classContainer={
                      "hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full !m-0"
                    }
                    classIcon={""}
                    title={t("accept")}
                  />
                  <IconButton
                    icon={faCancel}
                    onClick={() => handleRejectClick(cp)}
                    color={rejectColor}
                    classContainer={
                      "hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full !m-0 "
                    }
                    classIcon={""}
                    title={t("reject")}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
