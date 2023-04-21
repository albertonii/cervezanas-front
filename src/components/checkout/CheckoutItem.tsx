import Image from "next/image";
import React, { useState } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SupabaseProps } from "../../constants";
import { IProduct } from "../../lib/types.d";
import { formatCurrency } from "../../utils/formatCurrency";
import { supabase } from "../../utils/supabaseClient";
import { Button, IconButton } from "../common";
import { ProductEnum } from "../../lib/productEnum";
import { isValidObject } from "../../utils/utils";

interface Props {
  product: IProduct;
  handleIncreaseCartQuantity: (id: string) => void;
  handleDecreaseCartQuantity: (id: string) => void;
  handleRemoveFromCart: (id: string) => void;
  quantity: number;
}

export function CheckoutItem({
  product,
  handleIncreaseCartQuantity,
  handleDecreaseCartQuantity,
  handleRemoveFromCart,
  quantity,
}: Props) {
  const { t } = useTranslation();

  const [p_principal, setPPrincipal] = useState<string>(
    "/marketplace_product_default.png"
  );
  const [productSubtotal, _] = useState<number>(product.price * quantity);

  useEffect(() => {
    const getPrincipal = async () => {
      if (
        isValidObject(product.product_multimedia[0]) &&
        product.product_multimedia[0].p_principal !==
          "/marketplace_product_default.png"
      ) {
        const pPrincipalUrl = `${SupabaseProps.ARTICLES}${product.product_multimedia[0].p_principal}`;

        const { data: p_principal, error } = supabase.storage
          .from("products")
          .getPublicUrl(pPrincipalUrl);

        if (error) throw error;
        setPPrincipal(p_principal!.publicURL);
      }
    };

    getPrincipal();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    () => {
      setPPrincipal("/marketplace_product_default.png");
    };
  }, [product.owner_id, product.product_multimedia]);

  return (
    <div className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
      <div className="pb-4 md:pb-8 ">
        <Image
          width={600}
          height={600}
          className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40"
          src={p_principal}
          alt={product.name}
        />
        {/* TODO: <DisplayImageProduct /> */}
      </div>

      <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
        <div className="w-full flex flex-col justify-start items-start space-y-8">
          <h3 className="text-xl dark:text-white xl:text-2xl font-semibold leading-6 text-gray-800">
            {product.name}
          </h3>
          {/* Product Type Beer */}
          {product.type === ProductEnum.Type.BEER && (
            <div className="flex justify-start items-start flex-col space-y-2">
              <p className="text-sm dark:text-white leading-none text-gray-800">
                <span className="dark:text-gray-400 text-gray-300">
                  {t("aroma")}:{" "}
                </span>{" "}
                {t(`${product.beers[0]?.aroma}`)}
              </p>
              <p className="text-sm dark:text-white leading-none text-gray-800">
                <span className="dark:text-gray-400 text-gray-300">
                  {t("family")}:{" "}
                </span>{" "}
                {t(`${product.beers[0]?.family}`)}
              </p>
              <p className="text-sm dark:text-white leading-none text-gray-800">
                <span className="dark:text-gray-400 text-gray-300">
                  {t("fermentation")}:{" "}
                </span>{" "}
                {t(`${product.beers[0]?.fermentation}`)}
              </p>
            </div>
          )}

          {/* Product Type Merchandising */}
          {product.type === ProductEnum.Type.MERCHANDISING && (
            <div className="flex justify-start items-start flex-col space-y-2">
              <p className="text-sm dark:text-white leading-none text-gray-800">
                <span className="dark:text-gray-400 text-gray-300">
                  {/* {t("aroma")}:{" "} */}
                </span>{" "}
                {/* {t(`${product.beers[0].aroma}`)} */}
              </p>
              <p className="text-sm dark:text-white leading-none text-gray-800">
                <span className="dark:text-gray-400 text-gray-300">
                  {/* {t("family")}:{" "} */}
                </span>{" "}
                {/* {t(`${product.beers[0].family}`)} */}
              </p>
              <p className="text-sm dark:text-white leading-none text-gray-800">
                <span className="dark:text-gray-400 text-gray-300">
                  {/* {t("fermentation")}:{" "} */}
                </span>{" "}
                {/* {t(`${product.beers[0].fermentation}`)} */}
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-between space-x-8 items-start w-full">
          <p className="text-base dark:text-white xl:text-lg leading-6">
            {formatCurrency(product.price)}
            <span className="text-red-300 line-through"> $45.00</span>
          </p>
          <p className="text-base dark:text-white xl:text-lg leading-6 text-gray-800">
            {quantity === 0 ? (
              <></>
            ) : (
              <span className="flex items-center justify-center">
                <Button
                  box
                  onClick={() => handleDecreaseCartQuantity(product.id)}
                  class={""}
                >
                  -
                </Button>

                <span className="px-2 text-3xl text-black">{quantity}</span>

                <Button
                  box
                  onClick={() => handleIncreaseCartQuantity(product.id)}
                  class={""}
                >
                  +
                </Button>
              </span>
            )}
          </p>
          <p className="text-base dark:text-white xl:text-lg font-semibold leading-6 text-gray-800">
            {formatCurrency(productSubtotal)}
          </p>

          <IconButton
            box
            danger
            accent
            classContainer="py-2"
            icon={faTrash}
            color={{ filled: "#fefefe", unfilled: "#fefefe" }}
            onClick={() => {
              handleRemoveFromCart(product.id);
            }}
          ></IconButton>
        </div>
      </div>
    </div>
  );
}
