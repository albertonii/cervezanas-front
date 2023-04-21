import { t } from "i18next";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ProductList } from "..";
import { CustomizeSettings, Product } from "../../../lib/types";
import { AddProduct, DeleteProduct, UpdateProduct } from "../../modals/index";

interface Props {
  products: IProduct[];
  handleSetProducts: Dispatch<SetStateAction<any>>;
  customizeSettings: CustomizeSettings;
}

export function Products({
  products,
  handleSetProducts,
  customizeSettings: cSettings,
}: Props) {
  const [customizeSettings, setCustomizeSettings] =
    useState<CustomizeSettings>(cSettings);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    setCustomizeSettings(cSettings);
  }, [cSettings]);

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
    <div className="py-6 px-4 " aria-label="Products">
      <div className="flex items-center">
        <div className="text-4xl pr-12">{t("products")}</div>

        <AddProduct
          products={products}
          handleSetProducts={handleSetProducts}
          customizeSettings={customizeSettings}
        />
      </div>

      <ProductList
        products={products}
        handleEditShowModal={handleEditShowModal}
        handleDeleteShowModal={handleDeleteShowModal}
        handleProductModal={handleProductModal}
        handleSetProducts={handleSetProducts}
      />

      {isEditShowModal && productModal != null && (
        <UpdateProduct
          product={productModal}
          showModal={isEditShowModal}
          handleSetProducts={handleSetProducts}
          handleEditShowModal={handleEditShowModal}
        />
      )}

      {isDeleteShowModal && (
        <DeleteProduct
          products={products ?? []}
          product={productModal}
          showModal={isDeleteShowModal}
          handleDeleteShowModal={handleDeleteShowModal}
          handleSetProducts={handleSetProducts}
        />
      )}
    </div>
  );
}
