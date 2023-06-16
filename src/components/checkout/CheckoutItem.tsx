"use client";

import DisplayImageProduct from "../common/DisplayImageProduct";
import MarketCartButtons from "../common/MarketCartButtons";
import React, { useCallback } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";
import { SupabaseProps } from "../../constants";
import { IProduct } from "../../lib/types.d";
import { formatCurrency } from "../../utils/formatCurrency";
import { IconButton } from "../common";
import { Type } from "../../lib/productEnum";
import { useShoppingCart } from "../Context";

interface Props {
  product: IProduct;
}

const BASE_PRODUCTS_URL = SupabaseProps.BASE_PRODUCTS_URL;

export function CheckoutItem({ product }: Props) {
  const t = useTranslations();

  const {
    increaseCartQuantity,
    decreaseCartQuantity,
    removeMarketplaceItems,
    removeFromCart,
    marketplaceItems,
    addMarketplaceItems,
    getItemQuantity,
  } = useShoppingCart();

  const quantity = getItemQuantity(product.id);
  const productSubtotal = product.price * quantity;

  const handleIncreaseCartQuantity = useCallback(
    (productId: string) => {
      increaseCartQuantity(productId);
      if (marketplaceItems.find((item) => item.id === productId)) return;
      const product: IProduct | undefined = marketplaceItems.find(
        (item) => item.id === productId
      );
      if (!product) return;
      addMarketplaceItems(product);
    },
    [addMarketplaceItems, increaseCartQuantity, marketplaceItems]
  );

  const handleDecreaseCartQuantity = useCallback(
    (productId: string) => {
      decreaseCartQuantity(productId);
      if (getItemQuantity(productId) > 1) return;
      removeMarketplaceItems(productId);
    },
    [decreaseCartQuantity, getItemQuantity, removeMarketplaceItems]
  );

  const handleRemoveFromCart = useCallback(
    (productId: string) => {
      removeMarketplaceItems(productId);
      removeFromCart(productId);
    },
    [removeFromCart, removeMarketplaceItems]
  );

  return (
    <div className="mt-4 flex w-full flex-col items-start justify-start md:mt-6 md:flex-row md:items-center md:space-x-6 xl:space-x-8">
      <div className="pb-4 md:pb-8 ">
        <DisplayImageProduct
          imgSrc={
            BASE_PRODUCTS_URL +
            decodeURIComponent(product.product_multimedia[0].p_principal)
          }
          alt={product.name}
          width={600}
          height={600}
          class="h-24 w-24 rounded md:h-32 md:w-32 lg:h-40 lg:w-40"
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
        <div className="flex w-full flex-col items-start justify-between space-y-2 sm:flex-row sm:space-x-8">
          <div className="flex w-full items-center justify-between space-x-2 ">
            <p className="text-base leading-6 dark:text-white xl:text-lg">
              {formatCurrency(product.price)}
              <span className="text-red-300 line-through"> $45.00</span>
            </p>

            <div className="text-base leading-6 text-gray-800 dark:text-white xl:text-lg">
              {quantity > 0 && (
                <MarketCartButtons
                  quantity={quantity}
                  item={product}
                  handleIncreaseCartQuantity={() =>
                    handleIncreaseCartQuantity(product.id)
                  }
                  handleDecreaseCartQuantity={() =>
                    handleDecreaseCartQuantity(product.id)
                  }
                  handleRemoveFromCart={() => handleRemoveFromCart(product.id)}
                />
              )}
            </div>
          </div>

          <div className="flex w-full items-center justify-between space-x-2">
            <p className="text-md text-base font-semibold leading-6 text-gray-800 dark:text-white xl:text-lg">
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
    </div>
  );
}
