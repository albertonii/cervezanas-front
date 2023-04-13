import Link from "next/link";
import React, { useMemo, useState } from "react";
import { faEdit, faLocation, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { ICPFixed } from "../../../lib/types";
import { formatDate } from "../../../utils";
import { IconButton } from "../../common";

interface ColumnsProps {
  header: string;
}
interface Props {
  cpFixed: ICPFixed[];
}

export default function ListCPFixed({ cpFixed }: Props) {
  const [query, setQuery] = useState("");

  const [fixedList, setFixedList] = useState(cpFixed);

  const { t } = useTranslation();
  const editColor = { filled: "#90470b", unfilled: "grey" };
  const deleteColor = { filled: "#90470b", unfilled: "grey" };

  const COLUMNS = [
    { header: "" },
    { header: t("name_header") },
    { header: t("created_date_header") },
    { header: t("") },
    { header: t("") },
    { header: t("action_header") },
  ];

  // Remove from fixed list
  const removeFromFixedList = (id: string) => {
    const newList = fixedList.filter((item) => item.id !== id);
    setFixedList(newList);
  };

  // Add to fixed list
  const addToFixedList = (fixed: ICPFixed) => {
    const newList = [...fixedList, fixed];
    setFixedList(newList);
  };

  const filteredItems = useMemo<ICPFixed[]>(() => {
    return fixedList.filter((fixed) => {
      return fixed.cp_name.toLowerCase().includes(query.toLowerCase());
    });
  }, [fixedList, query]);

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg px-6 py-4 ">
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
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
          className="mb-6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-beer-blonde focus:border-beer-blonde block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search products..."
        />
      </div>

      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {COLUMNS.map((column: ColumnsProps, index: number) => {
              return (
                <th key={index} scope="col" className="py-3 px-6">
                  {column.header}
                </th>
              );
            })}
          </tr>
        </thead>

        {fixedList.map((cp) => {
          return (
            <tbody key={cp.id}>
              {filteredItems.map((cp) => {
                return (
                  <tr
                    key={cp.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <FontAwesomeIcon
                        icon={faLocation}
                        style={{ color: "#fdc300" }}
                        title={"fixed_location"}
                        width={80}
                        height={80}
                      />
                    </th>

                    <td className="py-4 px-6 text-beer-blonde font-semibold hover:text-beer-draft">
                      <Link href={`/cp_name`}>{cp.cp_name}</Link>
                    </td>

                    <td className="py-4 px-6">{formatDate(cp.created_at)}</td>

                    <td className="py-4 px-6 cursor-pointer"></td>

                    <td className="py-4 px-6 cursor-pointer"></td>

                    <td className="py-4 px-6 flex ">
                      <IconButton
                        icon={faEdit}
                        onClick={() => {}}
                        color={editColor}
                        classContainer={
                          "hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full !m-0"
                        }
                        classIcon={""}
                        title={t("edit")!}
                      />
                      <IconButton
                        icon={faTrash}
                        onClick={() => {}}
                        color={deleteColor}
                        classContainer={
                          "hover:bg-beer-foam transition ease-in duration-300 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full !m-0 "
                        }
                        classIcon={""}
                        title={t("delete")!}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          );
        })}
      </table>
    </div>
  );
}
