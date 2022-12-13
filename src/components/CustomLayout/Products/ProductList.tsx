import { Button } from "@supabase/ui";
import Image from "next/image";
import React, { useState } from "react";

interface Props {
  beers: Beer[];
  handleShowModal: React.Dispatch<React.SetStateAction<any>>;
  handleBeerModal: React.Dispatch<React.SetStateAction<any>>;
}

interface Beer {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  social_cause_id: number;
  lot_id: number;
  type: number;
  feedback_id: number;
  category: number;
  intensity: string;
  fermentation: string;
  color: string;
  origin: string;
  family: string;
  era: string;
  aroma: string;
  format: string;
  awards_id: string;
  campaign: string;
  is_gluten: boolean;
  owner_id: string;
}

interface ColumnsProps {
  header: string;
}

const COLUMNS = [
  { header: "Product Type" },
  { header: "Name" },
  { header: "Precio" },
  { header: "Stock" },
  { header: "Lote" },
  { header: "Acción" },
];

export default function ProductList(props: Props) {
  const { beers, handleShowModal, handleBeerModal } = props;

  const handleClickEdit = (beer: Beer) => {
    handleShowModal(true);
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
                    <Button
                      onClick={() => handleClickEdit(beer)}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
