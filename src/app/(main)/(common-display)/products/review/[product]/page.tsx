import { redirect } from "next/navigation";
import { COMMON, VIEWS } from "../../../../../../constants";
import { createServerClient } from "../../../../../../utils/supabaseServer";
import ProductReview from "./ProductReview";

export default async function ReviewProduct({ searchParams }: any) {
  const productData = await getProductReview(searchParams);
  const [product] = await Promise.all([productData]);

  return (
    <>
      <ProductReview product={product[0]} />
    </>
  );
}

async function getProductReview(searchParams: any) {
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
  console.log(product);
  if (productsError) throw productsError;

  if (product == null) return { notFound: true };

  product[0].product_multimedia[0].p_principal = !product[0]
    .product_multimedia[0]?.p_principal
    ? `${COMMON.MARKETPLACE_PRODUCT}`
    : product[0].product_multimedia[0].p_principal;

  return product[0];
}
