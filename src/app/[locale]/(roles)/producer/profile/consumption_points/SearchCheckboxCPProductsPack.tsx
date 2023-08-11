"use client";

import PaginationFooter from "../../../../../../components/common/PaginationFooter";
import useFetchProductsByOwner from "../../../../../../hooks/useFetchProductsByOwnerAndPagination";
import ProductAccordion from "./ProductAccordion";
import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useAuth } from "../../../../../../components/Auth";
import { Spinner } from "../../../../../../components/common";
import { IProduct } from "../../../../../../lib/types";

interface Props {
  form: UseFormReturn<any, any>;
  productItems?: string[];
}

export function SearchCheckboxCPProductsPack({ form, productItems }: Props) {
  const t = useTranslations();
  const { user } = useAuth();

  const [products, setProducts] = useState<IProduct[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const fixedCount = products.length;
  const resultsPerPage = 10;

  const { isLoading, refetch } = useFetchProductsByOwner(
    user?.id,
    currentPage,
    resultsPerPage,
    false
  );

  useEffect(() => {
    refetch().then((res) => {
      const products = res.data as IProduct[];
      setProducts(products);
    });
  }, [currentPage]);

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

          <ProductAccordion
            products={products}
            form={form}
            productItems={productItems}
          />

          <PaginationFooter
            counter={fixedCount}
            resultsPerPage={resultsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
}
