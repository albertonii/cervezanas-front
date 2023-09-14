import React from "react";
import { faBoxArchive } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "./IconButton";

interface Props {
  onClick?: () => void;
}

export function ArchiveButton({ onClick }: Props) {
  return (
    <IconButton
      box
      accent
      classContainer="py-2"
      icon={faBoxArchive}
      color={{ filled: "#B0B0B0", unfilled: "#B0B0B0" }}
      onClick={onClick}
      title={"Archive this product"}
    ></IconButton>
  );
}
