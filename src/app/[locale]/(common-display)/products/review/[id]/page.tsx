import ProductReview from "./ProductReview";
import { COMMON } from "../../../../../../constants";
import { createServerClient } from "../../../../../../utils/supabaseServer";
import { IProduct } from "../../../../../../lib/types.d";

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
  const supabase = createServerClient();

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

  product[0].product_multimedia[0].p_principal = !product[0]
    .product_multimedia[0]?.p_principal
    ? `${COMMON.MARKETPLACE_PRODUCT}`
    : product[0].product_multimedia[0].p_principal;

  return product[0] as IProduct;
}
