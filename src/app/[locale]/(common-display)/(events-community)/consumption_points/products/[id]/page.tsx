import Product from "./CPProduct";

import { VIEWS } from "../../../../../../../constants";
import { createServerClient } from "../../../../../../../utils/supabaseServer";
import { redirect } from "next/navigation";
import { ICPMProducts, IProduct } from "../../../../../../../lib/types.d";

export default async function ProductId({ params }: any) {
  const { id } = params;

  const productData = await getProductData(id);
  const marketplaceProductsData = await getMarketplaceData();
  const [product, marketplaceProducts] = await Promise.all([
    productData,
    marketplaceProductsData,
  ]);

  return (
    <>
      <Product product={product} marketplaceProducts={marketplaceProducts} />
    </>
  );
}

async function getProductData(productId: string) {
  // Create authenticated Supabase Client
  const supabase = createServerClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(VIEWS.ROUTE_SIGNIN);
  }

  const { data: product, error: productError } = await supabase
    .from("cpm_products")
    .select(
      `*,
      product_id (
        *,
        beers (
          *
        ),
        product_multimedia (
          p_principal
        ),
        reviews (
          *,
          users (
            created_at,
            username
          )
        )
      ),
      cp_id (*)
      `
    )
    .eq("id", productId);

  if (productError) throw productError;

  return product[0] as ICPMProducts;
}

async function getMarketplaceData() {
  // Create authenticated Supabase Client
  const supabase = createServerClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(VIEWS.ROUTE_SIGNIN);
  }

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select(
      `
      id,
      price,
      product_multimedia (
        p_principal
      )
    `
    )
    .eq("is_public", true);

  if (productsError) throw productsError;

  return products as IProduct[];
}
