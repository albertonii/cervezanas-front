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
          <div className="flex flex-col space-y-4">
            {product.product_pack.map((p) => (
              <div key={p.id} className="md:48 w-32 space-y-2 lg:w-56">
                <PackItem
                  marketplaceProducts={marketplaceProducts}
                  product={product}
                  pack={p}
                />
                {/* <PackUnits
                  product={product}
                  pack={p}
                  marketplaceProducts={marketplaceProducts}
                /> */}
              </div>
            ))}
          </div>
        </fieldset>
      </div>
    </>
  );
}
