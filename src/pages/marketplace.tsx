import React, { useEffect, useState } from "react";
import { SupabaseProps } from "../constants";
import { supabase } from "../utils/supabaseClient";
import StoreItem from "../components/Cart/StoreItem";
import { Beer, Product } from "../lib/types";
import Layout from "../components/Layout";
import { useAuth } from "../components/Auth";

const productsUrl = `${SupabaseProps.BASE_URL}${SupabaseProps.STORAGE_PRODUCTS_IMG_URL}`;
const pPrincipalUrl = `${productsUrl}${SupabaseProps.P_PRINCIPAL_URL}`;

interface Props {
  products: Product[];
  reviews: { overall: number }[];
}

export default function MarketPlace(props: Props) {
  const { products } = props;

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
    <Layout usePadding={true} useBackdrop={false}>
      {!loading && (
        <div className="container mx-auto sm:py-2 lg:py-3 ">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
            {products &&
              products.map((product) => (
                <div key={product.id} className="container px-3 mb-6 h-full">
                  <StoreItem product={product} />
                </div>
              ))}
          </div>
        </div>
      )}
    </Layout>
  );
}

export async function getServerSideProps() {
  let { data: productsData, error: productsError } = await supabase.from(
    "products"
  ).select(`
    *,
    product_multimedia (
      p_principal
    ),product_inventory (
      quantity
    ),likes (
      id
    ), reviews (
      overall
    )
  `);

  if (productsError) throw productsError;

  productsData?.map(async (product, index) => {
    product.product_multimedia[0].p_principal =
      product.product_multimedia[0]?.p_principal == undefined || null
        ? `/marketplace_product_default.png`
        : `${SupabaseProps.BASE_PRODUCTS_URL}${SupabaseProps.PRODUCT_P_PRINCIPAL}/${product.owner_id}/${product.product_multimedia[0].p_principal}`;

    productsData![index] = product;
  });

  // let { data: beersData, error: beersError } = await supabase.from("beers")
  //   .select(`
  //   *,
  //   product_multimedia (
  //     p_principal
  //   ),product_inventory (
  //     quantity
  //   ),likes (
  //     id
  //   ), reviews (
  //     overall
  //   )
  // `);

  // if (beersError) throw beersError;

  // beersData?.map(async (beer, index) => {
  //   beer.product_multimedia[0].p_principal =
  //     beer.product_multimedia[0]?.p_principal == undefined || null
  //       ? `/marketplace_product_default.png`
  //       : `${SupabaseProps.BASE_PRODUCTS_URL}${SupabaseProps.PRODUCT_P_PRINCIPAL}/${beer.owner_id}/${beer.product_multimedia[0].p_principal}`;

  //   beersData![index] = beer;
  // });

  return {
    props: {
      products: productsData,
    },
  };
}
