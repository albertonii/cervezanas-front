'use client';

import PaginationFooter from '../../../../components/common/PaginationFooter';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { IProduct } from '../../../../../../lib/types/types';
import { useLocale, useTranslations } from 'next-intl';
import Spinner from '../../../../components/common/Spinner';
import { formatCurrency } from '../../../../../../utils/formatCurrency';
import useFetchProductsByOwnerAndPagination from '../../../../../../hooks/useFetchProductsByOwnerAndPagination';
import InputSearch from '../../../../components/common/InputSearch';

interface ColumnsProps {
    header: string;
}
interface Props {
    form: UseFormReturn<any, any>;
}

export function SearchCheckboxCPProducts({ form }: Props) {
    const t = useTranslations();
    const locale = useLocale();
    const { user } = useAuth();

    const [query, setQuery] = useState('');
    const [products, setProducts] = useState<IProduct[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const fixedCount = products.length;
    const resultsPerPage = 100;

    const { register } = form;

    const { isLoading, refetch } = useFetchProductsByOwnerAndPagination(
        currentPage,
        resultsPerPage,
        false,
    );

    useEffect(() => {
        refetch().then((res) => {
            const products = res.data as IProduct[];
            setProducts(products);
        });
    }, [currentPage]);

    const COLUMNS = [
        { header: '' },
        { header: t('name_header') },
        { header: t('price_header') },
    ];

    if (isLoading) {
        return (
            <Spinner color="beer-blonde" size="xLarge" absolute flexCenter />
        );
    }

    const filteredItemsByProductsName = useMemo(() => {
        if (!products) return [];
        return products.filter((product) => {
            return product.name.toLowerCase().includes(query.toLowerCase());
        });
    }, [products, query]);

    return (
        <section className="z-10 my-6 w-full space-y-4 rounded bg-white shadow dark:bg-gray-700">
            <InputSearch
                query={query}
                setQuery={setQuery}
                searchPlaceholder={'search_cp_products'}
            />

            <table className="bg-beer-foam w-full text-center text-sm text-gray-500 dark:text-gray-400 ">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        {COLUMNS.map((column: ColumnsProps, index: number) => {
                            return (
                                <th
                                    key={index}
                                    scope="col"
                                    className="px-6 py-3"
                                >
                                    {column.header}
                                </th>
                            );
                        })}
                    </tr>
                </thead>

                <tbody>
                    {filteredItemsByProductsName.map((product, index) => {
                        return (
                            <tr key={product.id} className="">
                                <>
                                    <th
                                        scope="row"
                                        className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                                    >
                                        <input
                                            id={`checkbox-item-${product.id}`}
                                            type="checkbox"
                                            {...register(
                                                `product_items.${index}.id`,
                                            )}
                                            value={product.id}
                                            className="hover:cursor-pointer h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                                        />
                                    </th>

                                    <td className="px-6 py-4 font-semibold text-beer-blonde hover:text-beer-draft">
                                        <Link
                                            href={`/products/${product.id}`}
                                            target={'_blank'}
                                            locale={locale}
                                        >
                                            {product.name}
                                        </Link>
                                    </td>

                                    <td className="px-6 py-4">
                                        {formatCurrency(product.price)}
                                    </td>
                                </>
                            </tr>
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
        </section>
    );
}
