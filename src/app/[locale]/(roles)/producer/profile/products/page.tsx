import { ConfigureProducts } from './ConfigureProducts';

export default async function ProductsPage() {
  // const { products } = await getProductsData();
  // if (!products) return null;
  return (
    <>
      <ConfigureProducts />
    </>
  );
}

/*
async function getProductsData() {
  const supabase = createServerClient();

 // Be careful when protecting pages. The server gets the user session from the cookies, which can be spoofed by anyone.
  const session = await readUserSession();

//   if (!session)
//     return {
//       redirect: {
//         destination: ROUTE_SIGNIN,
//         permanent: false,
//       },
//     };

  const { data: productsData, error: productsError } = await supabase
    .from("products")
    .select(
      `
        *, 
        product_multimedia (*),
        product_inventory (*),
        likes (*),
        product_lots (*),
        beers (*), 
        product_packs (*)
      `
    )
    .eq("owner_id", session.id);

//   if (productsError) throw productsError;

  return { products: productsData as IProduct[] };
}
*/
