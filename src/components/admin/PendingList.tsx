import { faFileArrowDown, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { resizeImage } from "next/dist/server/image-optimizer";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { IConsumptionPoints } from "../../lib/types";
import { formatDate } from "../../utils";
import { supabase } from "../../utils/supabaseClient";
import { generateDownloadableLink } from "../../utils/utils";

interface Props {
  submittedCPs: IConsumptionPoints[];
}

interface ColumnsProps {
  header: string;
}

export default function ListPendingCP({ submittedCPs }: Props) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const [hover, setHover] = useState(false);

  const COLUMNS = [
    { header: "" },
    { header: t("name_header") },
    { header: t("created_date_header") },
    { header: t("cover_letter_header") },
    { header: t("cv_header") },
    { header: t("action_header") },
  ];

  const filteredItems = useMemo<IConsumptionPoints[]>(() => {
    return submittedCPs.filter((submittedCP) => {
      return submittedCP.owner_id.username
        .toLowerCase()
        .includes(query.toLowerCase());
    });
  }, [submittedCPs, query]);

  const handleCoverLetterClick = async (cp: IConsumptionPoints) => {
    await supabase.storage
      .from("public/documents")

      .download(`cover_letter/${cp.owner_id.id}_${cp.cover_letter_name}`)
      .then((blob) => {
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

  // kvdearmedajqvexxhmrk.supabase.co/storage/v1/object/documents/cv/3edf30f7-ff32-4e1c-ac15-31ea9a7ecb29_The%20Workshopper%20Playbook%20Ebook.pdf
  // kvdearmedajqvexxhmrk.supabase.co/storage/v1/object/public/documents/cv/3edf30f7-ff32-4e1c-ac15-31ea9a7ecb29_The%20Workshopper%20Playbook%20Ebook.pdf

  https: return (
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
          className="mb-6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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

        {submittedCPs.map((cp) => {
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
                        icon={faUser}
                        style={{ color: "#fdc300" }}
                        title={"check_warning"}
                        width={80}
                        height={80}
                      />
                    </th>

                    <td className="py-4 px-6 text-beer-blonde font-semibold hover:text-beer-draft">
                      <Link href={`/products/${cp.owner_id.id}`}>
                        {cp.owner_id.username}
                      </Link>
                    </td>

                    <td className="py-4 px-6">{formatDate(cp.created_at)}</td>

                    <td className="py-4 px-6 items-center flex justify-center">
                      <FontAwesomeIcon
                        icon={faFileArrowDown}
                        style={{
                          color: "",
                          width: 30,
                          height: 30,
                        }}
                        title={"profile"}
                        onClick={() => handleCoverLetterClick(cp)}
                      />
                    </td>

                    <td className="py-4 px-6">
                      <FontAwesomeIcon
                        icon={faFileArrowDown}
                        style={{
                          color: "",
                          width: 30,
                          height: 30,
                        }}
                        title={"profile"}
                        onClick={() => handleCVClick(cp)}
                      />
                    </td>

                    <td className="py-4 px-6"></td>
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
