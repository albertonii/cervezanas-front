import React, { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { Product } from "../../../lib/types";
import { DeleteProduct, UpdateProduct } from "../../modals";
import ProductsArchiveList from "./ProductsArchiveList";

interface Props {
  products: Product[];
  handleSetProducts: Dispatch<SetStateAction<any>>;
}

/**
 *
 * @returns Products archived are not public and can only be viewed by the seller.
 * Useful to keep track of products that have been sold or are no longer available.
 */
export default function Archive({ products, handleSetProducts }: Props) {
  const { t } = useTranslation();

  const [isEditShowModal, setIsEditShowModal] = useState(false);
  const [isDeleteShowModal, setIsDeleteShowModal] = useState(false);
  const [productModal, setProductModal] = useState<Product>();

  const handleEditShowModal = (value: boolean) => {
    setIsEditShowModal(value);
  };

  const handleDeleteShowModal = (value: boolean) => {
    setIsDeleteShowModal(value);
  };

  const handleProductModal = (product: Product) => {
    setProductModal(product);
  };

  return (
    <>
      <div className="py-6 px-4 " aria-label="Products">
        <div className="flex flex-col items-center">
          <div className="text-4xl pr-12">{t("products_archive")}</div>

          <ProductsArchiveList
            products={products}
            handleSetProducts={handleSetProducts}
            handleEditShowModal={handleEditShowModal}
            handleDeleteShowModal={handleDeleteShowModal}
            handleProductModal={handleProductModal}
          />
        </div>
      </div>

      {isEditShowModal && (
        <UpdateProduct
          product={productModal!}
          handleSetProducts={handleSetProducts}
          handleEditShowModal={handleEditShowModal}
        />
      )}

      {isDeleteShowModal && (
        <DeleteProduct
          products={products!}
          productId={productModal!.id}
          isDeleteShowModal={isDeleteShowModal}
          handleDeleteShowModal={handleDeleteShowModal}
          handleSetProducts={handleSetProducts}
        />
      )}
    </>
  );
}
