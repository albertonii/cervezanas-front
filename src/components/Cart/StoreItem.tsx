"use client";

import Link from "next/link";
import DisplayImageProduct from "../common/DisplayImageProduct";
import MarketCartButtons from "../common/MarketCartButtons";

import React, { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useShoppingCart } from "../Context/ShoppingCartContext";
import { formatCurrency } from "../../utils/formatCurrency";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { IProduct } from "../../lib/types.d";
import { useRouter } from "next/navigation";
import { AddCardButton, IconButton, Spinner } from "../common";
import { useSupabase } from "../Context/SupabaseProvider";
import { useAuth } from "../Auth";
import { SupabaseProps } from "../../constants";

type StoreItemProps = { product: IProduct; products: IProduct[] };

const BASE_PRODUCTS_URL = SupabaseProps.BASE_PRODUCTS_URL;

export function StoreItem({
  product,
  products: marketplaceProducts,
}: StoreItemProps) {
  const t = useTranslations();
  const locale = useLocale();
  const { supabase } = useSupabase();
  const { isLoading } = useAuth();
  const productId = product.id;
  const router = useRouter();

  const overAllCalculation = () => {
    let overAll_sum = 0;
    product.reviews.map((review) => (overAll_sum += review.overall));
    const overAll_avg = overAll_sum / product.reviews.length;
    const overAll_toFixed: string = overAll_avg.toFixed(1);
    return overAll_toFixed.toString();
  };

  const overAll =
    product.reviews.length > 0 ? overAllCalculation() : t("no_reviews") ?? "";

  const [isLike, setIsLike] = useState<boolean>(
    product.likes.length > 0 ? true : false
  );

  const {
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
    addMarketplaceItems,
    removeMarketplaceItems,
    marketplaceItems,
  } = useShoppingCart();

  const quantity = getItemQuantity(productId);

  const heartColor = { filled: "#fdc300", unfilled: "grey" };

  async function handleLike() {
    if (!isLike) {
      const { error } = await supabase
        .from("likes")
        .insert([{ product_id: productId, owner_id: product.owner_id }]);

      if (error) throw error;

      setIsLike(true);
    } else {
      const { error } = await supabase
        .from("likes")
        .delete()
        .match({ product_id: productId, owner_id: product.owner_id });

      if (error) throw error;

      setIsLike(false);
    }
  }

  const handleIncreaseToCartItem = () => {
    increaseCartQuantity(productId);
    if (marketplaceItems.find((item) => item.id === productId)) return;

    const product_ = marketplaceProducts.find((item) => item.id === productId);
    if (!product_) return;
    addMarketplaceItems(product_);
  };

  const handleDecreaseFromCartItem = () => {
    decreaseCartQuantity(productId);
    if (getItemQuantity(productId) > 1) return;
    removeMarketplaceItems(productId);
  };

  const handleRemoveFromCart = () => {
    removeMarketplaceItems(productId);
    removeFromCart(productId);
  };

  return (
    <div className="max-w-sm rounded-xl p-4 shadow-lg">
      {isLoading ? (
        <Spinner color="beer-blonde" size="medium"></Spinner>
      ) : (
        <>
          <div className="relative mb-1 flex justify-center">
            <div className="absolute right-0 top-0 p-3">
              <IconButton
                icon={faHeart}
                onClick={() => handleLike()}
                isActive={isLike}
                color={heartColor}
                classContainer={
                  " bg-gray-800 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full !m-0"
                }
                classIcon={""}
                title="Add to favorites"
              ></IconButton>
            </div>

            <div className="h-[200px] w-[200px]">
              <DisplayImageProduct
                width={128}
                height={128}
                alt="Principal Product Image store item"
                imgSrc={
                  BASE_PRODUCTS_URL +
                  decodeURIComponent(product.product_multimedia[0].p_principal)
                }
                class={
                  "h-full w-full rounded-2xl object-contain hover:cursor-pointer"
                }
                onClick={() => router.push(`/${locale}/products/${product.id}`)}
              />
            </div>
          </div>

          <div className="flex flex-col justify-between ">
            <div className="flex flex-wrap ">
              <div className="flex w-full flex-none items-center text-sm text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1 h-4 w-4 text-beer-blonde"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="mr-3 mt-2 whitespace-nowrap text-gray-400">
                  {overAll}
                </span>
                {/* <span className="mr-2 text-gray-400">India</span> */}
              </div>

              <div className="flex w-full min-w-0 items-center justify-between ">
                <h2 className="hover:text-purple-500 mr-auto cursor-pointer truncate text-lg font-semibold text-beer-draft transition-all hover:text-beer-blonde">
                  <Link href={`/products/${product.id}`} locale={locale}>
                    {product.name}
                  </Link>
                </h2>
                {/* {beer.product_inventory[0]?.quantity > 0 ? (
                  <div className="flex items-center bg-green-400 text-white text-sm px-2 py-1 ml-3 rounded-lg">
                    {t("instock")}
                  </div>
                ) : (
                  <div className="flex items-center bg-red-400 text-white text-sm px-2 py-1 ml-3 rounded-lg">
                    {t("outstock")}
                  </div>
                )} */}
              </div>
            </div>

            <div className="mt-1 text-xl font-semibold text-bear-dark">
              {formatCurrency(product.price)}
            </div>

            <div className="mt-2 flex items-center  justify-between space-x-2 text-sm font-medium">
              {quantity === 0 ? (
                <>
                  <AddCardButton onClick={() => handleIncreaseToCartItem()} />
                </>
              ) : (
                <>
                  <MarketCartButtons
                    quantity={quantity}
                    item={product}
                    handleIncreaseCartQuantity={() =>
                      handleIncreaseToCartItem()
                    }
                    handleDecreaseCartQuantity={() =>
                      handleDecreaseFromCartItem()
                    }
                    handleRemoveFromCart={() => handleRemoveFromCart()}
                  />
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
