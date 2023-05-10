import React, { useState } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { COMMON, SupabaseProps } from "../../constants";
import { IProduct } from "../../lib/types.d";
import { formatCurrency } from "../../utils/formatCurrency";
import { supabase } from "../../utils/supabaseClient";
import { DecreaseButton, IconButton, IncreaseButton } from "../common";
import { Type } from "../../lib/productEnum";
import { isValidObject } from "../../utils/utils";
import DisplayImageProduct from "../common/DisplayImageProduct";

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
    COMMON.MARKETPLACE_PRODUCT
  );

  const productSubtotal = product.price * quantity;

  useEffect(() => {
    const getPrincipal = async () => {
      if (
        isValidObject(product.product_multimedia[0]) &&
        product.product_multimedia[0].p_principal !== COMMON.MARKETPLACE_PRODUCT
      ) {
        const pPrincipalUrl = `${SupabaseProps.ARTICLES}${product.product_multimedia[0].p_principal}`;

        const { data: p_principal } = supabase.storage
          .from("products")
          .getPublicUrl(pPrincipalUrl);

        if (!p_principal) return;
        setPPrincipal(p_principal.publicUrl);
      }
    };

    getPrincipal();

    () => {
      setPPrincipal(COMMON.MARKETPLACE_PRODUCT);
    };
  }, [product.owner_id, product.product_multimedia]);

  return (
    <div className="mt-4 flex w-full flex-col items-start justify-start md:mt-6 md:flex-row md:items-center md:space-x-6 xl:space-x-8">
      <div className="pb-4 md:pb-8 ">
        <DisplayImageProduct
          imgSrc={p_principal}
          alt={product.name}
          width={600}
          height={600}
          class="h-24 w-24 md:h-32 md:w-32 lg:h-40 lg:w-40"
        />
      </div>

      <div className="flex w-full flex-col items-start justify-between space-y-4 border-b border-gray-200 pb-8 md:flex-row md:space-y-0">
        <div className="flex w-full flex-col items-start justify-start space-y-8">
          <h3 className="text-xl font-semibold leading-6 text-gray-800 dark:text-white xl:text-2xl">
            {product.name}
          </h3>
          {/* Product Type Beer */}
          {product.type === Type.BEER && (
            <div className="flex flex-col items-start justify-start space-y-2">
              <p className="text-sm leading-none text-gray-800 dark:text-white">
                <span className="text-gray-300 dark:text-gray-400">
                  {t("aroma")}:{" "}
                </span>{" "}
                {t(`${product.beers[0]?.aroma}`)}
              </p>
              <p className="text-sm leading-none text-gray-800 dark:text-white">
                <span className="text-gray-300 dark:text-gray-400">
                  {t("family")}:{" "}
                </span>{" "}
                {t(`${product.beers[0]?.family}`)}
              </p>
              <p className="text-sm leading-none text-gray-800 dark:text-white">
                <span className="text-gray-300 dark:text-gray-400">
                  {t("fermentation")}:{" "}
                </span>{" "}
                {t(`${product.beers[0]?.fermentation}`)}
              </p>
            </div>
          )}

          {/* Product Type Merchandising */}
          {product.type === Type.MERCHANDISING && (
            <div className="flex flex-col items-start justify-start space-y-2">
              <p className="text-sm leading-none text-gray-800 dark:text-white">
                <span className="text-gray-300 dark:text-gray-400">
                  {/* {t("aroma")}:{" "} */}
                </span>{" "}
                {/* {t(`${product.beers[0].aroma}`)} */}
              </p>
              <p className="text-sm leading-none text-gray-800 dark:text-white">
                <span className="text-gray-300 dark:text-gray-400">
                  {/* {t("family")}:{" "} */}
                </span>{" "}
                {/* {t(`${product.beers[0].family}`)} */}
              </p>
              <p className="text-sm leading-none text-gray-800 dark:text-white">
                <span className="text-gray-300 dark:text-gray-400">
                  {/* {t("fermentation")}:{" "} */}
                </span>{" "}
                {/* {t(`${product.beers[0].fermentation}`)} */}
              </p>
            </div>
          )}
        </div>
        <div className="flex w-full items-start justify-between space-x-8">
          <p className="text-base leading-6 dark:text-white xl:text-lg">
            {formatCurrency(product.price)}
            <span className="text-red-300 line-through"> $45.00</span>
          </p>
          <p className="text-base leading-6 text-gray-800 dark:text-white xl:text-lg">
            {quantity === 0 ? (
              <></>
            ) : (
              <span className="flex items-center justify-center">
                <DecreaseButton
                  onClick={() => handleDecreaseCartQuantity(product.id)}
                />

                <span className="px-2 text-3xl text-black">{quantity}</span>

                <IncreaseButton
                  onClick={() => handleIncreaseCartQuantity(product.id)}
                />
              </span>
            )}
          </p>
          <p className="text-base font-semibold leading-6 text-gray-800 dark:text-white xl:text-lg">
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
            title={""}
          ></IconButton>
        </div>
      </div>
    </div>
  );
}
