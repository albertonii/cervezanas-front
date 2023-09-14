"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface Props {
  message?: string;
}

export function DisplayInputError({ message }: Props) {
  const t = useTranslations();
  return <span className="font-semibold text-red-400">{t(message)}</span>;
}
