"use client";

import React from "react";
import { SearchCheckboxCPProducts } from "../../../app/profile/consumption_points/SearchCheckboxCPProducts";
import { UseFormReturn } from "react-hook-form";

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
