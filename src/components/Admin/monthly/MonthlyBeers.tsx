import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { IMonthlyProduct } from "../../../lib/types";
import { supabase } from "../../../utils/supabaseClient";
import { DeleteButton, EditButton } from "../../common";

interface Props {
  products: IMonthlyProduct[];
}

interface ColumnsProps {
  header: string;
}

export default function MonthlyBeers({ products: p }: Props) {
  const { t } = useTranslation();

  const [products, setProducts] = useState<IMonthlyProduct[]>(p);
  const [query, setQuery] = useState("");

  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(0);

  const COLUMNS = [
    { header: t("product_type_header") },
    { header: t("name_header") },
    { header: t("stock_header") },
    { header: t("lot_header") },
    { header: t("public_header") },
    { header: t("action_header") },
  ];

  const filteredItems = useMemo<IMonthlyProduct[]>(() => {
    if (!products) return [];
    return products.filter((product) => {
      return product.product_id.name
        .toLowerCase()
        .includes(query.toLowerCase());
    });
  }, [products, query]);

  useEffect(() => {
    if (month > 0 && year > 0) {
      const fetchByMonthAndYear = async () => {
        const { data, error } = await supabase
          .from("monthly_products")
          .select(
            `
        *
        `
          )
          .eq("month", month)
          .eq("year", year);

        if (error) throw error;

        setProducts(data[0]);
      };

      fetchByMonthAndYear();
    }
  }, [month, year]);

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg mt-6 p-4 space-y-4">
      {/* Select month and year to see the products */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row items-center">
          {/* Month */}
          <div className="flex flex-row items-center">
            <label htmlFor="month" className="mr-2">
              {t("month")}
            </label>
            <select
              id="month"
              name="month"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-beer-blonde focus:border-beer-blonde block w-24 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
            >
              <option value="0">{t("select_month")}</option>
              <option value="1">{t("january")}</option>
              <option value="2">{t("february")}</option>
              <option value="3">{t("march")}</option>
              <option value="4">{t("april")}</option>
              <option value="5">{t("may")}</option>
              <option value="6">{t("june")}</option>
              <option value="7">{t("july")}</option>
              <option value="8">{t("august")}</option>
              <option value="9">{t("september")}</option>
              <option value="10">{t("october")}</option>
              <option value="11">{t("november")}</option>
              <option value="12">{t("december")}</option>
            </select>
          </div>

          {/* Year */}
          <div className="flex flex-row items-center ml-4">
            <label htmlFor="year" className="mr-2">
              {t("year")}
            </label>
            <select
              id="year"
              name="year"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-beer-blonde focus:border-beer-blonde block w-24 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="0">{t("select_year")}</option>
              <option value="1">{t("2023")}</option>
              <option value="2">{t("2024")}</option>
              <option value="3">{t("2025")}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search input  */}
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

      {/* Monthly product table  */}
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
          {products &&
            filteredItems.map((product) => {
              return (
                <tr
                  key={product.id}
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

                  <td className="py-4 px-6 text-beer-blonde font-semibold hover:text-beer-draft">
                    <Link href={`/products/${product.id}`}>
                      {product.product_id.name}
                    </Link>
                  </td>

                  <td className="py-4 px-6"></td>

                  <td className="py-4 px-6"></td>

                  <td className="py-4 px-6"></td>

                  <td className="py-4 px-6">
                    <div className="flex space-x-1">
                      <EditButton
                        onClick={() => {
                          console.log("edit");
                        }}
                      />

                      <DeleteButton
                        onClick={() => {
                          console.log("delete");
                        }}
                      />
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
