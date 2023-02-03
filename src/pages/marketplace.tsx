import React from "react";
import { SupabaseProps } from "../constants";
import { supabase } from "../utils/supabaseClient";
import StoreItem from "../components/Cart/StoreItem";
import { Beer } from "../lib/types";
import Layout from "../components/Layout";

const productsUrl = `${SupabaseProps.BASE_URL}${SupabaseProps.STORAGE_PRODUCTS_IMG_URL}`;
const pPrincipalUrl = `${productsUrl}${SupabaseProps.P_PRINCIPAL_URL}`;

interface Props {
  beers: Beer[];
  reviews: { overall: number }[];
}

export default function MarketPlace(props: Props) {
  const { beers } = props;

  return (
    <Layout usePadding={true} useBackdrop={false}>
      <div className="container mx-auto sm:py-2 lg:py-3 ">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          {beers &&
            beers.map((beer) => (
              <div key={beer.id} className="container px-3 mb-6 h-full">
                <StoreItem beer={beer} />
              </div>
            ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  let { data: beersData, error: beersError } = await supabase.from("beers")
    .select(`
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

  if (beersError) throw beersError;

  beersData?.map(async (beer, index) => {
    beer.product_multimedia[0].p_principal =
      beer.product_multimedia[0]?.p_principal == undefined || null
        ? `/marketplace_product_default.png`
        : `${SupabaseProps.BASE_PRODUCTS_URL}${SupabaseProps.PRODUCT_P_PRINCIPAL}/${beer.owner_id}/${beer.product_multimedia[0].p_principal}`;

    beersData![index] = beer;
  });

  return {
    props: {
      beers: beersData,
    },
  };
}
