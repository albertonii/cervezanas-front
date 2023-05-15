"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface Props {
  list: any[];
  form: UseFormReturn<any, any>;
}

export function SearchCheckboxList({ list, form }: Props) {
  const { t } = useTranslation();

  const { register } = form;

  return (
    <div className="space-y my-6 w-full">
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
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-beer-blonde focus:ring-beer-blonde  dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-beer-blonde dark:focus:ring-beer-blonde"
              placeholder={t("search_products") ?? "Search products"}
            />
          </div>
        </div>

        <ul
          className="h-48 overflow-y-auto px-3 pb-3 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownSearchButton"
        >
          {list.map((product, index) => {
            return (
              <li key={product.id}>
                <div className="flex items-center rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                  <input
                    id="checkbox-item-11"
                    type="checkbox"
                    {...register(`products.${index}.value`)}
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
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
