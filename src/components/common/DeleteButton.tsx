import React from "react";
import IconButton from "./IconButton";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface Props {
  onClick?: () => void;
}

export default function DeleteButton({ onClick }: Props) {
  return (
    <IconButton
      box
      danger
      accent
      classContainer="py-2"
      icon={faTrash}
      color={{ filled: "#fefefe", unfilled: "#fefefe" }}
      onClick={onClick}
    ></IconButton>
  );
}
