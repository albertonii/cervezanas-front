"use client";

import useFetchEventsByOwnerId from "../../../../../../hooks/useFetchEventsByOwnerId";
import DeleteCEventModal from "./DeleteEventModal";
import Link from "next/link";
import EditEventModal from "./EditEventModal";
import React, { useEffect, useMemo, useState } from "react";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useLocale, useTranslations } from "next-intl";
import { ICPMobile, IEvent } from "../../../../../../lib/types";
import { formatDate } from "../../../../../../utils";
import {
  Button,
  IconButton,
  Spinner,
} from "../../../../../../components/common";
import PaginationFooter from "../../../../../../components/common/PaginationFooter";

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

interface Props {
  cpsMobile: ICPMobile[];
}

export default function EventList({ cpsMobile }: Props) {
  const t = useTranslations();
  const locale = useLocale();

  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const counter = 1;
  const resultsPerPage = 10;

  const { data, isError, isLoading, refetch } = useFetchEventsByOwnerId(
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
    return data.filter((event) => {
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
        <EditEventModal
          selectedEvent={selectedEvent}
          isEditModal={isEditModal}
          handleEditModal={handleEditModal}
          cpsMobile={cpsMobile}
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
        <Spinner color="beer-blonde" size="xLarge" absolute center />
      )}

      {!isError && !isLoading && sortedItems.length === 0 ? (
        <div className="flex h-40 items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">{t("no_events")}</p>
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

                    <td className="px-6 py-4">{formatDate(e.created_at)}</td>

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
