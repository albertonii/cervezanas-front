"use client";

import useFilters from "../../../../hooks/useFilters";
import React from "react";
import { StoreItem } from "../../components/Cart";
import { IProduct } from "../../../../lib/types.d";
import { Filters } from "../../components/Filters";
import { MarketplaceHeader } from "../../components/MarketplaceHeader";

interface Props {
  products: IProduct[];
}

export default function Marketplace({ products }: Props) {
  const { filterProducts } = useFilters();
  const filteredProducts = filterProducts(products);
  return (
    <>
      <div className="container mx-auto sm:py-2 lg:py-3 ">
        <MarketplaceHeader>
          <Filters />
        </MarketplaceHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          {filteredProducts &&
            filteredProducts.map((product) => (
              <div key={product.id} className="container mb-6 h-full px-3">
                <StoreItem products={filteredProducts} product={product} />
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
