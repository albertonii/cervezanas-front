import React, { ComponentProps } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "./IconButton";

interface Props {
  onClick?: ComponentProps<any>;
}

export function DeleteButton({ onClick }: Props) {
  return (
    <IconButton
      box
      danger
      accent
      classContainer={"py-2"}
      icon={faTrash}
      color={{ filled: "#fefefe", unfilled: "#fefefe" }}
      onClick={onClick}
      title={"Delete this item"}
    ></IconButton>
  );
}
