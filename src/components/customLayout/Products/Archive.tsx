import React, { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { Product } from "../../../lib/types";
import ProductsArchiveList from "./ProductsArchiveList";

interface Props {
  products: Product[];
  handleSetProducts: Dispatch<SetStateAction<any>>;
}

/**
 *
 * @returns Products archived are not public and can only be viewed by the seller.
 * Useful to keep track of products that have been sold or are no longer available.
 */
export default function Archive({ products, handleSetProducts }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <div className="py-6 px-4 " aria-label="Products">
        <div className="flex flex-col items-center">
          <div className="text-4xl pr-12">{t("products_archive")}</div>

          <ProductsArchiveList
            products={products}
            handleSetProducts={handleSetProducts}
          />
        </div>
      </div>
    </>
  );
}
