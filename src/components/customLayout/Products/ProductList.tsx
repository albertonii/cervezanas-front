import Image from "next/image";
import Link from "next/link";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Product } from "../../../lib/types";
import { supabase } from "../../../utils/supabaseClient";
import { DeleteButton } from "../../common";
import { ArchiveButton } from "../../common/ArchiveButton";
import { EditButton } from "../../common/EditButton";

interface Props {
  products: Product[];
  handleEditShowModal: Dispatch<SetStateAction<any>>;
  handleDeleteShowModal: Dispatch<SetStateAction<any>>;
  handleProductModal: Dispatch<SetStateAction<any>>;
  handleSetProducts: Dispatch<SetStateAction<any>>;
}

interface ColumnsProps {
  header: string;
}

export function ProductList({
  products,
  handleEditShowModal,
  handleDeleteShowModal,
  handleProductModal,
  handleSetProducts,
}: Props) {
  const { t } = useTranslation();

  const [products_, setProducts_] = useState<Product[]>(products);
  const [query, setQuery] = useState("");

  const COLUMNS = [
    { header: t("product_type_header") },
    { header: t("name_header") },
    { header: t("price_header") },
    { header: t("stock_header") },
    { header: t("lot_header") },
    { header: t("public_header") },
    { header: t("action_header") },
  ];

  const handleClickEdit = (product: Product) => {
    handleEditShowModal(true);
    handleDeleteShowModal(false);
    handleProductModal(product);
  };

  const handleArchive = async (product: any) => {
    // Update product state to archived and isPublic to false
    // Update product
    const updatedProduct = {
      ...product,
      is_archived: true,
      is_public: false,
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
    const updatedProducts = products_.map((product_) => {
      if (product_.id === product.id) {
        return updatedProduct;
      }
      return product_;
    });

    setProducts_(updatedProducts);
    handleSetProducts(updatedProducts);
  };

  const handleClickDelete = (product: Product) => {
    handleEditShowModal(false);
    handleDeleteShowModal(true);
    handleProductModal(product);
  };

  useEffect(() => {
    setProducts_(products);
  }, [products]);

  const filteredItems = useMemo<Product[]>(() => {
    return products_.filter((product) => {
      return product.name.toLowerCase().includes(query.toLowerCase());
    });
  }, [products_, query]);

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg mt-6">
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
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
          className="mb-6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search products..."
        />
      </div>

      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {COLUMNS.map((column: ColumnsProps, index: number) => {
              return (
                <th key={index} scope="col" className="py-3 px-6">
                  {column.header}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {products_ &&
            filteredItems.map((product) => {
              return (
                <tr
                  key={product.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  {!product.is_archived && (
                    <>
                      <th
                        scope="row"
                        className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        <Image
                          width={128}
                          height={128}
                          className="w-8 h-8 rounded-full"
                          src="/icons/beer-240.png"
                          alt="Beer Type"
                        />
                      </th>

                      <td className="py-4 px-6 text-beer-blonde font-semibold hover:text-beer-draft">
                        <Link href={`/products/${product.id}`}>
                          {product.name}
                        </Link>
                      </td>

                      <td className="py-4 px-6">{product.price}</td>

                      <td className="py-4 px-6">
                        {product.product_inventory &&
                        product.product_inventory[0]?.quantity
                          ? product.product_inventory[0].quantity
                          : "-"}
                      </td>

                      <td className="py-4 px-6">
                        {product.product_lot && product.product_lot[0]?.lot_id
                          ? product.product_lot[0]?.lot_id
                          : "-"}
                      </td>

                      <td className="py-4 px-6">
                        {product.is_public ? t("yes") : t("no")}
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex space-x-1">
                          <EditButton
                            onClick={() => handleClickEdit(product)}
                          />

                          <DeleteButton
                            onClick={() => handleClickDelete(product)}
                          />

                          <ArchiveButton
                            onClick={() => handleArchive(product)}
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
    </div>
  );
}
