'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { ComponentProps, useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from '../../../../Auth/useAuth';
import { IProduct } from '../../../../../../lib/types';
import InputSearch from '../../../../components/common/InputSearch';
import { formatCurrency } from '../../../../../../utils/formatCurrency';
import { EditButton } from '../../../../components/common/EditButton';
import { DeleteButton } from '../../../../components/common/DeleteButton';
import { ArchiveButton } from '../../../../components/common/ArchiveButton';
import PaginationFooter from '../../../../components/common/PaginationFooter';
import useFetchProductsAndPagination from '../../../../../../hooks/useFetchProductsAndPagination';
import dynamic from 'next/dynamic';

const DynamicSpinner = dynamic(
  () => import('../../../../components/common/Spinner'),
  {
    ssr: false,
  },
);

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
  const { supabase, user } = useAuth();
  if (!user) return null;

  const t = useTranslations();
  const locale = useLocale();

  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  const {
    data: products,
    isError,
    isLoading,
    isSuccess,
  } = useFetchProductsAndPagination(currentPage, resultsPerPage);

  // TODO: Arreglar la paginación
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (products) {
      setCounter(products.length);
    }
  }, [isSuccess]);

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
    // Update product state to archived and isPublic to false
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

    // Send product to supabase database
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
    <div className="relative mt-6 overflow-x-auto shadow-md sm:rounded-lg">
      {isError && (
        <div className="flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            {t('error_fetching_products')}
          </p>
        </div>
      )}

      {isLoading && (
        <DynamicSpinner color="beer-blonde" size="xLarge" absolute center />
      )}

      {!isError && !isLoading && products?.length === 0 ? (
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

          <table className="w-full text-center text-sm text-gray-500 dark:text-gray-400 ">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                {COLUMNS.map((column: ColumnsProps, index: number) => {
                  return (
                    <th key={index} scope="col" className="px-6 py-3">
                      {column.header}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {products &&
                filteredItems.map((product) => {
                  return (
                    <tr
                      key={product.id}
                      className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <>
                        <th
                          scope="row"
                          className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                        >
                          <Image
                            width={128}
                            height={128}
                            className="h-8 w-8 rounded-full"
                            src={'/icons/beer-240.png'}
                            alt="Beer Type"
                            loader={() => '/icons/beer-240.png'}
                          />
                        </th>

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
                          product.product_inventory?.quantity
                            ? product.product_inventory.quantity
                            : '-'}
                        </td>

                        <td className="px-6 py-4">
                          {product.product_lots &&
                          product.product_lots[0]?.lot_id
                            ? product.product_lots[0]?.lot_id
                            : '-'}
                        </td>

                        <td className="px-6 py-4">
                          {product.is_public ? t('yes') : t('no')}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex space-x-1">
                            <EditButton
                              onClick={() => handleEditClick(product)}
                            />

                            <DeleteButton
                              onClick={() => handleDeleteClick(product)}
                            />

                            <ArchiveButton
                              onClick={() => handleArchive(product)}
                            />
                          </div>
                        </td>
                      </>
                    </tr>
                  );
                })}
            </tbody>
          </table>

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
    </div>
  );
}
