"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { ProductsArchiveList } from "..";
import { IProduct } from "../../../lib/types.d";
import { DeleteProduct, UpdateProduct } from "../../modals";

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
        <div className="flex items-center">
          <div className="pr-12 text-4xl">{t("products_archive")}</div>
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
