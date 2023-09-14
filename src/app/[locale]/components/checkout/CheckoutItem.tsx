"use client";

import Link from "next/link";
import CheckoutPackItem from "./CheckoutPackItem";
import DeliveryError from "../../(common-display)/cart/DeliveryError";
import useFetchProductById from "../../../../hooks/useFetchProductById";
import React, { useEffect } from "react";
import { Spinner } from "../common";
import { useLocale, useTranslations } from "next-intl";
import { IProductPackCartItem } from "../../../../lib/types";
import ShippingAddress from "./ShippingAddress";

interface Props {
  productPack: IProductPackCartItem;
}

export function CheckoutItem({ productPack }: Props) {
  const t = useTranslations();
  const locale = useLocale();

  const {
    data: productWithInfo,
    isError,
    isLoading,
    refetch,
  } = useFetchProductById(productPack.id);

  useEffect(() => {
    refetch();
  }, []);

  if (isLoading) return <Spinner color={"beer-blonde"} />;

  if (isError) return <div className="text-center text-red-500">Error</div>;

  if (!productWithInfo) return null;
  console.log(productWithInfo);
  return (
    <>
      {productPack && (
        <div className="mt-4 space-y-4">
          <Link href={`/products/${productWithInfo.id}`} locale={locale}>
            <p className="space-x-2 text-xl">
              <span className="font-semibold ">{t("product_name")}:</span>

              <span className="hover:font-semibold hover:text-beer-gold">
                {productPack.name}
              </span>
            </p>
          </Link>

          <ShippingAddress />

          {productPack.packs.map((pack) => (
            <>
              <div key={pack.id}>
                <CheckoutPackItem
                  productPack={productPack}
                  productWithInfo={productWithInfo}
                  pack={pack}
                />
              </div>
            </>
          ))}
        </div>
      )}
    </>
  );
}
