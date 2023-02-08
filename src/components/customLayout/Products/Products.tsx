import { useState } from "react";
import { Product } from "../../../lib/types";
import LotModalAdd from "../../modals/AddLot";
import ProductModalUpd from "../../modals/ProductModalUpd";
import ProductList from "./ProductList";
import DeleteProduct from "../../modals/DeleteProduct";
import AddProduct from "../../modals/AddProduct";

interface Props {
  products: Product[];
}

export const Products = ({ products: p }: Props) => {
  const [isEditShowModal, setIsEditShowModal] = useState(false);
  const [isDeleteShowModal, setIsDeleteShowModal] = useState(false);

  const [productModal, setProductModal] = useState<any>(null);

  const [products, setProducts] = useState<Product[]>(p);

  const handleSetProducts = (value: Product[]) => {
    setProducts(value);
  };

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
      <div className="py-6 px-4 pt-12" aria-label="Products">
        <div className="flex">
          <div className="text-4xl pr-12">Productos</div>

          <AddProduct
            products={products!}
            handleSetProducts={handleSetProducts}
          />

          <LotModalAdd />
        </div>

        <ProductList
          products={products}
          handleEditShowModal={handleEditShowModal}
          handleDeleteShowModal={handleDeleteShowModal}
          handleProductModal={handleProductModal}
        />

        {isEditShowModal && (
          <ProductModalUpd
            isVisible={true}
            product={productModal}
            handleEditShowModal={handleEditShowModal}
          />
        )}

        {isDeleteShowModal && (
          <DeleteProduct
            products={products!}
            productId={productModal.id}
            isDeleteShowModal={isDeleteShowModal}
            handleDeleteShowModal={handleDeleteShowModal}
            handleSetProducts={handleSetProducts}
          />
        )}
      </div>
    </>
  );
};

export async function getServerSideProps() {}
