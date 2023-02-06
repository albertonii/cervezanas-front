import React from "react";
import { useTranslation } from "react-i18next";
import { Product } from "../../lib/types";

import { supabase } from "../../utils/supabaseClient";
import Modal from "./Modal";

interface Props {
  products: Product[];
  productId: string;
  isDeleteShowModal: boolean;
  handleDeleteShowModal: React.Dispatch<React.SetStateAction<any>>;
  handleSetProducts: React.Dispatch<React.SetStateAction<any>>;
}

const DeleteProduct = (props: Props) => {
  const { t } = useTranslation();
  const {
    products,
    productId,
    isDeleteShowModal,
    handleDeleteShowModal,
    handleSetProducts,
  } = props;

  const handleClick = () => {
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
      isVisible={false}
      title={"delete_product"}
      btnTitle={"delete_product"}
      description={""}
      handler={() => {
        handleClick();
      }}
      classIcon={""}
      classContainer={""}
    >
      <button className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">
        {t("accept")}
      </button>
    </Modal>
  );
};

export default DeleteProduct;
