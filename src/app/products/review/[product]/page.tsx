import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { ROUTE_SIGNIN } from "../../../../config";
import { COMMON } from "../../../../constants";
import ProductReview from "./ProductReview";

export default async function ReviewProduct({ searchParams }: any) {
  const { product, multimedia } = await getProductReview(searchParams);

  return (
    <>
      <ProductReview product={product} multimedia={multimedia} />
    </>
  );
}

async function getProductReview(searchParams: any) {
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
        destination: ROUTE_SIGNIN,
        permanent: false,
      },
    };

  const { data: product, error: productsError } = await supabase
    .from("products")
    .select(
      `*,
      beers (
        *
      ),
      product_multimedia (
        p_principal
      )
      `
    )
    .eq("id", productId);

  if (productsError) throw productsError;

  if (product == null) return { notFound: true };

  product[0].product_multimedia[0].p_principal =
    product[0].product_multimedia[0]?.p_principal == undefined || null
      ? `${COMMON.MARKETPLACE_PRODUCT}`
      : product[0].product_multimedia[0].p_principal;

  return {
    product: product,
    multimedia: product[0]?.product_multimedia,
  };
}
