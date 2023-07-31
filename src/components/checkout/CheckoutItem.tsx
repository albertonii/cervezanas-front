"use client";

import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Spinner } from "../common";

import useFetchProductById from "../../hooks/useFetchProductById";
import { IProductPackCartItem } from "../../lib/types";
import CheckoutPackItem from "./CheckoutPackItem";

interface Props {
  productPack: IProductPackCartItem;
}

export function CheckoutItem({ productPack }: Props) {
  const t = useTranslations();

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

  return (
    <>
      {productPack && (
        <div className="mt-4 space-y-4">
          <div className="">
            <p className="text-xl">
              <span className="font-semibold">{t("product_name")}:</span>{" "}
              {productPack.name}
            </p>
          </div>

          {productPack.packs.map((pack) => (
            <>
              <div key={pack.id}>
                <CheckoutPackItem
                  productPack={productPack}
                  productWithInfo={productWithInfo[0]}
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
