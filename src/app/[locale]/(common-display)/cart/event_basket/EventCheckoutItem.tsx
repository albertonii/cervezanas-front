"use client";

import EventCheckoutPackItem from "./EventCheckoutPackItem";
import useFetchProductById from "../../../../../hooks/useFetchProductById";
import React from "react";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { IProductPackCartItem } from "../../../../../lib/types";

import dynamic from "next/dynamic";

const DynamicSpinner = dynamic(
  () => import("../../../components/common/Spinner"),
  {
    ssr: false,
  }
);
interface Props {
  productPack: IProductPackCartItem;
}

export function EventCheckoutItem({ productPack }: Props) {
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

  if (isLoading) return <DynamicSpinner color={"beer-blonde"} />;

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
                <EventCheckoutPackItem
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
