'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { ComponentProps, useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { IProduct } from '@/lib/types/types';
import { useAppContext } from '@/app/context/AppContext';
import InputSearch from '@/app/[locale]/components/form/InputSearch';
import useFetchProductsByOwnerAndPagination from '../../../../../../hooks/useFetchProductsByOwnerAndPagination';
import { EditButton } from '@/app/[locale]/components/ui/buttons/EditButton';
import { UnarchiveButton } from '@/app/[locale]/components/ui/buttons/UnarchiveButton';
import PaginationFooter from '@/app/[locale]/components/ui/PaginationFooter';
import Spinner from '@/app/[locale]/components/ui/Spinner';
import { formatCurrency } from '@/utils/formatCurrency';
import THead from '@/app/[locale]/components/ui/table/THead';
import TR from '@/app/[locale]/components/ui/table/TR';
import TH from '@/app/[locale]/components/ui/table/TH';
import Table from '@/app/[locale]/components/ui/table/Table';
import TBody from '@/app/[locale]/components/ui/table/TBody';
import TD from '@/app/[locale]/components/ui/table/TD';
import TDActions from '@/app/[locale]/components/ui/table/TDActions';

interface Props {
    handleEditShowModal: ComponentProps<any>;
    handleDeleteShowModal: ComponentProps<any>;
    handleProductModal: ComponentProps<any>;
}

interface ColumnsProps {
    header: string;
}

export function ProductsArchiveList({
    handleEditShowModal,
    handleDeleteShowModal,
    handleProductModal,
}: Props) {
    const { user, supabase } = useAuth();
    const { products: ps, setProducts } = useAppContext();

    if (!user) return null;

    const t = useTranslations();
    const locale = useLocale();

    const products = ps.filter((product) => product.is_archived);

    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const counter = ps.filter((product) => product.is_archived).length;

    const resultsPerPage = 10;

    const { isError, isLoading, refetch } =
        useFetchProductsByOwnerAndPagination(currentPage, resultsPerPage, true);

    const COLUMNS = [
        { header: t('product_type_header') },
        { header: t('name_header') },
        { header: t('price_header') },
        { header: t('lot_header') },
        { header: t('public_header') },
        { header: t('action_header') },
    ];

    useEffect(() => {
        refetch().then((res) => {
            // const products = res.data as IProduct[];
            const products = res.data as any;
            setProducts(products);
        });
    }, [currentPage]);

    const handleClickEdit = (product: IProduct) => {
        handleEditShowModal(true);
        handleDeleteShowModal(false);
        handleProductModal(product);
    };

    const handleUnarchive = async (product: any) => {
        // Update product state to archived to false and isPublic to true
        // Update product
        const updatedProduct = {
            ...product,
            is_archived: false,
        };

        // Delete the objets that doesn't exists in supabase table but just in the state
        delete updatedProduct.beers;
        delete updatedProduct.likes;
        delete updatedProduct.product_inventory;
        delete updatedProduct.product_lots;
        delete updatedProduct.product_media;

        // Send product to supabase database
        const { error } = await supabase
            .from('products')
            .update(updatedProduct)
            .eq('id', product.id)
            .select();

        if (error) throw error;

        // Update products state
        const updatedProducts = products.map((product_) => {
            if (product_.id === product.id) {
                return updatedProduct;
            }
            return product_;
        });

        setProducts(updatedProducts);
    };

    const filteredItems = useMemo(() => {
        return products.filter((product) => {
            return product.name.toLowerCase().includes(query.toLowerCase());
        });
    }, [products, query]);

    return (
        <section className="bg-beer-foam relative mt-6 space-y-4 overflow-x-auto shadow-md sm:rounded-lg">
            {isError && (
                <div className="flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        {t('errors.fetching_products')}
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

            {!isError && !isLoading && products.length === 0 ? (
                <div className="my-[10vh] flex items-center justify-center">
                    <p className="text-2xl text-gray-500 dark:text-gray-400">
                        {t('no_products')}
                    </p>
                </div>
            ) : (
                <>
                    <InputSearch
                        query={query}
                        setQuery={setQuery}
                        searchPlaceholder={'search_products'}
                    />

                    <Table>
                        <THead>
                            <TR>
                                {COLUMNS.map(
                                    (column: ColumnsProps, index: number) => {
                                        return (
                                            <TH key={index} scope="col">
                                                {column.header}
                                            </TH>
                                        );
                                    },
                                )}
                            </TR>
                        </THead>

                        <TBody>
                            {products &&
                                filteredItems.map((product) => {
                                    return (
                                        <TR key={product.id}>
                                            {product.is_archived && (
                                                <>
                                                    <TH
                                                        scope="row"
                                                        class_="whitespace-nowrap"
                                                    >
                                                        <Image
                                                            width={128}
                                                            height={128}
                                                            className="h-8 w-8 rounded-full"
                                                            src={
                                                                '/icons/beer-240.png'
                                                            }
                                                            alt="Beer Type"
                                                        />
                                                    </TH>

                                                    <TD class_="text-beer-blonde hover:text-beer-draft dark:text-beer-softBlonde">
                                                        <Link
                                                            href={`/products/${product.id}`}
                                                            locale={locale}
                                                        >
                                                            {product.name}
                                                        </Link>
                                                    </TD>

                                                    <TD>
                                                        {formatCurrency(
                                                            product.price,
                                                        )}
                                                    </TD>

                                                    <TD>
                                                        {product.product_inventory &&
                                                        product
                                                            .product_inventory
                                                            ?.quantity
                                                            ? product
                                                                  .product_inventory
                                                                  .quantity
                                                            : '-'}
                                                    </TD>

                                                    <TD>
                                                        {product.product_lots &&
                                                        product.product_lots[0]
                                                            ?.lot_id
                                                            ? product
                                                                  .product_lots[0]
                                                                  ?.lot_id
                                                            : '-'}
                                                    </TD>

                                                    <TD>
                                                        {product.is_public
                                                            ? t('yes')
                                                            : t('no')}
                                                    </TD>

                                                    <TDActions>
                                                        <div className="flex space-x-1">
                                                            <EditButton
                                                                onClick={() =>
                                                                    handleClickEdit(
                                                                        product,
                                                                    )
                                                                }
                                                            />

                                                            {/* 
                          <DeleteButton
                            onClick={() => handleClickDelete(product)}
                          /> 
                          */}

                                                            <UnarchiveButton
                                                                onClick={() =>
                                                                    handleUnarchive(
                                                                        product,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </TDActions>
                                                </>
                                            )}
                                        </TR>
                                    );
                                })}
                        </TBody>
                    </Table>

                    {/* Prev and Next button for pagination  */}
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
