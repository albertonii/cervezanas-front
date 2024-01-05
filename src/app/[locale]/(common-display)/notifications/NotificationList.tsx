"use client";

import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { INotification } from "../../../../lib/types";
import InputSearch from "../../components/common/InputSearch";
import PaginationFooter from "../../components/common/PaginationFooter";
import NotificationTableData from "./NotificationTableData";

interface Props {
  notifications: INotification[];
}

interface ColumnsProps {
  header: string;
}

export function NotificationList({ notifications }: Props) {
  const t = useTranslations();

  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const counter = notifications.length;
  const resultsPerPage = 10;

  const COLUMNS = [
    { header: t("is_read") },
    { header: t("username") },
    { header: t("link") },
    { header: t("created_at") },
    { header: t("action_header") },
  ];

  const filteredItemsByUsername = useMemo(() => {
    if (!notifications) return [];
    return notifications.filter((notification) => {
      return notification.source_user?.username.includes(query);
    });
  }, [notifications, query]);

  return (
    <section className="relative mt-6 overflow-x-auto shadow-md sm:rounded-lg">
      <>
        <InputSearch
          query={query}
          setQuery={setQuery}
          searchPlaceholder={"search_by_name"}
        />

        <table className="w-full text-center text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {COLUMNS.map((column: ColumnsProps, index: number) => {
                return (
                  <th key={index} scope="col" className="px-6 py-3">
                    {column.header}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {filteredItemsByUsername.map((notification) => {
              return (
                <NotificationTableData
                  notification={notification}
                  key={notification.id}
                />
              );
            })}
            {!notifications && (
              <tr>
                <td colSpan={6} className="py-4 text-center">
                  {t("no_notifications")}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Prev and Next button for pagination  */}
        {/* TODO: Comprobar que funciona  */}
        <footer className="my-4 flex items-center justify-around">
          <PaginationFooter
            counter={counter}
            resultsPerPage={resultsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </footer>
      </>
    </section>
  );
}
