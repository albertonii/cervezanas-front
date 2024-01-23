import { IMonthlyProduct, IProduct } from "../../../../../../lib/types";
import createServerClient from "../../../../../../utils/supabaseServer";
import ProductsMenu from "./ProductsMenu";

export default async function MonthlyProductsPage() {
  const productsData = getProductsData();
  const monthlyProductsData = getMonthlyProductsData();
  const [products, mProducts] = await Promise.all([
    productsData,
    monthlyProductsData,
  ]);

  return <ProductsMenu products={products} mProducts={mProducts} />;
}

async function getProductsData() {
  const supabase = await createServerClient();

  const { data: products, error } = await supabase.from("products").select(
    `
      *
    `
  );

  if (error) throw error;

  return products as IProduct[];
}

async function getMonthlyProductsData() {
  const supabase = await createServerClient();

  const { data: products, error } = await supabase
    .from("monthly_products")
    .select(
      `
        *,
        products (
          *,
          product_multimedia (*)
        )
      `
    );

  if (error) throw error;

  return products as IMonthlyProduct[];
}
