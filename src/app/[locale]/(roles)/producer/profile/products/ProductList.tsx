'use client';

import Image from 'next/image';
import Link from 'next/link';
import Spinner from '@/app/[locale]/components/common/Spinner';
import TableWithFooterAndSearch from '@/app/[locale]/components/TableWithFooterAndSearch';
import useFetchProductsByOwnerAndPagination from '../../../../../../hooks/useFetchProductsByOwnerAndPagination';
import React, { ComponentProps, useEffect, useState } from 'react';
import { IProduct } from '@/lib//types/types';
import { useLocale, useTranslations } from 'next-intl';
import { formatCurrency } from '@/utils/formatCurrency';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { EditButton } from '@/app/[locale]/components/common/EditButton';
import { InfoTooltip } from '@/app/[locale]/components/common/InfoTooltip';
import { DeleteButton } from '@/app/[locale]/components/common/DeleteButton';
import { ArchiveButton } from '@/app/[locale]/components/common/ArchiveButton';

interface Props {
    handleEditShowModal: ComponentProps<any>;
    handleDeleteShowModal: ComponentProps<any>;
    handleProductModal: ComponentProps<any>;
    counter: number;
}

export function ProductList({
    handleEditShowModal,
    handleDeleteShowModal,
    handleProductModal,
    counter,
}: Props) {
    const { supabase } = useAuth();
    const { user } = useAuth();
    if (!user) return null;

    const t = useTranslations();
    const locale = useLocale();

    const [products, setProducts] = useState<IProduct[] | null>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const resultsPerPage = 10;

    const { data, isError, isLoading, refetch } =
        useFetchProductsByOwnerAndPagination(
            currentPage,
            resultsPerPage,
            false,
        );

    useEffect(() => {
        // console.log('LOS DATOS HAN CAMBIADO', data);
        setProducts(data as IProduct[]);
    }, [data]);

    useEffect(() => {
        refetch().then((res: any) => {
            const data = res.data as IProduct[];
            const products =
                data?.filter((product) => !product.is_archived) ?? [];
            setProducts(products);
        });

        return () => {};
    }, [currentPage]);

    const columns = [
        {
            header: t('product_type_header'),
            accessor: 'type',
            sortable: true,
            render: (_: any, row: IProduct) => (
                <Image
                    width={32}
                    height={32}
                    className="rounded-full"
                    src="/icons/beer-240.png"
                    alt="Beer Type"
                />
            ),
        },
        {
            header: t('name_header'),
            accessor: 'name',
            sortable: true,
            render: (name: string, row: IProduct) => (
                <Link href={`/products/${row.id}`} locale={locale}>
                    <span className="font-semibold text-beer-blonde hover:text-beer-draft">
                        {name}
                    </span>
                    {row.product_packs?.length === 0 && (
                        <InfoTooltip
                            content={`${t('errors.product_pack_not_exists')}`}
                            delay={0}
                            width={'auto'}
                            direction={'top'}
                        />
                    )}
                </Link>
            ),
        },
        {
            header: t('pvpr'),
            accessor: 'price',
            sortable: true,
            render: (price: number) => formatCurrency(price),
        },
        {
            header: t('num_of_packs'),
            accessor: 'product_packs',
            sortable: true,
            render: (product_packs: any[]) => product_packs.length,
        },
        {
            header: t('stock_header'),
            accessor: 'product_inventory',
            sortable: true,
            render: (product_inventory: any) =>
                product_inventory?.quantity ?? '-',
        },
        {
            header: t('lot_header'),
            accessor: 'product_lots',
            sortable: true,
            render: (product_lots: any[]) => product_lots[0]?.lot_id ?? '-',
        },
        {
            header: t('public_header'),
            accessor: 'is_public',
            sortable: true,
            render: (is_public: boolean) => (is_public ? t('yes') : t('no')),
        },
        {
            header: t('action_header'),
            accessor: 'actions',
            render: (_: any, row: IProduct) => (
                <div className="flex justify-center space-x-2">
                    <EditButton onClick={() => handleEditClick(row)} />
                    <DeleteButton onClick={() => handleDeleteClick(row)} />
                    <ArchiveButton onClick={() => handleArchive(row)} />
                </div>
            ),
        },
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

    return (
        <section className="bg-beer-foam relative mt-2 rounded-md border-2 border-beer-blonde px-2 py-4 shadow-xl">
            {isError && (
                <div className="flex items-center justify-center py-6">
                    <p className="text-gray-500">
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

            {!isError && !isLoading && products?.length === 0 ? (
                <div className="my-[10vh] flex items-center justify-center">
                    <p className="text-2xl text-gray-500">{t('no_products')}</p>
                </div>
            ) : (
                <TableWithFooterAndSearch
                    columns={columns}
                    data={products ?? []}
                    initialQuery={''}
                    resultsPerPage={resultsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    searchPlaceHolder={'search_by_name'}
                    paginationCounter={counter}
                    sourceDataIsFromServer={false}
                />
            )}
        </section>
    );
}
