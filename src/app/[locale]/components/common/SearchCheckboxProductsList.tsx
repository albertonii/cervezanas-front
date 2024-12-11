'use client';

import React, { useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IProduct } from '@/lib/types/types';
import InputSearch from '../form/InputSearch';
import { DisplayInputError } from '../ui/DisplayInputError';

interface Props {
    products: IProduct[];
    form: UseFormReturn<any, any>;
}

export function SearchCheckboxProductsList({ products, form }: Props) {
    const [query, setQuery] = useState('');

    const {
        formState: { errors },
        setValue,
    } = form;

    const filteredProducts = useMemo(() => {
        if (!products) return [];
        return products.filter((product) => {
            return product.name?.toLowerCase().includes(query.toLowerCase());
        });
    }, [products, query]);

    const handleProductClick = (productId: string) => {
        // Si se escoge un producto, se limpia el error
        if (errors.product_id) {
            form.clearErrors('product_id');
        }

        setValue('product_id', productId);
    };

    return (
        <section className="z-10 my-6 w-full space-y-4 rounded bg-white shadow dark:bg-gray-700">
            <InputSearch
                query={query}
                setQuery={setQuery}
                searchPlaceholder={'search_by_name'}
            />

            {errors.product_id && (
                <DisplayInputError message={'select_product'} />
            )}

            <ul
                className="h-48 overflow-y-auto px-3 pb-3 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownSearchButton"
            >
                {filteredProducts.map((product, index) => {
                    return (
                        <li key={product.id}>
                            <div className="flex items-center rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                                <input
                                    onClick={() =>
                                        handleProductClick(product.id)
                                    }
                                    id="checkbox-item-11"
                                    type="radio"
                                    name="radio-product"
                                    value={product.id}
                                    className="hover:cursor-pointer h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                                />
                                <label
                                    htmlFor={`products.${index}.value`}
                                    className="hover:cursor-pointer ml-2 w-full rounded text-sm font-medium text-gray-900 dark:text-gray-300"
                                >
                                    {product.name}
                                </label>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
