import React, { ComponentProps } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Modal } from ".";
import { useSupabase } from "../Context/SupabaseProvider";

interface Props {
  productLotId: string;
  handleDeleteShowModal: ComponentProps<any>;
  showModal: boolean;
}

export function DeleteLot({
  productLotId,
  handleDeleteShowModal,
  showModal,
}: Props) {
  const { supabase } = useSupabase();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    const { data, error } = await supabase
      .from("product_lot")
      .delete()
      .eq("id", productLotId);

    if (error) throw error;

    handleDeleteShowModal(false);

    return data;
  };

  const deleteLotMutation = useMutation({
    mutationKey: ["deleteProduct"],
    mutationFn: handleDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productLotList"] });
    },
  });

  const handleSubmitDelete = () => {
    try {
      deleteLotMutation.mutate();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      showBtn={false}
      showModal={showModal}
      setShowModal={handleDeleteShowModal}
      title={"modal_delete_lot_title"}
      btnTitle={"delete"}
      description={"modal_delete_lot_description"}
      handler={() => {
        handleSubmitDelete();
      }}
      handlerClose={() => handleDeleteShowModal(false)}
      classIcon={""}
      classContainer={""}
    >
      <></>
    </Modal>
  );
}
