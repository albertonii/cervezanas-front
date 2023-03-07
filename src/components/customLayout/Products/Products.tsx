import { t } from "i18next";
import { Dispatch, SetStateAction, useState } from "react";
import { ProductList } from "..";
import { Product } from "../../../lib/types";
import { AddProduct, DeleteProduct, UpdateProduct } from "../../modals/index";

interface Props {
  products: Product[];
  handleSetProducts: Dispatch<SetStateAction<any>>;
}

export function Products({ products, handleSetProducts }: Props) {
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
        <div className="flex items-center">
          <div className="text-4xl pr-12">{t("products")}</div>

          <AddProduct
            products={products!}
            handleSetProducts={handleSetProducts}
          />

          {/* Archive of products  */}
        </div>

        <ProductList
          products={products}
          handleEditShowModal={handleEditShowModal}
          handleDeleteShowModal={handleDeleteShowModal}
          handleProductModal={handleProductModal}
          handleSetProducts={handleSetProducts}
        />

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
      </div>
    </>
  );
}

export async function getServerSideProps() {}
