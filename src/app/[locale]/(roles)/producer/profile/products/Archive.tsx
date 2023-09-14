"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { IProduct } from "../../../../../../lib/types";
import { ProductsArchiveList } from "./ProductsArchiveList";
import { UpdateProduct } from "../../../../components/modals/UpdateProduct";
import { DeleteProduct } from "../../../../components/modals/DeleteProduct";

/**
 *
 * @returns Products archived are not public and can only be viewed by the seller.
 * Useful to keep track of products that have been sold or are no longer available.
 */
export function Archive() {
  const t = useTranslations();

  const [isEditShowModal, setIsEditShowModal] = useState(false);
  const [isDeleteShowModal, setIsDeleteShowModal] = useState(false);
  const [productModal, setProductModal] = useState<IProduct>();

  const handleEditShowModal = (value: boolean) => {
    setIsEditShowModal(value);
  };

  const handleDeleteShowModal = (value: boolean) => {
    setIsDeleteShowModal(value);
  };

  const handleProductModal = (product: IProduct) => {
    setProductModal(product);
  };

  return (
    <>
      <div className="px-4 py-6 " aria-label="Products">
        <div className="flex flex-col space-y-4">
          <div className="text-4xl">{t("products_archive")}</div>
        </div>

        <ProductsArchiveList
          handleEditShowModal={handleEditShowModal}
          handleDeleteShowModal={handleDeleteShowModal}
          handleProductModal={handleProductModal}
        />
      </div>

      {productModal && isEditShowModal && (
        <UpdateProduct
          product={productModal}
          handleEditShowModal={handleEditShowModal}
          showModal={false}
        />
      )}

      {isDeleteShowModal && (
        <DeleteProduct
          product={productModal}
          showModal={isDeleteShowModal}
          handleDeleteShowModal={handleDeleteShowModal}
        />
      )}
    </>
  );
}
