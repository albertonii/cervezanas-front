import React from "react";
import { Modal } from ".";

interface Props {
  handleResponseModal: React.Dispatch<React.SetStateAction<any>>;
}

export function DeleteCampaign(props: Props) {
  const { handleResponseModal } = props;

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
      classIcon={""}
      classContainer={""}
    >
      <></>
    </Modal>
  );
}
