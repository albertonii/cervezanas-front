"use client";

import React, { ComponentProps } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Modal } from ".";
import { IProduct } from "../../lib/types.d";
import { useAuth } from "../Auth";
import { useSupabase } from "../Context/SupabaseProvider";

interface Props {
  product: IProduct | undefined;
  showModal: boolean;
  handleDeleteShowModal: ComponentProps<any>;
}

export function DeleteProduct(props: Props) {
  const { product, showModal, handleDeleteShowModal } = props;
  const { supabase } = useSupabase();

  const queryClient = useQueryClient();

  const handleDelete = async () => {
    // Delete all storage images from the product
    if (product?.product_multimedia) {
      if (product?.product_multimedia[0]?.p_principal) {
        console.log(
          decodeURIComponent(product.product_multimedia[0].p_principal)
        );
        const { error: storageError } = await supabase.storage
          .from("products")
          .remove([
            `${decodeURIComponent(product.product_multimedia[0].p_principal)}`,
          ]);

        if (storageError) throw storageError;
      }

      if (product?.product_multimedia[0]?.p_back) {
        const { error: storageError } = await supabase.storage
          .from("products")
          .remove([`${product?.product_multimedia[0].p_back}`]);

        if (storageError) throw storageError;
      }

      if (product?.product_multimedia[0]?.p_extra_1) {
        const { error: storageError } = await supabase.storage
          .from("products")
          .remove([`${product?.product_multimedia[0].p_extra_1}`]);

        if (storageError) throw storageError;
      }

      if (product?.product_multimedia[0]?.p_extra_2) {
        const { error: storageError } = await supabase.storage
          .from("products")
          .remove([`${product?.product_multimedia[0].p_extra_2}`]);

        if (storageError) throw storageError;
      }

      if (product?.product_multimedia[0]?.p_extra_3) {
        const { error: storageError } = await supabase.storage
          .from("products")
          .remove([`${product?.product_multimedia[0].p_extra_3}`]);

        if (storageError) throw storageError;
      }
    }

    const { error: reviewError } = await supabase
      .from("reviews")
      .delete()
      .eq("product_id", product?.id);

    if (reviewError) throw reviewError;

    const { error: productError } = await supabase
      .from("products")
      .delete()
      .eq("id", product?.id);

    if (productError) throw productError;

    handleDeleteShowModal(false);
  };

  const deleteProductMutation = useMutation({
    mutationKey: ["deleteProduct"],
    mutationFn: handleDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productList"] });
    },
  });

  const handleSubmitDelete = () => {
    try {
      deleteProductMutation.mutate();
    } catch (e) {
      console.error(e);
    }
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
        handleSubmitDelete();
      }}
      classIcon={""}
      classContainer={""}
    >
      <></>
    </Modal>
  );
}
