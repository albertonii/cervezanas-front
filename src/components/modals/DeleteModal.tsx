import { faTrash } from "@fortawesome/free-solid-svg-icons";
import React, { ComponentProps } from "react";
import { Modal } from "./Modal";

interface Props {
  title: string;
  description: string;
  handler: ComponentProps<any>;
  handlerClose: ComponentProps<any>;
  btnTitle: string;
  showModal: boolean;
  setShowModal: (b: boolean) => void;
}

export default function DeleteModal({
  title,
  description,
  handler,
  handlerClose,
  btnTitle,
  setShowModal,
}: Props) {
  const deleteColor = { filled: "#90470b", unfilled: "grey" };
  const classIcon = "";
  const classContainer = "";

  return (
    <Modal
      title={title}
      description={description}
      icon={faTrash}
      color={deleteColor}
      handler={async () => handler()}
      handlerClose={() => handlerClose()}
      showModal={true}
      setShowModal={setShowModal}
      classIcon={classIcon}
      classContainer={classContainer}
      btnTitle={btnTitle}
    >
      <></>
    </Modal>
  );
}
