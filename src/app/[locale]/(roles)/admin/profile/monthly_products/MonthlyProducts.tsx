"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { IMonthlyProduct } from "../../../../../../lib/types";
import { SupabaseProps } from "../../../../../../constants";
import { useAuth } from "../../../../Auth/useAuth";
import AddMonthlyProduct from "../../../../components/modals/AddMonthlyProduct";
import InputSearch from "../../../../components/common/InputSearch";
import DisplayImageProduct from "../../../../components/common/DisplayImageProduct";
import { EditButton } from "../../../../components/common/EditButton";
import { DeleteButton } from "../../../../components/common/DeleteButton";
import { DeleteMonthlyProduct } from "../../../../components/modals/DeleteMonthlyProduct";

interface Props {
  mProducts: IMonthlyProduct[];
}

interface ColumnsProps {
  header: string;
}

const BASE_PRODUCTS_URL = SupabaseProps.BASE_PRODUCTS_URL;

export default function MonthlyBeers({ mProducts }: Props) {
  const t = useTranslations();
  const locale = useLocale();

  const { supabase } = useAuth();

  const [products, setProducts] = useState<IMonthlyProduct[]>(mProducts);
  const [query, setQuery] = useState("");

  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(0);

  const [isDeleteShowModal, setIsDeleteShowModal] = useState(false);
  const [productModal, setProductModal] = useState<IMonthlyProduct>();

  const COLUMNS = [
    { header: t("product_type_header") },
    { header: t("name_header") },
    { header: t("category") },
    { header: t("month_year") },
    { header: t("action_header") },
  ];

  const handleAddProduct = (product: IMonthlyProduct) => {
    setProducts((prev) => [...prev, product]);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const handleDeleteShowModal = (value: boolean) => {
    setIsDeleteShowModal(value);
  };

  const handleProductModal = (product: IMonthlyProduct) => {
    setProductModal(product);
  };

  const filteredItems = useMemo<IMonthlyProduct[]>(() => {
    if (!products) return [];

    return products.filter((product) => {
      return product.products?.name.toLowerCase().includes(query.toLowerCase());
    });
  }, [products, query]);

  useEffect(() => {
    if (month === 0 && year === 0) {
      const fetchByMonthAndYear = async () => {
        const { data, error } = await supabase.from("monthly_products").select(
          `
            id,
            category,
            month,
            year          `
        );

        if (error) throw error;

        const mProducts = data as IMonthlyProduct[];
        setProducts(mProducts);
      };

      fetchByMonthAndYear();
    }

    if (month > 0 && year === 0) {
      const fetchByMonthAndYear = async () => {
        const { data, error } = await supabase
          .from("monthly_products")
          .select(
            `
              id,
              category,
              month,
              year  
            `
          )
          .eq("month", month);

        if (error) throw error;

        const mProducts = data as IMonthlyProduct[];
        setProducts(mProducts);
      };

      fetchByMonthAndYear();
    }

    if (month === 0 && year > 0) {
      const fetchByMonthAndYear = async () => {
        const { data, error } = await supabase
          .from("monthly_products")
          .select(
            `
              id,
              category,
              month,
              year
            `
          )
          .eq("year", year);

        if (error) throw error;

        const mProducts = data as IMonthlyProduct[];
        setProducts(mProducts);
      };

      fetchByMonthAndYear();
    }

    if (month > 0 && year > 0) {
      const fetchByMonthAndYear = async () => {
        const { data, error } = await supabase
          .from("monthly_products")
          .select(
            `
              id,
              category,
              month,
              year
            `
          )
          .eq("month", month)
          .eq("year", year);

        if (error) throw error;

        const mProducts = data as IMonthlyProduct[];
        setProducts(mProducts);
      };

      fetchByMonthAndYear();
    }
  }, [month, year]);

  return (
    <>
      <AddMonthlyProduct handleAddProduct={handleAddProduct} />

      <section className="relative mt-6 space-y-4 overflow-x-auto p-4 shadow-md sm:rounded-lg">
        {/* Select month and year to see the products and new monthly product btn */}
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center">
            {/* Month */}
            <div className="flex flex-row items-center">
              <label htmlFor="month" className="mr-2">
                {t("month")}
              </label>
              <select
                id="month"
                name="month"
                className="block rounded-lg border border-gray-300 bg-gray-50 p-2.5 pr-8 text-sm text-gray-900 focus:border-beer-blonde focus:ring-beer-blonde  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
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
            <div className="ml-4 flex flex-row items-center">
              <label htmlFor="year" className="mr-2">
                {t("year")}
              </label>
              <select
                id="year"
                name="year"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="block rounded-lg border border-gray-300 bg-gray-50 p-2.5 pr-8 text-sm text-gray-900 focus:border-beer-blonde focus:ring-beer-blonde  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              >
                <option value="0">{t("select_year")}</option>
                <option value="2023">{t("2023")}</option>
                <option value="2024">{t("2024")}</option>
                <option value="2025">{t("2025")}</option>
              </select>
            </div>
          </div>

          {/* Add new monthly product to the list  */}
          <div className="flex flex-row justify-end"></div>
        </div>

        <InputSearch
          query={query}
          setQuery={setQuery}
          searchPlaceholder={"search_products"}
        />

        {/* Monthly product table  */}
        <table className="w-full text-center text-sm text-gray-500 dark:text-gray-400">
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
            {filteredItems &&
              filteredItems.map((product) => {
                return (
                  <tr
                    key={product.id}
                    className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <th
                      scope="row"
                      className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                    >
                      <DisplayImageProduct
                        imgSrc={
                          BASE_PRODUCTS_URL +
                          decodeURIComponent(
                            product.products?.product_multimedia[0]
                              .p_principal ?? ""
                          )
                        }
                        width={128}
                        height={128}
                        class="h-8 w-8 rounded-full"
                        alt="Beer Type"
                      />
                    </th>

                    <td className="px-6 py-4 font-semibold text-beer-blonde hover:text-beer-draft">
                      <Link
                        href={`/products/${product.product_id}`}
                        locale={locale}
                      >
                        {product.products?.name}
                      </Link>
                    </td>

                    <td className="px-6 py-4">{t(product.category)}</td>
                    <td className="px-6 py-4">
                      {product.month}/{product.year}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex space-x-1">
                        <EditButton
                          onClick={() => {
                            ("edit");
                          }}
                        />

                        <DeleteButton
                          onClick={() => {
                            handleDeleteShowModal(true);
                            handleProductModal(product);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {isDeleteShowModal && (
          <DeleteMonthlyProduct
            products={products ?? []}
            product={productModal}
            showModal={isDeleteShowModal}
            handleDeleteShowModal={handleDeleteShowModal}
            handleSetProducts={handleDeleteProduct}
          />
        )}
      </section>
    </>
  );
}
