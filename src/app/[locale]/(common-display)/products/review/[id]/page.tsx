import ProductReview from "./ProductReview";
import { redirect } from "next/navigation";
import { COMMON, VIEWS } from "../../../../../../constants";
import createServerClient from "../../../../../../utils/supabaseServer";
import { IProduct } from "../../../../../../lib/types";
import readUserSession from "../../../../../../lib/actions";

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

  console.log(productId);
  const { data: product, error: productError } = await supabase
    .from("products")
    .select(
      `
        *,
        product_multimedia (
          id,
          p_principal,
          p_back,
          p_extra_1,
          p_extra_2,
          p_extra_3,
          p_extra_4
        )
      `
    )
    .eq("id", productId)
    .single();

  if (productError) {
    console.error(productError);
    throw productError;
  }

  if (!product) throw new Error("Product not found");

  // product.product_multimedia[0].p_principal = !product.product_multimedia[0]
  //   ?.p_principal
  //   ? `${COMMON.MARKETPLACE_PRODUCT}`
  //   : product.product_multimedia[0].p_principal;

  return product as IProduct;
}
