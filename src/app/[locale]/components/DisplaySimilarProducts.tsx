"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { SimilarProducts } from "./SimilarProducts";

export function DisplaySimilarProducts() {
  const t = useTranslations();
  return (
    <div className="rounded-lg bg-beer-softFoam ">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          {t("similar_products")}
        </h2>

        <div className="mt-6 flex flex-row space-x-4">
          <SimilarProducts />
          <SimilarProducts />
          <SimilarProducts />
          <SimilarProducts />
        </div>
      </div>
    </div>
  );
}
