import Marketplace from "./Marketplace";
import React from "react";
import { createServerClient } from "../../../utils/supabaseServer";
import { IProduct } from "../../../lib/types.d";

export default async function MarketPlacePage() {
  const productsData = getMarketplaceProducts();
  const [products] = await Promise.all([productsData]);

  // const products: IProduct[] = [
  //   {
  //     id: "1",
  //     name: "Prueba",
  //     description: "Prueba description",
  //     created_at: new Date(),
  //     social_cause_id: "11233",
  //     category: "beer",
  //     campaign_id: "12341234",
  //     owner_id: "afgasfg",
  //     product_lot: [],
  //     product_inventory: [],
  //     product_multimedia: [],
  //     reviews: [],
  //     likes: [],
  //     is_public: false,
  //     price: 2,
  //     beers: [], // Any para evitar circular dependency
  //     product_variant: [],
  //     order_item: [],
  //     awards: [],
  //     is_archived: false,
  //     state: "",
  //     status: "",
  //     type: "",
  //     product_pack: [],
  //     is_monthly: false,
  //   },
  // ];

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
    ),likes (
      id
    ), reviews (
      overall
    )
  `
    )
    .eq("is_public", true);

  if (productsError) throw productsError;

  /*
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
  */

  return productsData as IProduct[];
}
