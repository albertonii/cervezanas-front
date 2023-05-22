"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { SearchCheckboxCPProducts } from "../../../app/(main)/profile/consumption_points/SearchCheckboxCPProducts";

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
