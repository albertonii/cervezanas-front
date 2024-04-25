'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import useFetchProductsByOwnerAndPagination from '../../../../../hooks/useFetchProductsByOwnerAndPagination';
import { IProduct } from '../../../../../lib/types/types';
import InputSearch from '../../common/InputSearch';
import PaginationFooter from '../../common/PaginationFooter';
import Spinner from '../../common/Spinner';
import ProductSlotList from './ProductSlotList';

interface Props {
    form: UseFormReturn<any, any>;
    productItems?: string[];
}

export function SearchCheckboxProductSlot({ form, productItems }: Props) {
    const [products, setProducts] = useState<IProduct[]>([]);

    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const fixedCount = products.length;
    const resultsPerPage = 100;

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

    const filteredItemsByName = useMemo(() => {
        if (!products) return [];
        return products.filter((product) => {
            return product.name.toLowerCase().includes(query.toLowerCase());
        });
    }, [products, query]);

    if (isLoading) {
        return <Spinner color="beer-blonde" size="xLarge" absolute center />;
    }

    return (
        <section className="z-10 h-full w-full space-y-2 rounded-lg shadow-lg bg-white border-2 dark:bg-gray-700 relative ">
            <div className="m-2 relative">
                <InputSearch
                    query={query}
                    setQuery={setQuery}
                    searchPlaceholder={'search_by_name'}
                />
            </div>

            <div className="relative pb-24">
                <ProductSlotList
                    products={filteredItemsByName}
                    form={form}
                    productItems={productItems}
                />
            </div>

            <div className="w-full absolute bottom-0 justify-center">
                <PaginationFooter
                    counter={fixedCount}
                    resultsPerPage={resultsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </section>
    );
}
