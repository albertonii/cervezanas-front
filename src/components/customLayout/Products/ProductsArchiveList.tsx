"use client";

import Link from "next/link";
import Image from "next/image";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { IProduct } from "../../../lib/types.d";
import { Button, EditButton, Spinner, UnarchiveButton } from "../../common";
import { useAuth } from "../../Auth";
import useFetchProductsByOwner from "../../../hooks/useFetchProductsByOwner";
import { useAppContext } from "../../Context";
import { useSupabase } from "../../Context/SupabaseProvider";

interface Props {
  handleEditShowModal: Dispatch<SetStateAction<any>>;
  handleDeleteShowModal: Dispatch<SetStateAction<any>>;
  handleProductModal: Dispatch<SetStateAction<any>>;
}

interface ColumnsProps {
  header: string;
}

export default function ProductsArchiveList({
  handleEditShowModal,
  handleDeleteShowModal,
  handleProductModal,
}: Props) {
  const { supabase } = useSupabase();
  const { products: ps, setProducts } = useAppContext();

  const { user } = useAuth();
  if (!user) return null;

  const { t } = useTranslation();

  const products = ps.filter((product) => product.is_archived);

  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const productsCount = ps.filter((product) => product.is_archived).length;

  const pageRange = 10;
  const finalPage =
    productsCount < currentPage * pageRange
      ? productsCount
      : currentPage * pageRange;

  const { isError, isLoading, refetch } = useFetchProductsByOwner(
    user.id,
    currentPage,
    pageRange,
    true
  );

  const COLUMNS = [
    { header: t("product_type_header") },
    { header: t("name_header") },
    { header: t("price_header") },
    { header: t("stock_header") },
    { header: t("lot_header") },
    { header: t("public_header") },
    { header: t("action_header") },
  ];

  useEffect(() => {
    refetch().then((res) => {
      setProducts(res.data as IProduct[]);
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
    delete updatedProduct.product_lot;
    delete updatedProduct.product_multimedia;

    // Send product to supabase database
    const { error } = await supabase
      .from("products")
      .update(updatedProduct)
      .eq("id", product.id)
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

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(productsCount / pageRange)) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="relative mt-6 overflow-x-auto shadow-md sm:rounded-lg">
      {isError && (
        <div className="flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            {t("error_fetching_products")}
          </p>
        </div>
      )}

      {isLoading && (
        <Spinner color="beer-blonde" size="xLarge" absolute center />
      )}

      {!isError && !isLoading && products.length === 0 ? (
        <div className="my-[10vh] flex items-center justify-center">
          <p className="text-2xl text-gray-500 dark:text-gray-400">
            {t("no_products")}
          </p>
        </div>
      ) : (
        <>
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                aria-hidden="true"
                className="h-5 w-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>

            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="mb-6 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-beer-blonde focus:ring-beer-blonde  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Search products..."
            />
          </div>

          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
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
                      {product.is_archived && (
                        <>
                          <th
                            scope="row"
                            className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                          >
                            <Image
                              width={128}
                              height={128}
                              className="h-8 w-8 rounded-full"
                              src="/icons/beer-240.png"
                              alt="Beer Type"
                            />
                          </th>

                          <td className="px-6 py-4 font-semibold text-beer-blonde hover:text-beer-draft">
                            <Link href={`/products/${product.id}`}>
                              {product.name}
                            </Link>
                          </td>

                          <td className="px-6 py-4">{product.price}</td>

                          <td className="px-6 py-4">
                            {product.product_inventory &&
                            product.product_inventory[0]?.quantity
                              ? product.product_inventory[0].quantity
                              : "-"}
                          </td>

                          <td className="px-6 py-4">
                            {product.product_lot &&
                            product.product_lot[0]?.lot_id
                              ? product.product_lot[0]?.lot_id
                              : "-"}
                          </td>

                          <td className="px-6 py-4">
                            {product.is_public ? t("yes") : t("no")}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex space-x-1">
                              <EditButton
                                onClick={() => handleClickEdit(product)}
                              />

                              {/* 
                          <DeleteButton
                            onClick={() => handleClickDelete(product)}
                          /> 
                          */}

                              <UnarchiveButton
                                onClick={() => handleUnarchive(product)}
                              />
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </table>

          {/* Prev and Next button for pagination  */}
          <div className="my-4 flex items-center justify-around">
            <Button class="" onClick={() => handlePrevPage()} small primary>
              {t("prev")}
            </Button>

            <p className="text-sm text-gray-700 dark:text-gray-400">
              {t("pagination_footer_nums", {
                from: currentPage,
                to: finalPage,
                total: productsCount,
              })}
            </p>

            <Button class="" onClick={() => handleNextPage()} small primary>
              {t("next")}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
