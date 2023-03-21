import React from "react";
import { useTranslation } from "react-i18next";
import { Modal } from ".";
import { Product } from "../../lib/types";

import { supabase } from "../../utils/supabaseClient";

interface Props {
  products: Product[];
  product: Product | undefined;
  isDeleteShowModal: boolean;
  handleDeleteShowModal: React.Dispatch<React.SetStateAction<any>>;
  handleSetProducts: React.Dispatch<React.SetStateAction<any>>;
}

export function DeleteProduct(props: Props) {
  const {
    products,
    product,
    isDeleteShowModal,
    handleDeleteShowModal,
    handleSetProducts,
  } = props;

  const handleDeleteClick = () => {
    const handleDelete = async () => {
      // Delete all storage images from the product
      if (product?.product_multimedia[0].p_principal) {
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

      handleSetProducts(
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
      isVisible={isDeleteShowModal}
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
