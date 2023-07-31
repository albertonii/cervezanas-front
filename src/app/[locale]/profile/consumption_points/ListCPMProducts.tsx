"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { SearchCheckboxCPProductsPack } from "./SearchCheckboxCPProductsPack";

interface Props {
  form: UseFormReturn<any, any>;
  productItems?: string[];
}

export default function ListCPMProducts({ form, productItems }: Props) {
  return (
    <>
      <SearchCheckboxCPProductsPack form={form} productItems={productItems} />
    </>
  );
}
