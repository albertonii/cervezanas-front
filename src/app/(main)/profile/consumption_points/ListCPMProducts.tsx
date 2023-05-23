"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { SearchCheckboxCPProducts } from "./SearchCheckboxCPProducts";

interface Props {
  form: UseFormReturn<any, any>;
}

export default function ListCPMProducts({ form }: Props) {
  return (
    <>
      <SearchCheckboxCPProducts form={form} />
    </>
  );
}
