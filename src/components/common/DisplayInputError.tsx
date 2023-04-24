import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
  message: string;
}

export default function DisplayInputError({ message }: Props) {
  const { t } = useTranslation();
  return <span className="text-red-400 font-semibold">{t(message)}</span>;
}
