import Marketplace from "./Marketplace";
import React from "react";
import { IProduct } from "../../lib/types.d";
import { COMMON } from "../../constants";
import { createServerClient } from "../../utils/supabaseServer";

export default async function MarketPlacePage() {
  const products = await getMarketplaceProducts();

  return (
    <>
      <Marketplace products={products} />
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
    ),likes (
      id
    ), reviews (
      overall
    )
  `
    )
    .eq("is_public", true);

  if (productsError) throw productsError;

  productsData?.map(async (product: IProduct, index: number) => {
    if (
      !product.product_multimedia[0] ||
      !product.product_multimedia[0].p_principal
    )
      return;

    product.product_multimedia[0].p_principal =
      !product.product_multimedia || !product.product_multimedia[0].p_principal
        ? `${COMMON.MARKETPLACE_PRODUCT}`
        : `${product.product_multimedia[0].p_principal}`;

    productsData[index] = product;
  });

  return productsData as IProduct[];
}