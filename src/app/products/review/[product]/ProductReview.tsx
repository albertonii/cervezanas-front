"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { IProduct, IProductMultimedia } from "../../../../lib/types.d";
import { NewProductReview } from "../../../../components/reviews";
import { formatCurrency } from "../../../../utils/formatCurrency";

interface Props {
  product: IProduct;
}

export default function ProductReview({ product }: Props) {
  const { t } = useTranslation();

  const multimedia: IProductMultimedia[] = product.product_multimedia;

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
          <h2 className="text-xl font-bold">{product.name}</h2>

          <p className="text-gray-500">{formatCurrency(product.price)}</p>
          <p className="text-gray-500">{product.description}</p>
        </div>

        {/* Review Form */}
        <div className="my-12 flex flex-col">
          {/* New Product Review */}
          <div className="item-center col-span-12 mx-6 flex flex-col justify-center">
            <NewProductReview
              productId={product.id}
              ownerId={product.owner_id}
              isReady={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
