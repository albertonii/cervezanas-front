'use client';

import Link from 'next/link';
import TR from '@/app/[locale]/components/ui/table/TR';
import TD from '@/app/[locale]/components/ui/table/TD';
import TH from '@/app/[locale]/components/ui/table/TH';
import Spinner from '@/app/[locale]/components/ui/Spinner';
import THead from '@/app/[locale]/components/ui/table/THead';
import Table from '@/app/[locale]/components/ui/table/Table';
import TBody from '@/app/[locale]/components/ui/table/TBody';
import InputSearch from '@/app/[locale]/components/form/InputSearch';
import PaginationFooter from '@/app/[locale]/components/ui/PaginationFooter';
import useFetchProductsByOwnerAndPagination from '../../../../../../hooks/useFetchProductsByOwnerAndPagination';
import React, { useEffect, useMemo, useState } from 'react';
import { IProduct } from '@/lib/types/types';
import { UseFormReturn } from 'react-hook-form';
import { useLocale, useTranslations } from 'next-intl';
import { formatCurrency } from '@/utils/formatCurrency';

interface ColumnsProps {
    header: string;
}
interface Props {
    form: UseFormReturn<any, any>;
}

export function SearchCheckboxCPProducts({ form }: Props) {
    const t = useTranslations();
    const locale = useLocale();

    const [query, setQuery] = useState('');
    const [products, setProducts] = useState<IProduct[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const count = products.length;
    const resultsPerPage = 10;

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

            <Table class_="bg-beer-foam w-full text-center text-sm">
                <THead>
                    <TR>
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
                    </TR>
                </THead>

                <TBody>
                    {filteredItemsByProductsName.map((product, index) => {
                        return (
                            <TR key={product.id}>
                                <>
                                    <TH scope="row" class_="whitespace-nowrap">
                                        <input
                                            id={`checkbox-item-${product.id}`}
                                            type="checkbox"
                                            {...register(
                                                `product_items.${index}.id`,
                                            )}
                                            value={product.id}
                                            className="hover:cursor-pointer h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                                        />
                                    </TH>

                                    <TD class_="font-semibold text-beer-blonde hover:text-beer-draft dark:text-beer-softBlonde">
                                        <Link
                                            href={`/products/${product.id}`}
                                            target={'_blank'}
                                            locale={locale}
                                        >
                                            {product.name}
                                        </Link>
                                    </TD>

                                    <TD>{formatCurrency(product.price)}</TD>
                                </>
                            </TR>
                        );
                    })}
                </TBody>
            </Table>

            <PaginationFooter
                counter={count}
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
