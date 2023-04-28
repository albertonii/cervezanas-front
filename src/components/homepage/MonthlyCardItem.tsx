import Link from "next/link";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useShoppingCart } from "../Context/ShoppingCartContext";
import { formatCurrency } from "../../utils/formatCurrency";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../../utils/supabaseClient";
import { IMonthlyProduct } from "../../lib/types.d";
import { useRouter } from "next/router";
import {
  AddCardButton,
  DecreaseButton,
  DeleteButton,
  IconButton,
  IncreaseButton,
} from "../common";
import DisplayImageProduct from "../common/DisplayImageProduct";

interface Props {
  mProduct: IMonthlyProduct;
}

export default function MonthlyCardItem({ mProduct }: Props) {
  const product = mProduct.product_id;

  const { t } = useTranslation();
  const { id } = product;
  const router = useRouter();

  const overAll = () => {
    if (product.reviews.length === 0) {
      return t("no_reviews") ?? "";
    }

    const overAll_sum = product.reviews.reduce(
      (sum, review) => sum + review.overall,
      0
    );
    const overAll_avg = overAll_sum / product.reviews.length;
    const overAll_toFixed = overAll_avg.toFixed(1);

    return overAll_toFixed;
  };

  const [isLike, setIsLike] = useState<boolean>(!!product.likes.length);

  const {
    getItemQuantity,
    decreaseCartQuantity,
    removeFromCart,
    removeMarketplaceItems,
  } = useShoppingCart();

  const heartColor = { filled: "#fdc300", unfilled: "grey" };

  async function handleLike() {
    if (!isLike) {
      const { error } = await supabase
        .from("likes")
        .insert([{ product_id: product.id, owner_id: product.owner_id }]);

      if (error) throw error;

      setIsLike(true);
    } else {
      const { error } = await supabase
        .from("likes")
        .delete()
        .match({ product_id: product.id, owner_id: product.owner_id });

      if (error) throw error;

      setIsLike(false);
    }
  }

  const handleIncreaseToCartItem = () => {
    /*
    increaseCartQuantity(id);
    if (marketplaceItems.find((item) => item.id === id)) return;
    const product: IProduct | undefined = marketplaceItems.find(
      (item) => item.id === id
    );

    if (product) return;

    const product_ = products.find((item) => item.id === id);
    if (!product_) return;
    addMarketplaceItems(product_);
    */
  };

  const handleDecreaseFromCartItem = () => {
    decreaseCartQuantity(id);
    if (getItemQuantity(id) > 1) return;
    removeMarketplaceItems(id);
  };

  const handleRemoveFromCart = () => {
    removeMarketplaceItems(id);
    removeFromCart(id);
  };

  return (
    <>
      <div className="mt-2 rounded-xl p-4 shadow-lg sm:max-w-sm lg:max-w-md">
        <div className="relative mb-1 flex justify-center">
          <div className="absolute top-0 right-0 p-3">
            <IconButton
              icon={faHeart}
              onClick={() => handleLike()}
              isActive={isLike}
              color={heartColor}
              classContainer={
                "transition ease-in duration-300 bg-gray-800 shadow hover:shadow-md text-gray-500 w-auto h-10 text-center p-2 !rounded-full !m-0"
              }
              classIcon={""}
              title="Add to favorites"
            ></IconButton>
          </div>

          <div className="h-[200px] w-[200px]">
            <DisplayImageProduct
              width={128}
              height={128}
              alt="Principal Product Image"
              imgSrc={product.product_multimedia[0].p_principal}
              class={
                "h-full w-full rounded-2xl object-contain hover:cursor-pointer"
              }
              onClick={() => router.push(`/products/${product.id}`)}
            />
          </div>
        </div>

        <div className="flex flex-col justify-between ">
          <div className="flex flex-wrap ">
            <div className="flex w-full flex-none items-center justify-between text-sm text-gray-600">
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1 h-4 w-4 text-beer-blonde"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>

                <span className="mr-3  whitespace-nowrap text-gray-400">
                  {overAll()}
                </span>
              </div>

              <span className="mr-2 text-gray-400">India</span>
            </div>

            <div className="flex w-full min-w-0 items-center justify-between ">
              <h2 className="hover:text-purple-500 mr-auto cursor-pointer truncate text-lg font-semibold text-beer-draft transition-all hover:text-beer-blonde">
                <Link href={`/products/${product.id}`}>{product.name}</Link>
              </h2>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="mt-1 text-xl font-semibold text-bear-dark">
              {formatCurrency(product.price)}
            </div>

            <div className="mt-2 flex items-center  justify-between space-x-2 text-sm font-medium">
              {getItemQuantity(id) === 0 ? (
                <>
                  <AddCardButton onClick={() => handleIncreaseToCartItem()} />
                </>
              ) : (
                <>
                  <DecreaseButton
                    onClick={() => handleDecreaseFromCartItem()}
                  />

                  <span className="px-2 text-3xl text-black">
                    {getItemQuantity(id)}
                  </span>

                  <IncreaseButton onClick={() => handleIncreaseToCartItem()} />

                  <DeleteButton
                    onClick={() => {
                      handleRemoveFromCart();
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
