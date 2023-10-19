"use client";

import Link from "next/link";
import DeliveryError from "../DeliveryError";
import CheckoutPackItem from "./CheckoutPackItem";
import useFetchProductById from "../../../../../hooks/useFetchProductById";
import React, { useEffect, useState } from "react";
import { initShipmentLogic } from "./shipmentLogic";
import { useLocale, useTranslations } from "next-intl";
import { Spinner } from "../../../components/common/Spinner";
import { IProductPackCartItem } from "../../../../../lib/types";

interface Props {
  productPack: IProductPackCartItem;
  selectedShippingAddress: string;
}

export function CheckoutItem({ productPack, selectedShippingAddress }: Props) {
  const t = useTranslations();
  const locale = useLocale();

  const [canDeliver, setCanDeliver] = useState(false);
  const [isLoadingDelivery, setIsLoadingDelivery] = useState(false);

  const {
    data: productWithInfo,
    isError,
    isLoading: isLoadingProduct,
    refetch,
  } = useFetchProductById(productPack.id);

  useEffect(() => {
    refetch();
  }, []);

  // If we pick an address -> Check if the product is available for shipping to that address
  useEffect(() => {
    if (!productWithInfo) return;

    setIsLoadingDelivery(true);

    const canDeliverFunction = async () => {
      const res_canDeliver = await initShipmentLogic(
        selectedShippingAddress,
        productWithInfo.owner_id
      );

      setCanDeliver(res_canDeliver);
      setIsLoadingDelivery(false);
    };

    canDeliverFunction();
  }, [selectedShippingAddress]);

  if (isLoadingProduct || isLoadingDelivery)
    return <Spinner color={"beer-blonde"} />;

  if (isError) return <div className="text-center text-red-500">Error</div>;

  if (!productWithInfo) return null;

  return (
    <>
      {isLoadingDelivery && (
        <Spinner size={"fullScreen"} absolute={true} color={"beer-blonde"} />
      )}

      {productPack && (
        <article className={`mt-4 space-y-4`}>
          <Link href={`/products/${productWithInfo.id}`} locale={locale}>
            <p className="space-x-2 text-xl">
              <span className="font-semibold ">{t("product_name")}:</span>

              <span className="hover:font-semibold hover:text-beer-gold">
                {productPack.name}
              </span>
            </p>
          </Link>

          {!canDeliver && <DeliveryError />}

          {productPack.packs.map((pack) => (
            <div key={pack.id}>
              <CheckoutPackItem
                productPack={productPack}
                productWithInfo={productWithInfo}
                pack={pack}
              />
            </div>
          ))}
        </article>
      )}
    </>
  );
}
