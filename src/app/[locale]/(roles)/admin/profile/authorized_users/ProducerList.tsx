"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import { faCancel, faCheck, faUser } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../../Auth/useAuth";
import { useLocale, useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDateString } from "../../../../../../utils/formatDate";
import { IconButton } from "../../../../components/common/IconButton";
import { IProducerUser } from "../../../../../../lib/types";
import InputSearch from "../../../../components/common/InputSearch";
import dynamic from "next/dynamic";

enum SortBy {
  NONE = "none",
  USERNAME = "username",
  CREATED_DATE = "created_date",
}

const DynamicModal = dynamic(
  () => import("../../../../components/modals/Modal"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

interface Props {
  producers: IProducerUser[];
}

export default function ProducerList({ producers }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const [query, setQuery] = useState("");

  const { user, supabase } = useAuth();

  const acceptColor = { filled: "#90470b", unfilled: "grey" };
  const rejectColor = { filled: "red", unfilled: "grey" };

  const [isAcceptModal, setIsAcceptModal] = useState(false);
  const [isRejectModal, setIsRejectModal] = useState(false);

  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const [selectedProducer, setSelectedProducer] = useState<IProducerUser>();

  const filteredItems: IProducerUser[] = useMemo<IProducerUser[]>(() => {
    return producers.filter((producer) => {
      return producer.users?.username
        .toLowerCase()
        .includes(query.toLowerCase());
    });
  }, [producers, query]);

  const sortedItems = useMemo(() => {
    if (sorting === SortBy.NONE) return filteredItems;

    const compareProperties: Record<string, (producer: IProducerUser) => any> =
      {
        [SortBy.USERNAME]: (producer) => producer.users?.username,
      };

    return filteredItems.toSorted((a, b) => {
      const extractProperty = compareProperties[sorting];
      return extractProperty(a).localeCompare(extractProperty(b));
    });
  }, [filteredItems, sorting]);

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort);
  };

  const handleApproveClick = async (producer: IProducerUser) => {
    setIsAcceptModal(true);

    await supabase
      .from("producer_user")
      .update({ is_authorized: true })
      .eq("user", producer.user)
      .then(() => {
        setIsAcceptModal(false);

        sendNotification(
          `Your request to become a producer has been accepted.`
        );
      });
  };

  const handleRejectClick = async (producer: IProducerUser) => {
    setIsRejectModal(true);

    await supabase
      .from("producer_user")
      .update({ is_authorized: false })
      .eq("user", producer.user)
      .then(() => {
        setIsRejectModal(false);

        sendNotification(
          `Your request to become a producer has been rejected.`
        );
      });
  };

  const sendNotification = async (message: string) => {
    // Notify user that has been accepted/rejected has a producer
    const { error } = await supabase.from("notifications").insert({
      message: `${message}`,
      user_id: selectedProducer?.user,
      link: `${selectedProducer?.users?.role}/profile?a=settings`,
      source: user?.id, // User that has created the consumption point
    });
    if (error) {
      throw error;
    }
  };

  return (
    <section className="relative overflow-x-auto px-6 py-4 shadow-md sm:rounded-lg ">
      {selectedProducer && isAcceptModal && (
        <DynamicModal
          title={t("accept")}
          icon={faCheck}
          color={acceptColor}
          handler={async () => {
            handleApproveClick(selectedProducer);
          }}
          handlerClose={() => setIsAcceptModal(false)}
          showModal={isAcceptModal}
          setShowModal={setIsAcceptModal}
          description={"authorize_producer_description_modal"}
          classIcon={""}
          classContainer={""}
          btnTitle={t("accept")}
        >
          <></>
        </DynamicModal>
      )}

      {selectedProducer && isRejectModal && (
        <DynamicModal
          title={t("reject")}
          icon={faCheck}
          color={acceptColor}
          handler={async () => {
            handleRejectClick(selectedProducer);
          }}
          handlerClose={() => setIsRejectModal(false)}
          showModal={isRejectModal}
          setShowModal={setIsRejectModal}
          description={t("unauthorize_producer_description_modal")}
          classIcon={""}
          classContainer={""}
          btnTitle={t("accept")}
        >
          <></>
        </DynamicModal>
      )}

      <InputSearch
        query={query}
        setQuery={setQuery}
        searchPlaceholder={"search_products"}
      />

      <table className="w-full text-center text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3 hover:cursor-pointer">
              -
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
              {t("status_header")}
            </th>

            <th scope="col" className="px-6 py-3 ">
              {t("action_header")}
            </th>
          </tr>
        </thead>

        <tbody>
          {sortedItems.map((producer) => {
            return (
              <tr
                key={producer.user}
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
                  <Link href={`/d-info/${producer.users?.id}`} locale={locale}>
                    {producer.users?.username}
                  </Link>
                </td>

                <td className="px-6 py-4">
                  {formatDateString(producer.created_at)}
                </td>

                <td
                  className={`${
                    producer.is_authorized && "font-semibold text-beer-gold"
                  } cursor-pointer truncate px-6 py-4`}
                >
                  {producer.is_authorized ? t("authorized") : t("pending")}
                </td>
                <td className="flex items-center justify-center px-6 py-4">
                  <IconButton
                    icon={faCheck}
                    onClick={() => {
                      setSelectedProducer(producer);
                      setIsAcceptModal(true);
                    }}
                    color={acceptColor}
                    classContainer={
                      "hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full !m-0"
                    }
                    classIcon={""}
                    title={t("accept")}
                  />
                  <IconButton
                    icon={faCancel}
                    onClick={() => {
                      setSelectedProducer(producer);
                      setIsRejectModal(true);
                    }}
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
    </section>
  );
}