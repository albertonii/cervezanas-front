"use client";

import React, { ComponentProps } from "react";
import { Modal } from "./Modal";

interface Props {
  handleResponseModal: ComponentProps<any>;
  showModal: boolean;
  setShowModal: ComponentProps<any>;
}

export function DeleteAddress({
  handleResponseModal,
  showModal,
  setShowModal,
}: Props) {
  const handleDeleteClick = async () => {
    handleResponseModal(true);
    setShowModal(false);
  };

  return (
    <Modal
      showBtn={false}
      showModal={showModal}
      setShowModal={setShowModal}
      title={"modal_delete_address_title"}
      btnTitle={"delete"}
      description={"modal_delete_address_description"}
      handler={() => {
        handleDeleteClick();
      }}
      handlerClose={() => setShowModal(false)}
      classIcon={""}
      classContainer={""}
    >
      <></>
    </Modal>
  );
}
