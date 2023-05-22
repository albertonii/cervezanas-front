import Product from "./Product";
import { VIEWS } from "../../../../constants";
import { createServerClient } from "../../../../utils/supabaseServer";
import { redirect } from "next/navigation";

export default async function ProductId({ searchParams }: any) {
  const productData = await getProductData(searchParams);
  const marketplaceData = await getMarketplaceData();

  const [product, marketplaceProducts] = await Promise.all([
    productData,
    marketplaceData,
  ]);
  console.log("hola!");
  const multimedia = product?.product_multimedia;
  const reviews = product?.reviews;

  return (
    <>
      <Product
        product={product[0]}
        multimedia={multimedia}
        reviews={reviews}
        // marketplaceProducts={marketplaceProducts ?? []}
        marketplaceProducts={[]}
      />
    </>
  );
}

async function getProductData(searchParams: any) {
  const { productId } = searchParams;

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
    .from("products")
    .select(
      `*,
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
      )`
    )
    .eq("id", productId);

  if (productError) throw productError;

  if (product == null) return { notFound: true };

  return product[0];
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

  return products;
}
