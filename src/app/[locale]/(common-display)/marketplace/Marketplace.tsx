"use client";

import useFilters from "../../../../hooks/useFilters";
import React from "react";
import { StoreItem } from "../../components/Cart/StoreItem";
import { IProduct } from "../../../../lib/types";
import { Filters } from "../../components/Filters";
import { MarketplaceHeader } from "../../components/MarketplaceHeader";

interface Props {
  products: IProduct[];
}

export default function Marketplace({ products }: Props) {
  const { filterProducts } = useFilters();
  const filteredProducts = filterProducts(products);
  return (
    <section className="container mx-auto bg-cerv-coal bg-[url('/assets/rec-graf6.png')] bg-contain sm:py-2 lg:py-3 ">
      <MarketplaceHeader>
        <Filters />
      </MarketplaceHeader>

      <article className="m-auto grid grid-cols-1 bg-white pt-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
        {filteredProducts &&
          filteredProducts.map((product) => (
            <div key={product.id} className="container mb-6 h-full px-3">
              <StoreItem products={filteredProducts} product={product} />
            </div>
          ))}
      </article>
    </section>
  );
}
