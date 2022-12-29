import { Button } from "@supabase/ui";
import { t } from "i18next";
import Image from "next/image";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Beer } from "../../../types";

interface Props {
  beers: Beer[];
  handleEditShowModal: React.Dispatch<React.SetStateAction<any>>;
  handleDeleteShowModal: React.Dispatch<React.SetStateAction<any>>;
  handleBeerModal: React.Dispatch<React.SetStateAction<any>>;
}

interface ColumnsProps {
  header: string;
}

export default function ProductList(props: Props) {
  const { t } = useTranslation();

  const { beers, handleEditShowModal, handleDeleteShowModal, handleBeerModal } =
    props;

  const COLUMNS = [
    { header: t("product_type_header") },
    { header: t("name_header") },
    { header: t("price_header") },
    { header: t("stock_header") },
    { header: t("lot_header") },
    { header: t("public_header") },
    { header: t("action_header") },
  ];

  const handleClickEdit = (beer: Beer) => {
    handleEditShowModal(true);
    handleDeleteShowModal(false);
    handleBeerModal(beer);
  };

  const handleClickDelete = (beer: Beer) => {
    handleEditShowModal(false);
    handleDeleteShowModal(true);
    handleBeerModal(beer);
  };

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg mt-6">
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
          {beers &&
            beers.map((beer) => {
              return (
                <tr
                  key={beer.id}
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
                      src="/beer-icons-240.png"
                      alt="Neil image"
                    />
                  </th>
                  <td className="py-4 px-6">{beer.name}</td>
                  <td className="py-4 px-6">{beer.intensity}</td>
                  <td className="py-4 px-6">{beer.color}</td>
                  <td className="py-4 px-6">{beer.color}</td>
                  <td className="py-4 px-6">
                    <div className="flex">
                      <Button
                        onClick={() => handleClickEdit(beer)}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-2 w-[45px]"
                      >
                        <Image
                          width={45}
                          height={45}
                          alt="Edit"
                          src="/icons/edit-240.png"
                        />{" "}
                      </Button>

                      <Button
                        danger
                        onClick={() => handleClickDelete(beer)}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline w-[45px]"
                      >
                        <Image
                          width={45}
                          height={45}
                          alt="Delete"
                          src="/icons/delete-240.png"
                        />
                      </Button>
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
