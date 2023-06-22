"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { IProduct } from "../../../../../lib/types";
import PackItem from "./PackItem";
import PackUnits from "./PackUnits";

interface Props {
  product: IProduct;
  marketplaceProducts: IProduct[];
}

export default function Packs({ product, marketplaceProducts }: Props) {
  const t = useTranslations();

  return (
    <>
      {/* <!-- Sizes --> */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900">
            {t("product_packs")}
          </h4>
        </div>

        <fieldset className="mt-4">
          <legend className="sr-only">{t("choose_pack")}</legend>
          <div className="grid grid-cols-1 gap-2 rounded border bg-beer-blonde/20 p-2 sm:grid-cols-2 xl:grid-cols-3">
            {product.product_pack
              .slice() // Copy the array to avoid mutating the original
              .sort((a, b) => a.quantity - b.quantity) // Sort by quantity
              .map((p) => (
                <div key={p.id} className="space-y-2 ">
                  <PackItem
                    marketplaceProducts={marketplaceProducts}
                    product={product}
                    pack={p}
                  />
                </div>
              ))}
          </div>
        </fieldset>
      </div>
    </>
  );
}
