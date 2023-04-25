import React, { ComponentProps } from "react";
import { Modal } from ".";
import { IProductLot } from "../../lib/types.d";

import { supabase } from "../../utils/supabaseClient";

interface Props {
  lots: IProductLot[];
  productLotId: string;
  handleDeleteShowModal: ComponentProps<any>;
  handleSetProductLots: ComponentProps<any>;
  showModal: boolean;
  setShowModal: ComponentProps<any>;
}

export function DeleteLot({
  lots,
  productLotId,
  handleDeleteShowModal,
  handleSetProductLots,
  showModal,
  setShowModal,
}: Props) {
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
      showModal={showModal}
      setShowModal={setShowModal}
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
