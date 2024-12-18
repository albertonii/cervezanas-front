'use client';

import Spinner from '../../ui/Spinner';
import ProductSlotList from './ProductSlotList';
import InputSearch from '../../form/InputSearch';
import PaginationFooter from '../../ui/PaginationFooter';
import useFetchProductsByOwnerAndPagination from '../../../../../hooks/useFetchProductsByOwnerAndPagination';
import React, { useEffect, useMemo, useState } from 'react';
import { Type } from '@/lib//productEnum';
import { IProduct } from '@/lib/types/types';
import { UseFormReturn } from 'react-hook-form';

interface Props {
    form: UseFormReturn<any, any>;
}

export function SearchCheckboxProductSlot({ form }: Props) {
    const [products, setProducts] = useState<IProduct[]>([]);

    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const count = products.length;
    const resultsPerPage = 10;

    const { isLoading, refetch } = useFetchProductsByOwnerAndPagination(
        currentPage,
        resultsPerPage,
        false,
    );

    useEffect(() => {
        refetch().then((res) => {
            const products = res.data as IProduct[];

            // Filter only type BEER
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

            <ProductSlotList products={filteredItemsByName} form={form} />

            <PaginationFooter
                counter={count}
                resultsPerPage={resultsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </section>
    );
}
