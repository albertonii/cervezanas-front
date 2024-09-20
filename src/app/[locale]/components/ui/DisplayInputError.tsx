"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { FieldError, Merge } from "react-hook-form";

interface Props {
  message: string | FieldError | Merge<FieldError, any> | undefined;
}

export function DisplayInputError({ message }: Props) {
  const t = useTranslations();

  // Función para obtener el mensaje de error adecuado
  const getErrorMessage = (
    message: string | FieldError | Merge<FieldError, any> | undefined
  ) => {
    if (typeof message === "string") {
      return message; // Si es una cadena, devolver tal cual
    } else if (message && typeof message === "object" && message.message) {
      return message.message; // Si es un objeto FieldError, devolver su propiedad 'message'
    }
    return ""; // Si es undefined o no tiene un mensaje, devolver una cadena vacía
  };

  return (
    <span className="font-semibold text-red-400">
      {t(getErrorMessage(message))}
    </span>
  );
}
