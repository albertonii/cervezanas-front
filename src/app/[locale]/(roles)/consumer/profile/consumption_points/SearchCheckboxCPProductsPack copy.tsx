"use client";

import PaginationFooter from "../../../../components/common/PaginationFooter";
import useFetchProductsByOwner from "../../../../../../hooks/useFetchProductsByOwnerAndPagination";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "../../../../Auth/useAuth";
import { Spinner } from "../../../../components/common";
import { IProduct } from "../../../../../../lib/types";
import { Format } from "../../../../../../lib/beerEnum";

interface ColumnsProps {
  header: string;
}
interface Props {
  form: UseFormReturn<any, any>;
}

export function SearchCheckboxCPProductsPack({ form }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const { user } = useAuth();

  const [products, setProducts] = useState<IProduct[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const fixedCount = products.length;
  const resultsPerPage = 10;

  const { register } = form;

  const { isLoading, refetch } = useFetchProductsByOwner(
    user?.id,
    currentPage,
    resultsPerPage,
    false
  );

  useEffect(() => {
    refetch().then((res) => {
      const products = res.data as IProduct[];
    });
  }, [currentPage]);

  const COLUMNS = [
    { header: t("name_header") },
    { header: t("brand_header") },
    { header: t("format_header") },
    { header: t("capacity_header") },
  ];

  if (isLoading) {
    return <Spinner color="beer-blonde" size="xLarge" absolute center />;
  }

  return (
    <>
      <div className="my-6 w-full">
        <div className=" z-10 w-full rounded bg-white shadow dark:bg-gray-700">
          <div className="p-3">
            <label className="sr-only">{t("search")}</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
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
                type="text"
                id="input-group-search"
                className="mb-6 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-beer-blonde focus:ring-beer-blonde  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder={t("search_cp_products")}
              />
            </div>
          </div>

          <table className="w-full text-center text-sm text-gray-500 dark:text-gray-400 ">
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
              {products &&
                products.map((product, index) => {
                  return (
                    <>
                      <tr
                        key={product.id}
                        className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                      >
                        {/* <th
                          scope="row"
                          className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                        >
                          <input
                            id="checkbox-item"
                            type="checkbox"
                            {...register(`product_items.${index}.id`)}
                            value={product.id}
                            className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                          />
                        </th> */}

                        <td className="px-6 py-4 font-semibold text-beer-gold hover:text-beer-draft">
                          <Link
                            href={`/products/${product.id}`}
                            target={"_blank"}
                            locale={locale}
                          >
                            {product.name}
                          </Link>
                        </td>

                        <td className="px-6 py-4">[Marca del producto]</td>

                        <td className="px-6 py-4">
                          {t(product.beers[0]?.format ?? "")}
                        </td>

                        <td className="text-balan px-6 py-4">
                          {t(product.beers[0]?.volume ?? "")}{" "}
                          {product.beers[0]?.format === Format.draft.toString()
                            ? "l"
                            : "ml"}
                        </td>
                      </tr>

                      <tr>
                        <td>
                          {/* Product packs is displays: Pack name, quantity of packs, price */}

                          {product.product_packs
                            .sort((a, b) => a.quantity - b.quantity) // Sort by quantity
                            .map((pack) => {
                              return (
                                <div key={pack.id}>
                                  <input
                                    id={`checkbox-pack-${pack.id}`}
                                    type="checkbox"
                                    {...register(`product_items.${index}.id`)}
                                    value={product.id}
                                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                                    // checked={selectedPacks[product.id]?.includes(
                                    //   pack.id
                                    // )}
                                    // onChange={(e) =>
                                    //   handleCheckboxChange(
                                    //     product.id,
                                    //     pack.id,
                                    //     e.target.checked
                                    //   )
                                    // }
                                  />

                                  <label
                                    htmlFor={`checkbox-pack-${pack.id}`}
                                    className="ml-2 w-full rounded text-sm font-medium text-gray-900 dark:text-gray-300"
                                  >
                                    {pack.name}
                                  </label>
                                </div>
                              );
                            })}
                        </td>
                      </tr>
                    </>
                  );
                })}
            </tbody>
          </table>

          <PaginationFooter
            counter={fixedCount}
            resultsPerPage={resultsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />

          {/* <ul
            className="h-48 overflow-y-auto px-3 pb-3 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownSearchButton"
          >
            {products.map((product, index) => {
              return (
                <li key={product.id}>
                  <div className="flex items-center justify-between rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                    <div>
                      <input
                        id="checkbox-item-11"
                        type="checkbox"
                        {...register(`products.${index}.id`)}
                        value={product.id}
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                      />
                      <label
                        htmlFor={`products.${index}.value`}
                        className="ml-2 w-full rounded text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {product.name}
                      </label>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul> */}
        </div>
      </div>
    </>
  );
}
