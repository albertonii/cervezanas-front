"use client";

import React, { ComponentProps } from "react";
import { useMutation, useQueryClient } from "react-query";
import { IAward, IProduct } from "../../../../lib/types";
import { useAuth } from "../../Auth/useAuth";
import Modal from "./Modal";

interface Props {
  product: IProduct;
  showModal: boolean;
  handleDeleteShowModal: ComponentProps<any>;
}

export function DeleteProduct(props: Props) {
  const { product, showModal, handleDeleteShowModal } = props;
  const { supabase } = useAuth();

  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!product) return;

    // Delete multimedia in storage
    deleteMultimedia(product);
    deleteAwards(product);
    deleteProductPacksImg(product);

    const { error: productError } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (productError) throw productError;

    handleDeleteShowModal(false);
  };

  const deleteProductPacksImg = (product?: IProduct) => {
    if (product && product?.product_packs) {
      product?.product_packs.map(async (pack) => {
        const { error: packError } = await supabase.storage
          .from("products")
          .remove([`${decodeURIComponent(pack.img_url)}`]);

        if (packError) throw packError;
      });
    }
  };

  const deleteAwards = (product?: IProduct) => {
    if (product && product?.awards) {
      product?.awards.map(async (award: IAward) => {
        const { error: awardError } = await supabase.storage
          .from("products")
          .remove([`${decodeURIComponent(award.img_url)}`]);

        if (awardError) throw awardError;
      });
    }
  };

  const deleteMultimedia = async (product?: IProduct) => {
    if (product && product?.product_multimedia) {
      if (product?.product_multimedia[0]?.p_principal) {
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
          .remove([
            `${decodeURIComponent(product?.product_multimedia[0].p_back)}`,
          ]);

        if (storageError) throw storageError;
      }

      if (product?.product_multimedia[0]?.p_extra_1) {
        const { error: storageError } = await supabase.storage
          .from("products")
          .remove([
            `${decodeURIComponent(product?.product_multimedia[0].p_extra_1)}`,
          ]);

        if (storageError) throw storageError;
      }

      if (product?.product_multimedia[0]?.p_extra_2) {
        const { error: storageError } = await supabase.storage
          .from("products")
          .remove([
            `${decodeURIComponent(product?.product_multimedia[0].p_extra_2)}`,
          ]);

        if (storageError) throw storageError;
      }

      if (product?.product_multimedia[0]?.p_extra_3) {
        const { error: storageError } = await supabase.storage
          .from("products")
          .remove([
            `${decodeURIComponent(product?.product_multimedia[0].p_extra_3)}`,
          ]);

        if (storageError) throw storageError;
      }
    }
  };

  const deleteProductMutation = useMutation({
    mutationKey: ["deleteProduct"],
    mutationFn: handleDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productList"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmitDelete = () => {
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
        onSubmitDelete();
      }}
      classIcon={""}
      classContainer={""}
    >
      <></>
    </Modal>
  );
}
