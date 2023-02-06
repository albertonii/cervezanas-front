import { useEffect, useState } from "react";
import { Product } from "../../../lib/types";
import { supabase } from "../../../utils/supabaseClient";
import { useAuth } from "../../Auth/useAuth";
import LotModalAdd from "../../modals/AddLot";
import ProductModalUpd from "../../modals/ProductModalUpd";
import ProductList from "./ProductList";
import DeleteProduct from "../../modals/DeleteProduct";
import AddProduct from "../../modals/AddProduct";

export const Products = () => {
  const { user } = useAuth();
  const [isEditShowModal, setIsEditShowModal] = useState(false);
  const [isDeleteShowModal, setIsDeleteShowModal] = useState(false);
  const [productModal, setProductModal] = useState<any>(null);

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const getProducts = async () => {
      const { data: products, error } = await supabase
        .from("products")
        .select(
          `
          *,
          product_lot (
            lot_id
          ),
          product_inventory (
            quantity
          )
        `
        )
        .eq("owner_id", user?.id);
      if (error) throw error;
      setProducts(products);

      return products;
    };
    getProducts();

    return () => {
      setProducts([]);
    };
  }, [user]);

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
