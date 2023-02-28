import React, { ComponentProps } from "react";
import { Modal } from ".";

interface Props {
  handleResponseModal: ComponentProps<any>;
  handleDeleteShowModal: ComponentProps<any>;
}

export function DeleteCampaign(props: Props) {
  const { handleResponseModal, handleDeleteShowModal } = props;

  const handleDeleteClick = async () => {
    handleResponseModal(true);
  };

  return (
    <Modal
      showBtn={false}
      isVisible={true}
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
