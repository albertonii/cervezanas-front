"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { SimilarProducts } from "./SimilarProducts";

export function DisplaySimilarProducts() {
  const t = useTranslations();
  return (
    <section className="rounded-lg border-2 border-beer-softBlondeBubble bg-beer-blonde/20 bg-beer-softFoam bg-[url('/assets/rec-graf4c.png')] bg-contain bg-right bg-no-repeat 2xl:w-[1450px] xl:w-[1250px] lg:w-[950px] md:w-[750px] sm:w-[600px] w-[300px] m-auto sm:overflow-visible overflow-hidden">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold uppercase text-cerv-coal tracking-wide">
          {t("similar_products")}
        </h2>

        <div className="mt-6 md:flex sd:flex-row block space-x-4">
          <SimilarProducts />
          <SimilarProducts />
          <SimilarProducts />
          <SimilarProducts />
        </div>
      </div>
    </section>
  );
}
