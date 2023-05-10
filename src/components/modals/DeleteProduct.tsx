import React, { ComponentProps } from "react";
import { Modal } from ".";
import { IProduct } from "../../lib/types.d";

import { supabase } from "../../utils/supabaseClient";
import { useAppContext } from "../Context";

interface Props {
  product: IProduct | undefined;
  showModal: boolean;
  handleDeleteShowModal: ComponentProps<any>;
}

export function DeleteProduct(props: Props) {
  const { product, showModal, handleDeleteShowModal } = props;

  const { products, setProducts } = useAppContext();

  const handleDeleteClick = () => {
    const handleDelete = async () => {
      // Delete all storage images from the product
      if (product?.product_multimedia[0]?.p_principal) {
        const { error: storageError } = await supabase.storage
          .from("products")
          .remove([`/articles/${product?.product_multimedia[0].p_principal}`]);

        if (storageError) throw storageError;
      }

      const { error: reviewError } = await supabase
        .from("reviews")
        .delete()
        .eq("product_id", product?.id);

      if (reviewError) throw reviewError;

      const { data, error: productError } = await supabase
        .from("products")
        .delete()
        .eq("id", product?.id);

      if (productError) throw productError;

      handleDeleteShowModal(false);

      // Refresh product list after delete
      setProducts(
        products.filter((b) => {
          return b.id !== product?.id;
        })
      );

      return data;
    };

    handleDelete();
  };

  return (
    <Modal
      showBtn={false}
      showModal={showModal}
      setShowModal={handleDeleteShowModal}
      title={"modal_delete_product_title"}
      btnTitle={"delete"}
      description={"modal_delete_product_description"}
      handler={() => {
        handleDeleteClick();
      }}
      classIcon={""}
      classContainer={""}
    >
      <></>
    </Modal>
  );
}
