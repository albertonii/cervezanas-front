import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { t } from "i18next";
import React from "react";
import { IconButton } from "./IconButton";

interface Props {
  onClick?: () => void;
}

export function AddCardButton({ onClick }: Props) {
  return (
    <IconButton
      onClick={onClick}
      classContainer="transition-all ease-in duration-300 border-2 border-bear-light inline-flex items-center text-sm font-medium mb-2 md:mb-0 bg-purple-500 px-5 py-2 hover:shadow-lg tracking-wider text-beer-softBlonde hover:text-beer-dark rounded-full hover:bg-beer-blonde "
      icon={faShoppingCart}
      size="small"
      isActive={false}
      primary
      classSpanChildren="pl-0 pr-1 py-1"
    >
      {t("add")}
    </IconButton>
  );
}
