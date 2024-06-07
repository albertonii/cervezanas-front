'use client';

import Image from 'next/image';
import Link from 'next/link';
import Spinner from '../../../../components/common/Spinner';
import InputSearch from '../../../../components/common/InputSearch';
import PaginationFooter from '../../../../components/common/PaginationFooter';
import useFetchProductsByOwnerAndPagination from '../../../../../../hooks/useFetchProductsByOwnerAndPagination';
import React, { ComponentProps, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { useLocale, useTranslations } from 'next-intl';
import { IProduct } from '../../../../../../lib/types/types';
import { EditButton } from '../../../../components/common/EditButton';
import { formatCurrency } from '../../../../../../utils/formatCurrency';
import { DeleteButton } from '../../../../components/common/DeleteButton';
import { ArchiveButton } from '../../../../components/common/ArchiveButton';

interface Props {
    handleEditShowModal: ComponentProps<any>;
    handleDeleteShowModal: ComponentProps<any>;
    handleProductModal: ComponentProps<any>;
}

interface ColumnsProps {
    header: string;
}

export function ProductList({
    handleEditShowModal,
    handleDeleteShowModal,
    handleProductModal,
}: Props) {
    const { supabase } = useAuth();
    const { user } = useAuth();
    if (!user) return null;

    const t = useTranslations();
    const locale = useLocale();

    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 100;

    const {
        data: ps,
        isError,
        isLoading,
    } = useFetchProductsByOwnerAndPagination(
        currentPage,
        resultsPerPage,
        false,
    );

    const products = ps?.filter((product) => !product.is_archived);

    const counter = ps?.filter((product) => !product.is_archived).length ?? 0;

    const COLUMNS = [
        { header: t('product_type_header') },
        { header: t('name_header') },
        { header: t('price_header') },
        { header: t('stock_header') },
        { header: t('lot_header') },
        { header: t('public_header') },
        { header: t('action_header') },
    ];

    const handleEditClick = (product: IProduct) => {
        handleEditShowModal(true);
        handleDeleteShowModal(false);
        handleProductModal(product);
    };

    const handleArchive = async (product: any) => {
        const updatedProduct = {
            ...product,
            is_archived: true,
            is_public: false,
        };

        // Delete the objets that doesn't exists in supabase table but just in the state
        delete updatedProduct.beers;
        delete updatedProduct.likes;
        delete updatedProduct.product_inventory;
        delete updatedProduct.product_lots;
        delete updatedProduct.product_multimedia;

        const { error } = await supabase
            .from('products')
            .update(updatedProduct)
            .eq('id', product.id)
            .select();

        if (error) throw error;
    };

    const handleDeleteClick = (product: IProduct) => {
        handleEditShowModal(false);
        handleDeleteShowModal(true);
        handleProductModal(product);
    };

    const filteredItems = useMemo<any[]>(() => {
        if (!products) return [];
        return products.filter((product) => {
            return product.name?.toLowerCase().includes(query.toLowerCase());
        });
    }, [products, query]);

    return (
        <section className="relative mt-6 overflow-x-auto shadow-md sm:rounded-lg bg-white">
            {isError && (
                <div className="flex items-center justify-center py-6">
                    <p className="text-gray-500">
                        {t('error_fetching_products')}
                    </p>
                </div>
            )}

            {isLoading && (
                <Spinner
                    color="beer-blonde"
                    size="xLarge"
                    absolute
                    flexCenter
                />
            )}

            {!isError && !isLoading && products?.length === 0 ? (
                <div className="my-[10vh] flex items-center justify-center">
                    <p className="text-2xl text-gray-500">{t('no_products')}</p>
                </div>
            ) : (
                <>
                    <div className="px-4 py-2 bg-gray-50 border-b">
                        <InputSearch
                            query={query}
                            setQuery={setQuery}
                            searchPlaceholder={'search_products'}
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-center text-sm text-gray-500">
                            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                                <tr>
                                    {COLUMNS.map((column, index) => (
                                        <th
                                            key={index}
                                            scope="col"
                                            className="px-6 py-3"
                                        >
                                            {column.header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                {products &&
                                    filteredItems.map((product) => (
                                        <tr
                                            key={product.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Image
                                                    width={32}
                                                    height={32}
                                                    className="rounded-full"
                                                    src="/icons/beer-240.png"
                                                    alt="Beer Type"
                                                />
                                            </td>

                                            <td className="px-6 py-4 font-semibold text-beer-blonde hover:text-beer-draft">
                                                <Link
                                                    href={`/products/${product.id}`}
                                                    locale={locale}
                                                >
                                                    {product.name}
                                                </Link>
                                            </td>

                                            <td className="px-6 py-4">
                                                {formatCurrency(product.price)}
                                            </td>

                                            <td className="px-6 py-4">
                                                {product.product_inventory &&
                                                product.product_inventory
                                                    .quantity
                                                    ? product.product_inventory
                                                          .quantity
                                                    : '-'}
                                            </td>

                                            <td className="px-6 py-4">
                                                {product.product_lots &&
                                                product.product_lots[0]?.lot_id
                                                    ? product.product_lots[0]
                                                          ?.lot_id
                                                    : '-'}
                                            </td>

                                            <td className="px-6 py-4">
                                                {product.is_public
                                                    ? t('yes')
                                                    : t('no')}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex justify-center space-x-2">
                                                    <EditButton
                                                        onClick={() =>
                                                            handleEditClick(
                                                                product,
                                                            )
                                                        }
                                                    />
                                                    <DeleteButton
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                product,
                                                            )
                                                        }
                                                    />
                                                    <ArchiveButton
                                                        onClick={() =>
                                                            handleArchive(
                                                                product,
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="my-4 flex items-center justify-around">
                        <PaginationFooter
                            counter={counter}
                            resultsPerPage={resultsPerPage}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                </>
            )}
        </section>
    );
}
