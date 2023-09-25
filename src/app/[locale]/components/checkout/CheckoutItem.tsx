"use client";

import Link from "next/link";
import CheckoutPackItem from "./CheckoutPackItem";
import DeliveryError from "../../(common-display)/cart/DeliveryError";
import useFetchProductById from "../../../../hooks/useFetchProductById";
import React, { useEffect } from "react";
import { Spinner } from "../common/Spinner";
import { useLocale, useTranslations } from "next-intl";
import { IProductPackCartItem } from "../../../../lib/types.d";
import { initShipmentLogic } from "../../(common-display)/cart/shopping_basket/shipmentLogic";

interface Props {
  productPack: IProductPackCartItem;
  selectedShippingAddress: string;
}

export function CheckoutItem({ productPack, selectedShippingAddress }: Props) {
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

  // If we pick an address -> Check if the product is available for shipping to that address
  useEffect(() => {
    if (!productWithInfo) return;
    initShipmentLogic(selectedShippingAddress, productWithInfo.owner_id);
  }, [selectedShippingAddress]);

  if (isLoading) return <Spinner color={"beer-blonde"} />;

  if (isError) return <div className="text-center text-red-500">Error</div>;

  if (!productWithInfo) return null;

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

          <DeliveryError />

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
