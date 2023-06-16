import Product from "./Product";
import { VIEWS } from "../../../../../constants";
import { createServerClient } from "../../../../../utils/supabaseServer";
import { redirect } from "next/navigation";
import { IProduct } from "../../../../../lib/types.d";

export default async function ProductId({ params }: any) {
  const { id } = params;

  const productData = await getProductData(id);
  const marketplaceData = await getMarketplaceData();

  const [product, marketplaceProducts] = await Promise.all([
    productData,
    marketplaceData,
  ]);

  return (
    <>
      <Product
        product={product}
        // marketplaceProducts={marketplaceProducts ?? []}
        marketplaceProducts={[]}
      />
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
    redirect(VIEWS.SIGN_IN);
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .select(
      `*,
      beers (
        *
      ),
      product_multimedia (
        p_principal,
        p_back,
        p_extra_1,
        p_extra_2,
        p_extra_3
      ),
      reviews (
        *,
        users (
          created_at,
          username
        )
      )`
    )
    .eq("id", productId);

  if (productError) throw productError;

  return product[0] as IProduct;
}

async function getMarketplaceData() {
  // Create authenticated Supabase Client
  const supabase = createServerClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
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

  return products;
}
