"use client";

import Link from "next/link";
import { IEvent } from "../../../../../../lib/types";
import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useMemo, useState } from "react";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import InputSearch from "../../../../components/common/InputSearch";
import useFetchEvents from "../../../../../../hooks/useFetchEvents";
import { IconButton } from "../../../../components/common/IconButton";
import { formatDateString } from "../../../../../../utils/formatDate";
import UpdateEventModal from "../../../../components/modals/UpdateEventModal";
import PaginationFooter from "../../../../components/common/PaginationFooter";
import DeleteCEventModal from "../../../../components/modals/DeleteEventModal";
import dynamic from "next/dynamic";

const DynamicSpinner = dynamic(
  () => import("../../../../components/common/Spinner"),
  {
    ssr: false,
  }
);

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

export default function EventList() {
  const t = useTranslations();
  const locale = useLocale();

  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const counter = 1;
  const resultsPerPage = 10;

  const { data, isError, isLoading, refetch } = useFetchEvents(
    currentPage,
    resultsPerPage
  );

  const [events, setEvents] = useState<IEvent[]>(data ?? []);

  const editColor = { filled: "#90470b", unfilled: "grey" };
  const deleteColor = { filled: "#90470b", unfilled: "grey" };

  const [isEditModal, setIsEditModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const [selectedEvent, setSelectedEvent] = useState<IEvent>();

  useEffect(() => {
    refetch().then((res: any) => {
      const events = res.data as any;
      setEvents(events);
    });
  }, [currentPage]);

  const filteredItems = useMemo<IEvent[]>(() => {
    if (!data) return [];
    return data.filter((event: IEvent) => {
      return event.name.toLowerCase().includes(query.toLowerCase());
    });
  }, [data, events, query]);

  const sortedItems = useMemo(() => {
    if (sorting === SortBy.NONE) return filteredItems;

    const compareProperties: Record<string, (event: IEvent) => any> = {
      [SortBy.NAME]: (e) => e.name,
      [SortBy.CREATED_DATE]: (e) => e.created_at,
      [SortBy.START_DATE]: (e) => e.start_date,
    };

    return filteredItems.toSorted((a, b) => {
      const extractProperty = compareProperties[sorting];
      return extractProperty(a).localeCompare(extractProperty(b));
    });
  }, [filteredItems, sorting]);

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort);
  };

  const handleEditClick = async (e: IEvent) => {
    setIsEditModal(true);
    setSelectedEvent(e);
  };

  const handleDeleteClick = async (e: IEvent) => {
    setIsDeleteModal(true);
    setSelectedEvent(e);
  };

  const handleEditModal = (isEdit: boolean) => {
    setIsEditModal(isEdit);
  };

  const handlDeleteModal = (isDelete: boolean) => {
    setIsDeleteModal(isDelete);
  };

  return (
    <div className="relative overflow-x-auto px-6 py-4 shadow-md sm:rounded-lg ">
      {isEditModal && selectedEvent && (
        <UpdateEventModal
          selectedEvent={selectedEvent}
          isEditModal={isEditModal}
          handleEditModal={handleEditModal}
        />
      )}

      {isDeleteModal && selectedEvent && (
        <DeleteCEventModal
          selectedEventId={selectedEvent.id}
          isDeleteModal={isDeleteModal}
          handleDeleteModal={handlDeleteModal}
        />
      )}

      {isError && (
        <div className="flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            {t("error_fetching_events")}
          </p>
        </div>
      )}

      {isLoading && (
        <DynamicSpinner color="beer-blonde" size="xLarge" absolute center />
      )}

      {!isError && !isLoading && sortedItems.length === 0 ? (
        <div className="flex h-40 items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">{t("no_events")}</p>
        </div>
      ) : (
        <>
          <InputSearch
            query={query}
            setQuery={setQuery}
            searchPlaceholder={"search_by_name"}
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

                <th scope="col" className="px-6 py-3 "></th>

                <th scope="col" className="px-6 py-3 "></th>

                <th scope="col" className="px-6 py-3 ">
                  {t("action_header")}
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedItems.map((e: IEvent) => {
                return (
                  <tr
                    key={e.id}
                    className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <td className="px-6 py-4 font-semibold text-beer-blonde hover:text-beer-draft">
                      <Link href={`/events/${e.id}`} locale={locale}>
                        {e.name}
                      </Link>
                    </td>

                    <td className="px-6 py-4">
                      {formatDateString(e.created_at)}
                    </td>

                    <td className="cursor-pointer px-6 py-4"></td>

                    <td className="cursor-pointer px-6 py-4"></td>

                    <td className="flex items-center justify-center px-6 py-4">
                      <IconButton
                        icon={faEdit}
                        onClick={() => {
                          handleEditClick(e);
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
                          handleDeleteClick(e);
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
