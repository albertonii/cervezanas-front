'use client';

import ProductAccordion from './ProductAccordion';
import Spinner from '@/app/[locale]/components/ui/Spinner';
import InputSearch from '@/app/[locale]/components/form/InputSearch';
import PaginationFooter from '@/app/[locale]/components/ui/PaginationFooter';
import useFetchProductsByOwnerAndPagination from '@/hooks/useFetchProductsByOwnerAndPagination';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IProduct } from '@/lib/types/types';
import { UseFormReturn } from 'react-hook-form';

interface Props {
    form: UseFormReturn<any, any>;
    productItems?: string[];
}

export function SearchCheckboxCPProductsPack({ form, productItems }: Props) {
    const t = useTranslations();
    const { setValue, getValues } = form;
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
            setProducts(products);
        });
    }, [currentPage, refetch]);

    const filteredItemsByName = useMemo(() => {
        if (!products) return [];
        return products.filter((product) =>
            product.name.toLowerCase().includes(query.toLowerCase()),
        );
    }, [products, query]);

    const onSelectionChange = (selectedPacksFromProduct: string[]) => {
        // Esta función se llama desde cada ProductAccordionItem
        // con el array de packs seleccionados para ese producto.
        // Debemos fusionar esta selección con la global.

        const currentGlobalSelection = getValues('product_items') || [];
        // Creamos un conjunto para mantener únicas las selecciones
        const updatedGlobalSelection = Array.from(
            new Set([...currentGlobalSelection, ...selectedPacksFromProduct]),
        );

        setValue('product_items', updatedGlobalSelection);
    };

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
                onSelectionChange={onSelectionChange} // Pasamos el callback al acordeón
            />

            <PaginationFooter
                counter={count}
                resultsPerPage={resultsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </section>
    );
}
