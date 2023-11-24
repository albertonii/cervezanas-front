import ProductReview from "./ProductReview";
import { redirect } from "next/navigation";
import { COMMON, VIEWS } from "../../../../../../constants";
import createServerClient from "../../../../../../utils/supabaseServer";
import { IProduct } from "../../../../../../lib/types";
import readUserSession from "../../../../../actions";

export default async function ReviewProduct({ params }: any) {
  const { id } = params;

  const productData = getProductReview(id);
  const [product] = await Promise.all([productData]);

  return (
    <>
      <ProductReview product={product} />
    </>
  );
}

async function getProductReview(productId: string) {
  // Create authenticated Supabase Client
  const supabase = await createServerClient();

  const {
    data: { session },
  } = await readUserSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }

  const { data: product, error: productsError } = await supabase
    .from("products")
    .select(
      `*,
      beers (
        *
      ),
      product_multimedia (
        *,
        p_principal
      )
      `
    )
    .eq("id", productId)
    .single();

  if (productsError) throw productsError;

  if (!product) throw new Error("Product not found");

  product.product_multimedia[0].p_principal = !product.product_multimedia[0]
    ?.p_principal
    ? `${COMMON.MARKETPLACE_PRODUCT}`
    : product.product_multimedia[0].p_principal;

  return product as IProduct;
}
