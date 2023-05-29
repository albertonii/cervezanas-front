import { IMonthlyProduct } from "../../lib/types";
import { createServerClient } from "../../utils/supabaseServer";
import Homepage from "./Homepage";

export const metadata = {
  title: { default: "Comunidad Cervezanas", template: `%s | Cervezanas` },
  description: "Tu portal de descubrimiento de cervezas artesanales",
};

export default async function Mainpage() {
  const monthlyProducts = await getMonthlyProducts();

  return (
    <>
      <Homepage monthlyProducts={monthlyProducts} />
    </>
  );
}

async function getMonthlyProducts() {
  const supabase = createServerClient();

  const { data: monthlyProducts, error: monthlyProductsError } = await supabase
    .from("monthly_products")
    .select(
      `
    *,
    product_id (
      *, 
      beers (*),
      product_multimedia (
        p_principal
      ),
      product_inventory (
        quantity
      ),likes (
        id
      ), reviews (
        overall
      )
    )
  `
    );

  if (monthlyProductsError) throw monthlyProductsError;
  return monthlyProducts as IMonthlyProduct[];
}
