import { ROUTE_SIGNIN } from "../../../config";
import { IProduct } from "../../../lib/types.d";
import { createServerClient } from "../../../utils/supabaseServer";
import { Products } from "./Products";

export default async function ProductsPage() {
  const { products } = await getProductsData();
  if (!products) return null;
  return (
    <>
      <Products products={products} />
    </>
  );
}

async function getProductsData() {
  const supabase = createServerClient();

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

  const { data: productsData, error: productsError } = await supabase
    .from("products")
    .select(
      `
        *, 
        product_multimedia (*),
        product_inventory (*),
        likes (*),
        product_lot (*),
        beers (*), 
        product_pack (*)
      `
    )
    .eq("owner_id", session.user.id);

  if (productsError) throw productsError;

  return { products: productsData as IProduct[] };
}
