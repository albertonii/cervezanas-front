import { Button } from "@supabase/ui";
import Image from "next/image";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Beer } from "../../../lib/types";

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

  const [query, setQuery] = React.useState("");

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

  const filteredItems = useMemo(() => {
    return beers.filter((beer) => {
      return beer.name.toLowerCase().includes(query.toLowerCase());
    });
  }, [beers, query]);

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

        <tbody>
          {beers &&
            filteredItems.map((beer) => {
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
                      src="/icons/beer-icons-240.png"
                      alt="Beer Type"
                    />
                  </th>

                  <td className="py-4 px-6">{beer.name}</td>

                  <td className="py-4 px-6">{beer.price}</td>

                  <td className="py-4 px-6">
                    {beer.product_inventory[0]?.quantity
                      ? beer.product_inventory[0].quantity
                      : "-"}
                  </td>

                  <td className="py-4 px-6">
                    {beer.product_lot[0]?.lot_id
                      ? beer.product_lot[0]?.lot_id
                      : "-"}
                  </td>
                  <td className="py-4 px-6">
                    {beer.is_public ? t("yes") : t("no")}
                  </td>
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
