import React from "react";
import { NextApiRequest } from "next";
import { SupabaseProps } from "../constants";
import { Beer } from "../types";
import { supabase } from "../utils/supabaseClient";
import StoreItem from "../components/StoreItem";

const productsUrl = `${SupabaseProps.BASE_URL}${SupabaseProps.STORAGE_PRODUCTS_IMG_URL}`;
const pPrincipalUrl = `${productsUrl}${SupabaseProps.P_PRINCIPAL_URL}`;

interface Props {
  beers: Beer[];
}

export default function MarketPlace(props: Props) {
  const { beers } = props;

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 lg:mx-48 mt-12 justify-center">
      {beers &&
        beers.map((beer) => (
          <div key={beer.id} className="container px-3 mb-6">
            <StoreItem beer={beer} />
          </div>
        ))}
    </div>
  );
}

export async function getServerSideProps(req: NextApiRequest) {
  let { data: beersData, error: beersError } = await supabase.from("beers")
    .select(`
    *,
    product_multimedia (
      p_principal
    ),product_inventory (
      quantity
    )
  `);

  if (beersError) throw beersError;

  beersData?.map(async (beer, index) => {
    console.log(beer.product_multimedia);
    beer.product_multimedia[0].p_principal =
      beer.product_multimedia[0]?.p_principal == undefined || null
        ? `marketplace_product_default.png`
        : `https://kvdearmedajqvexxhmrk.supabase.co/storage/v1/object/public/products/p_principal/${beer.product_multimedia[0].p_principal}`;

    beersData![index] = beer;
  });

  return {
    props: {
      beers: beersData,
    },
  };
}
