"use client";

import React, { ComponentProps } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Modal } from ".";
import { IAward, IProduct } from "../../lib/types.d";
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
    // Delete multimedia in storage
    deleteMultimedia(product);
    deleteAwards(product);
    deleteProductPacksImg(product);

    const { error: productError } = await supabase
      .from("products")
      .delete()
      .eq("id", product?.id);

    if (productError) throw productError;

    handleDeleteShowModal(false);
  };

  const deleteProductPacksImg = (product?: IProduct) => {
    if (product && product?.product_pack) {
      console.log(product.product_pack);
      product?.product_pack.map(async (pack) => {
        console.log(decodeURIComponent(pack.img_url));

        const { error: packError } = await supabase.storage
          .from("products")
          .remove([`${decodeURIComponent(pack.img_url)}`]);

        if (packError) throw packError;
      });
    }
  };

  const deleteAwards = (product?: IProduct) => {
    if (product && product?.awards) {
      console.log(product?.awards);

      product?.awards.map(async (award: IAward) => {
        console.log(award);
        console.log(decodeURIComponent(award.img_url));
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
