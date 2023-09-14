import React, { ComponentProps } from "react";
import { Modal } from "./Modal";

interface Props {
  handleResponseModal: ComponentProps<any>;
  handleDeleteShowModal: ComponentProps<any>;
  showModal: boolean;
  setShowModal: ComponentProps<any>;
}

export function DeleteCampaign({
  handleResponseModal,
  handleDeleteShowModal,
  showModal,
  setShowModal,
}: Props) {
  const handleDeleteClick = async () => {
    handleResponseModal(true);
  };

  return (
    <Modal
      showBtn={false}
      showModal={showModal}
      setShowModal={setShowModal}
      title={"modal_delete_campaign_title"}
      btnTitle={"delete"}
      description={"modal_delete_campaign_description"}
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
