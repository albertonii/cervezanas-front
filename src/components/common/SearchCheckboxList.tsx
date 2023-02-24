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
    <div className="w-full space-y my-6">
      <div className=" z-10 w-full bg-white rounded shadow dark:bg-gray-700">
        <div className="p-3">
          <label className="sr-only">{t("search")}</label>
          <div className="relative">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
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
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search user"
            />
          </div>
        </div>

        <ul
          className="overflow-y-auto px-3 pb-3 h-48 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownSearchButton"
        >
          {list.map((item, index) => {
            return (
              <li key={item.id}>
                <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                  <input
                    id="checkbox-item-11"
                    type="checkbox"
                    {...register(`item.${index}.value`)}
                    value={list[index].id}
                    className="w-4 h-4 text-beer-blonde bg-gray-100 rounded border-gray-300 focus:ring-beer-blonde dark:focus:ring-beer-draft dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />
                  <label
                    htmlFor={`products.${index}.value`}
                    className="ml-2 w-full text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                  >
                    {item.name}
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
