import React from "react";
import Button from "./Button";

interface Props {
  onClick?: () => void;
}

export default function DecreaseButton({ onClick }: Props) {
  return (
    <Button box accent onClick={onClick} class={"py-2"}>
      -
    </Button>
  );
}
