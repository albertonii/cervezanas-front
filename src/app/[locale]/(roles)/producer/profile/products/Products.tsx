"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { IProduct } from "../../../../../../lib/types";
import { AddProduct } from "../../../../components/modals/AddProduct";
import { DeleteProduct } from "../../../../components/modals/DeleteProduct";
import { UpdateProduct } from "../../../../components/modals/UpdateProduct";

import { ProductList } from "./ProductList";

export function Products() {
  const t = useTranslations();
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
    <div className="px-4 py-6" aria-label="Products">
      <div className="flex flex-col space-y-4">
        <div className="text-4xl">{t("products")}</div>

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
