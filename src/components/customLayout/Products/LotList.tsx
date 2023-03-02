import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ProductLot } from "../../../lib/types";
import { formatDateString } from "../../../utils";
import { DeleteButton } from "../../common";
import { EditButton } from "../../common/EditButton";

interface Props {
  lots: ProductLot[];
  handleEditShowModal: React.Dispatch<React.SetStateAction<any>>;
  handleDeleteShowModal: React.Dispatch<React.SetStateAction<any>>;
  handleProductLotModal: React.Dispatch<React.SetStateAction<any>>;
}

interface ColumnsProps {
  header: string;
}

export function LotList({
  lots,
  handleEditShowModal,
  handleDeleteShowModal,
  handleProductLotModal,
}: Props) {
  const { t } = useTranslation();

  const [lots_, setLots_] = useState<ProductLot[]>(lots);
  const [query, setQuery] = useState("");

  const COLUMNS = [
    { header: t("product_type_header") },
    { header: t("lot_number_header") },
    { header: t("quantity_header") },
    { header: t("manufacture_date_header") },
    { header: t("expiration_date_header") },
    { header: t("action_header") },
  ];

  const handleClickEdit = (lot: ProductLot) => {
    handleEditShowModal(true);
    handleDeleteShowModal(false);
    handleProductLotModal(lot);
  };

  const handleClickDelete = (lot: ProductLot) => {
    handleEditShowModal(false);
    handleDeleteShowModal(true);
    handleProductLotModal(lot);
  };

  useEffect(() => {
    setLots_(lots);
  }, [lots]);

  const filteredItems = useMemo(() => {
    return lots_.filter((lot) => {
      return lot.lot_name.toLowerCase().includes(query.toLowerCase());
    });
  }, [lots_, query]);

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg mt-6">
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
          placeholder="Search lot..."
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

        <tbody>
          {lots_ &&
            filteredItems.map((lot) => {
              return (
                <tr
                  key={lot.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <Image
                      width={128}
                      height={128}
                      className="w-8 h-8 rounded-full"
                      src="/icons/beer-240.png"
                      alt="Beer Type"
                    />
                  </th>

                  <td className="py-4 px-6">{lot.lot_name}</td>

                  <td className="py-4 px-6">{lot.quantity}</td>

                  <td className="py-4 px-6">
                    {formatDateString(lot.manufacture_date.toString())}
                  </td>

                  <td className="py-4 px-6">
                    {formatDateString(lot.expiration_date.toString())}
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex space-x-1">
                      <EditButton onClick={() => handleClickEdit(lot)} />

                      <DeleteButton onClick={() => handleClickDelete(lot)} />
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
