import React from "react";
import { useTranslation } from "react-i18next";
import { SimilarProduct } from ".";

export function DisplaySimilarProducts() {
  const { t } = useTranslation();
  return (
    <div className="bg-beer-softFoam rounded-lg ">
      <div className="mx-auto max-w-2xl py-6 px-4 sm:py-10 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          {t("similar_products")}
        </h2>

        <div className="mt-6 space-x-4 flex flex-row">
          <SimilarProduct />
          <SimilarProduct />
          <SimilarProduct />
          <SimilarProduct />
        </div>
      </div>
    </div>
  );
}
