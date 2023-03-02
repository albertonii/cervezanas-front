import React, { Dispatch, SetStateAction } from "react";
import { Modal } from ".";
import { ProductLot } from "../../lib/types";

import { supabase } from "../../utils/supabaseClient";

interface Props {
  lots: ProductLot[];
  productLotId: string;
  isDeleteShowModal: boolean;
  handleDeleteShowModal: Dispatch<SetStateAction<any>>;
  handleSetProductLots: Dispatch<SetStateAction<any>>;
}

export function DeleteLot(props: Props) {
  const {
    lots,
    productLotId,
    isDeleteShowModal,
    handleDeleteShowModal,
    handleSetProductLots,
  } = props;

  const handleDeleteClick = () => {
    const handleDelete = async () => {
      const { data, error } = await supabase
        .from("product_lot")
        .delete()
        .eq("id", productLotId);

      if (error) throw error;

      handleDeleteShowModal(false);

      handleSetProductLots(
        lots.filter((l) => {
          return l.id !== productLotId;
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
      title={"modal_delete_lot_title"}
      btnTitle={"delete"}
      description={"modal_delete_lot_description"}
      handler={() => {
        handleDeleteClick();
      }}
      handlerClose={() => handleDeleteShowModal(false)}
      classIcon={""}
      classContainer={""}
    >
      <></>
    </Modal>
  );
}
