'use client';

import ProductAccordion from './ProductAccordion';
import Spinner from '../../../../components/common/Spinner';
import InputSearch from '../../../../components/common/InputSearch';
import PaginationFooter from '../../../../components/common/PaginationFooter';
import useFetchProductsByOwnerAndPagination from '../../../../../../hooks/useFetchProductsByOwnerAndPagination';
import React, { useEffect, useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IProduct } from '../../../../../../lib/types/types';

interface Props {
    form: UseFormReturn<any, any>;
    productItems?: string[];
}

export function SearchCheckboxCPProductsPack({ form, productItems }: Props) {
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
        <section className="z-10 my-6 w-full space-y-2 rounded bg-white shadow dark:bg-gray-700">
            <InputSearch
                query={query}
                setQuery={setQuery}
                searchPlaceholder={'search_by_name'}
            />

            <ProductAccordion
                products={filteredItemsByName}
                form={form}
                productItems={productItems}
            />

            <PaginationFooter
                counter={fixedCount}
                resultsPerPage={resultsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </section>
    );
}