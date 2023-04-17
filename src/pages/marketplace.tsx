import React, { useEffect, useState } from "react";
import { SupabaseProps } from "../constants";
import { supabase } from "../utils/supabaseClient";
import { Product } from "../lib/types";
import { useAuth } from "../components/Auth";
import { StoreItem } from "../components/Cart";

interface Props {
  products: Product[];
  reviews: { overall: number }[];
}

export default function MarketPlace({ products }: Props) {
  const [loading, setLoading] = useState(true);
  const { loggedIn } = useAuth();

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
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
            {products &&
              products.map((product) => (
                <div key={product.id} className="container px-3 mb-6 h-full">
                  <StoreItem products={products} product={product} />
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
    product.product_multimedia[0].p_principal =
      product.product_multimedia[0]?.p_principal == undefined || null
        ? `/marketplace_product_default.png`
        : `${SupabaseProps.BASE_PRODUCTS_ARTICLES_URL}${product.product_multimedia[0].p_principal}`;

    productsData![index] = product;
  });

  return {
    props: {
      products: productsData,
    },
  };
}
