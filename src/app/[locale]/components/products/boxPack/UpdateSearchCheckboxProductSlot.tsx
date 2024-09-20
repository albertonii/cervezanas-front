'use client';

import InputSearch from '../../form/InputSearch';
import UpdateProductSlotList from './UpdateProductSlotList';
import PaginationFooter from '../../ui/PaginationFooter';
import useFetchProductsByOwnerAndPagination from '../../../../../hooks/useFetchProductsByOwnerAndPagination';
import React, { useEffect, useMemo, useState } from 'react';
import { Type } from '@/lib//productEnum';
import { IProduct } from '@/lib//types/types';
import { UseFormReturn } from 'react-hook-form';
import Spinner from '../../ui/Spinner';

interface Props {
    form: UseFormReturn<any, any>;
}

export function UpdateSearchCheckboxProductSlot({ form }: Props) {
    const [products, setProducts] = useState<IProduct[]>([]);

    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const fixedCount = products.length;
    const resultsPerPage = 10;

    const { isLoading, refetch } = useFetchProductsByOwnerAndPagination(
        currentPage,
        resultsPerPage,
        false,
    );

    useEffect(() => {
        refetch().then((res) => {
            const products = res.data as IProduct[];

            // Only include products with type "BEER"
            const filteredProducts = products.filter(
                (product) => product.type === Type.BEER,
            );

            setProducts(filteredProducts);
        });
    }, [currentPage]);

    const filteredItemsByName = useMemo(() => {
        if (!products) return [];
        return products.filter((product) => {
            return product.name.toLowerCase().includes(query.toLowerCase());
        });
    }, [products, query]);

    if (isLoading) {
        return (
            <Spinner
                color="beer-blonde"
                size="xLarge"
                absolute
                absolutePosition="center"
            />
        );
    }

    return (
        <section className="z-10 w-full space-y-2 rounded-lg shadow-lg bg-white border-2 dark:bg-gray-700 relative ">
            <div className="m-2 relative">
                <InputSearch
                    query={query}
                    setQuery={setQuery}
                    searchPlaceholder={'search_by_name'}
                />
            </div>

            <UpdateProductSlotList products={filteredItemsByName} form={form} />

            <PaginationFooter
                counter={fixedCount}
                resultsPerPage={resultsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </section>
    );
}
