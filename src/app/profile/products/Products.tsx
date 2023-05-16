"use client";

import { t } from "i18next";
import { useEffect, useState } from "react";
import { ProductList } from "../../../components/customLayout";
import {
  AddProduct,
  DeleteProduct,
  UpdateProduct,
} from "../../../components/modals";
import { IProduct } from "../../../lib/types";

interface Props {
  products: IProduct[];
}

export function Products({ products }: Props) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(false);
  }, []);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-4 py-6 " aria-label="Products">
      <div className="flex items-center">
        <div className="pr-12 text-4xl">{t("products")}</div>

        <AddProduct />
      </div>

      <ProductList
        handleEditShowModal={handleEditShowModal}
        handleDeleteShowModal={handleDeleteShowModal}
        handleProductModal={handleProductModal}
      />

      {isEditShowModal && productModal != null && (
        <UpdateProduct
          product={productModal}
          showModal={isEditShowModal}
          handleEditShowModal={handleEditShowModal}
        />
      )}

      {isDeleteShowModal && (
        <DeleteProduct
          product={productModal}
          showModal={isDeleteShowModal}
          handleDeleteShowModal={handleDeleteShowModal}
        />
      )}
    </div>
  );
}
