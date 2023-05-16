import Product from "./Product";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { VIEWS } from "../../../constants";

export default async function ProductId({ searchParams }: any) {
  const { product, multimedia, reviews, marketplaceProducts } =
    await getProductData(searchParams);

  return (
    <>
      <Product
        product={product}
        multimedia={multimedia}
        reviews={reviews}
        marketplaceProducts={marketplaceProducts ?? []}
      />
    </>
  );
}

async function getProductData(searchParams: any) {
  const { productId } = searchParams;

  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: VIEWS.ROUTE_SIGNIN,
        permanent: false,
      },
    };

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

  return {
    product: product,
    multimedia: product[0]?.product_multimedia ?? [],
    reviews: product[0]?.reviews ?? [],
    marketplaceProducts: products ?? [],
  };
}
