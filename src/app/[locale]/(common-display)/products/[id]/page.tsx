import Product from "./Product";
import { IProduct } from "../../../../../lib/types.d";
import createServerClient from "../../../../../utils/supabaseServer";

export default async function ProductId({ params }: any) {
  const { id } = params;

  const productData = await getProductData(id);
  // const marketplaceData = await getMarketplaceData();

  const [product] = await Promise.all([productData]);

  return (
    <>
      <Product product={product} />
    </>
  );
}

async function getProductData(productId: string) {
  const supabase = await createServerClient();

  const { data: product, error: productError } = await supabase
    .from("products")
    .select(
      `
      *,
      beers (
        *
      ),
      product_multimedia (
        *,
        p_principal,
        p_back,
        p_extra_1,
        p_extra_2,
        p_extra_3
      ),
      product_packs (*),
      reviews (
        *,
        users (
          created_at,
          username
        )
      )
      `
    )
    .eq("id", productId)
    .single();

  if (productError) throw productError;

  return product as IProduct;
}

async function getMarketplaceData() {
  const supabase = await createServerClient();

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
