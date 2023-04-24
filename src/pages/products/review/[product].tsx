import Image from "next/image";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Layout } from "../../../components";
import { useMessage } from "../../../components/message";
import { NewProductReview } from "../../../components/reviews";
import { Product, ProductMultimedia } from "../../../lib/types.d";
import { formatCurrency } from "../../../utils/formatCurrency";
import { supabase } from "../../../utils/supabaseClient";

interface Props {
  product: IProduct[];
  multimedia: IProductMultimedia[];
}

export default function ReviewProduct(props: Props) {
  const { t } = useTranslation();
  const { product, multimedia } = props;
  const { handleMessage } = useMessage();

  return (
    <div className="container mx-auto sm:py-2 lg:py-3 h-full">
      <h1 className="text-2xl font-bold">{t("review_product")}</h1>

      <p className="text-gray-500">
        Bienvenido/a, te invitamos a valorar el siguiente producto y ayudar al
        resto de usuarios. Sólo te llevará unos minutos y podrás entrar en
        nuestro sorteo mensual de Opina y Gana.
      </p>

      {/* Product Image Title and Price to be reviewed */}
      <div className="flex flex-col mt-6">
        <Image
          src={multimedia[0].p_principal}
          width={100}
          height={100}
          alt={"Product to be reviewe"}
        />
        <div className="ml-6">
          <h2 className="text-xl font-bold">{product[0].name}</h2>

          <p className="text-gray-500">{formatCurrency(product[0].price)}</p>
          <p className="text-gray-500">{product[0].description}</p>
        </div>

        {/* Review Form */}
        <div className="flex flex-col my-12">
          {/* New Product Review */}
          <div className="col-span-12 flex flex-col justify-center item-center mx-6">
            <NewProductReview
              productId={product[0].id}
              ownerId={product[0].owner_id}
              isReady={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: { params: any }) {
  const { params } = context;
  const { product: productId } = params;

  let { data: product, error: productsError } = await supabase
    .from("products")
    .select(
      `*,
      beers (
        *
      ),
      product_multimedia (
        p_principal
      )
      `
    )
    .eq("id", productId);

  if (productsError) throw productsError;

  if (product == null) return { notFound: true };

  product[0].product_multimedia[0].p_principal =
    product[0].product_multimedia[0]?.p_principal == undefined || null
      ? `/marketplace_product_default.png`
      : product[0].product_multimedia[0].p_principal;

  return {
    props: {
      product: product,
      multimedia: product[0]?.product_multimedia,
    },
  };
}
