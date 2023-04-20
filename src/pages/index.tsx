import Head from "next/head";
import Hero from "../components/homepage/Hero";
import MonthlyBeers from "../components/homepage/MonthlyBeers";
import { Product } from "../lib/types";
import { supabase } from "../utils/supabaseClient";

interface Props {
  monthlyProducts: Product[];
}

export default function Home({ monthlyProducts }: Props) {
  return (
    <>
      <Head>
        <title>Comunidad Cervezanas</title>
      </Head>

      <>
        {/* First section  */}
        <div className="h-full mt-[10vh]">
          <Hero />
          <MonthlyBeers monthlyProducts={monthlyProducts} />
        </div>
      </>
    </>
  );
}

export async function getServerSideProps() {
  const { data: monthlyProducts, error: monthlyProductsError } = await supabase
    .from("products")
    .select(
      `
    *,
    beers (
      *
    ),
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
  `
    )
    .eq("is_monthly", true);

  if (monthlyProductsError) throw monthlyProductsError;

  return {
    props: {
      monthlyProducts,
    },
  };
}
