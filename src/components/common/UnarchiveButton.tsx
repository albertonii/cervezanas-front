import React from "react";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "./IconButton";

interface Props {
  onClick?: () => void;
}

export function UnarchiveButton({ onClick }: Props) {
  return (
    <IconButton
      box
      accent
      classContainer="py-2"
      icon={faBoxOpen}
      color={{ filled: "#B0B0B0", unfilled: "#B0B0B0" }}
      onClick={onClick}
    ></IconButton>
  );
}
