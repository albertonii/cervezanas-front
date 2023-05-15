"use client";

import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
  message: string;
}

export function DisplayInputError({ message }: Props) {
  const { t } = useTranslation();
  return <span className="font-semibold text-red-400">{t(message)}</span>;
}
