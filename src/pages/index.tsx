import Head from "next/head";
import Hero from "../components/homepage/Hero";
import MonthlyBeers from "../components/homepage/MonthlyBeers";
import { IMonthlyProduct } from "../lib/types";
import { supabase } from "../utils/supabaseClient";

interface Props {
  monthlyProducts: IMonthlyProduct[];
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

  return {
    props: {
      monthlyProducts,
    },
  };
}
