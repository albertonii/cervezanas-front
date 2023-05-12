import useFilters from "../hooks/useFilters";
import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { IProduct } from "../lib/types.d";
import { useAuth } from "../components/Auth";
import { StoreItem } from "../components/Cart";
import { Filters, MarketplaceHeader } from "../components";
import { COMMON } from "../constants";

interface Props {
  products: IProduct[];
  reviews: { overall: number }[];
}

export default function MarketPlace({ products }: Props) {
  const [loading, setLoading] = useState(true);
  const { loggedIn } = useAuth();

  const { filterProducts } = useFilters();
  const filteredProducts = filterProducts(products);
  console.log(filteredProducts);

  useEffect(() => {
    if (loggedIn) {
      setLoading(false);
    }

    return () => {
      setLoading(true);
    };
  }, [loggedIn]);

  return (
    <>
      {!loading && (
        <div className="container mx-auto sm:py-2 lg:py-3 ">
          <MarketplaceHeader>
            <Filters />
          </MarketplaceHeader>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
            {filteredProducts &&
              filteredProducts.map((product) => (
                <div key={product.id} className="container mb-6 h-full px-3">
                  <StoreItem products={filteredProducts} product={product} />
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
}

export async function getServerSideProps() {
  const { data: productsData, error: productsError } = await supabase
    .from("products")
    .select(
      `
    *,
    beers (
      *
    ),
    product_multimedia (
      p_principal
    ),
    product_inventory (
      quantity
    ),likes (
      id
    ), reviews (
      overall
    )
  `
    )
    .eq("is_public", true);

  if (productsError) throw productsError;

  productsData?.map(async (product, index) => {
    console.log(!product.product_multimedia);
    product.product_multimedia[0].p_principal =
      !product.product_multimedia || !product.product_multimedia[0]?.p_principal
        ? `${COMMON.MARKETPLACE_PRODUCT}`
        : `${product.product_multimedia[0].p_principal}`;

    productsData[index] = product;
  });

  return {
    props: {
      products: productsData,
    },
  };
}
