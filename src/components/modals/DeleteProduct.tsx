import React from "react";
import { useTranslation } from "react-i18next";
import { Modal } from ".";
import { Product } from "../../lib/types";

import { supabase } from "../../utils/supabaseClient";

interface Props {
  products: Product[];
  productId: string;
  isDeleteShowModal: boolean;
  handleDeleteShowModal: React.Dispatch<React.SetStateAction<any>>;
  handleSetProducts: React.Dispatch<React.SetStateAction<any>>;
}

export function DeleteProduct(props: Props) {
  const { t } = useTranslation();
  const {
    products,
    productId,
    isDeleteShowModal,
    handleDeleteShowModal,
    handleSetProducts,
  } = props;

  const handleDeleteClick = () => {
    const handleDelete = async () => {
      const { data, error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      handleDeleteShowModal(false);

      handleSetProducts(
        products.filter((b) => {
          return b.id !== productId;
        })
      );

      return data;
    };

    handleDelete();
  };

  return (
    <Modal
      isVisible={isDeleteShowModal}
      title={"modal_product_title"}
      btnTitle={"delete_product"}
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
