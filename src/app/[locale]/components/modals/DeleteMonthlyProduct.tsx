"use client";

import React, { ComponentProps } from "react";
import { IMonthlyProduct } from "../../../../lib/types.d";
import { useSupabase } from "../../../../context/SupabaseProvider";
import { Modal } from "./Modal";

interface Props {
  products: IMonthlyProduct[];
  product: IMonthlyProduct | undefined;
  showModal: boolean;
  handleDeleteShowModal: ComponentProps<any>;
  handleSetProducts: ComponentProps<any>;
}

export function DeleteMonthlyProduct({
  products,
  product,
  showModal,
  handleDeleteShowModal,
  handleSetProducts,
}: Props) {
  const { supabase } = useSupabase();

  const handleDeleteClick = () => {
    const handleDelete = async () => {
      const { data, error: productError } = await supabase
        .from("monthly_products")
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
      showModal={showModal}
      setShowModal={handleDeleteShowModal}
      title={"modal_delete_monthly_product_title"}
      btnTitle={"delete"}
      description={"modal_delete_monthly_product_description"}
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
