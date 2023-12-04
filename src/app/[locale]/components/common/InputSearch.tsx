import { useTranslations } from "next-intl";
import React from "react";

interface Props {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

export default function InputSearch({ query, setQuery }: Props) {
  const t = useTranslations();

  return (
    <input
      type="search"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="mb-6 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-beer-blonde focus:ring-beer-blonde  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      placeholder={t("search_by_name")}
    />
  );
}
