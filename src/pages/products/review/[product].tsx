import Image from "next/image";
import React from "react";
import Layout from "../../../components/Layout";
import { Product, ProductMultimedia } from "../../../lib/types";
import { supabase } from "../../../utils/supabaseClient";

interface Props {
  product: Product[];
  multimedia: ProductMultimedia[];
}

export default function ReviewProduct(props: Props) {
  const { product, multimedia } = props;

  return (
    <Layout usePadding={true} useBackdrop={false}>
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold">Review Product</h1>

        <p className="text-gray-500">
          Bienvenido/a, te invitamos a valorar el siguiente producto y ayudar al
          resto de usuarios. Sólo te llevará unos minutos y podrás entrar en
          nuestro sorteo mensual de Opina y Gana.
        </p>

        {/* Product Image Title and Price to be reviewed */}
        <div className="flex flex-col items-center justify-center">
          <Image
            src={multimedia[0].p_principal}
            width={200}
            height={200}
            alt={"Product to be reviewe"}
          />

          <h2 className="text-xl font-bold">{product[0].name}</h2>

          <p className="text-gray-500">{product[0].price}</p>

          {/* Review Form */}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: { params: any }) {
  const { params } = context;
  const { product: productId } = params;

  let { data: product, error: productsError } = await supabase
    .from("products")
    .select(
      `*,
      product_multimedia (
        *
      )`
    )
    .select("*")
    .eq("id", productId);

  if (productsError) throw productsError;

  if (product == null) return { notFound: true };

  return {
    props: {
      product: product,
      multimedia: product[0]?.productMultimedia,
    },
  };
}
