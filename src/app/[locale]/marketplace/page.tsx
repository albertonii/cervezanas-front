import Marketplace from "./Marketplace";
import React from "react";
import { createServerClient } from "../../../utils/supabaseServer";
import { IProduct } from "../../../lib/types.d";

export default async function MarketPlacePage() {
  const productsData = getMarketplaceProducts();
  const [products] = await Promise.all([productsData]);

  return (
    <>
      <Marketplace products={products ?? []} />
    </>
  );
}

async function getMarketplaceProducts() {
  const supabase = createServerClient();

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
    ),
    likes (
      id
    ), 
    reviews (
      overall
    ),
    product_packs (*)
  `
    )
    .eq("is_public", true);

  if (productsError) throw productsError;

  return productsData as IProduct[];
}
