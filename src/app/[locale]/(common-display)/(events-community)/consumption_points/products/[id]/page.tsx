import { VIEWS } from "../../../../../../../constants";
import { redirect } from "next/navigation";
import { IProduct } from "../../../../../../../lib/types";
import createServerClient from "../../../../../../../utils/supabaseServer";

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
      {/* <Product product={product} marketplaceProducts={marketplaceProducts} /> */}
    </>
  );
}

async function getProductData(cpId: string) {
  // Create authenticated Supabase Client
  const supabase = await createServerClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }

  const { data: cpmProducts, error: productError } = await supabase
    .from("cpm_products")
    .select(
      `*,
      product_pack_id (*),
      cp_id (*)
      `
    )
    .eq("cp_id", cpId);

  if (productError) throw productError;
  return cpmProducts as any[];
}

async function getMarketplaceData() {
  // Create authenticated Supabase Client
  const supabase = await createServerClient();

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(VIEWS.SIGN_IN);
  }

  const { data: productsData, error: productsError } = await supabase
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

  return productsData as IProduct[];
}
