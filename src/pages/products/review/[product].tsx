import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";
import { NewProductReview } from "../../../components/reviews";
import { IProduct, IProductMultimedia } from "../../../lib/types.d";
import { formatCurrency } from "../../../utils/formatCurrency";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { ROUTE_SIGNIN } from "../../../config";
import { COMMON } from "../../../constants";

interface Props {
  product: IProduct[];
  multimedia: IProductMultimedia[];
}

export default function ReviewProduct(props: Props) {
  const { t } = useTranslation();
  const { product, multimedia } = props;

  return (
    <div className="container mx-auto h-full sm:py-2 lg:py-3">
      <h1 className="text-2xl font-bold">{t("review_product")}</h1>

      <p className="text-gray-500">
        Bienvenido/a, te invitamos a valorar el siguiente producto y ayudar al
        resto de usuarios. Sólo te llevará unos minutos y podrás entrar en
        nuestro sorteo mensual de Opina y Gana.
      </p>

      {/* Product Image Title and Price to be reviewed */}
      <div className="mt-6 flex flex-col">
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
        <div className="my-12 flex flex-col">
          {/* New Product Review */}
          <div className="item-center col-span-12 mx-6 flex flex-col justify-center">
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

export async function getServerSideProps(ctx: { params: any }) {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);

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

  const { params } = ctx;
  const { product: productId } = params;

  const { data: product, error: productsError } = await supabase
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
      ? `${COMMON.MARKETPLACE_PRODUCT}`
      : product[0].product_multimedia[0].p_principal;

  return {
    props: {
      product: product,
      multimedia: product[0]?.product_multimedia,
    },
  };
}
