import { Button } from "@supabase/ui";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";
import { useShoppingCart } from "../Context/ShoppingCartContext";
import { formatCurrency } from "../../utils/formatCurrency";
import IconButton from "../common/IconButton";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../../utils/supabaseClient";
import { Beer } from "../../lib/types";

type StoreItemProps = { beer: Beer };

export default function StoreItem(props: StoreItemProps) {
  const { t } = useTranslation();
  const { beer } = props;
  const { id } = beer;

  const [overAll, _] = useState<string>(
    beer.reviews.length > 0
      ? () => {
          let overAll_sum = 0;
          beer.reviews.map((review) => (overAll_sum += review.overall));
          const overAll_avg = overAll_sum / beer.reviews.length;
          const overAll_toFixed: string = overAll_avg.toFixed(1);
          return overAll_toFixed;
        }
      : t("no_reviews") ?? ""
  );

  const [isLike, setIsLike] = useState<boolean>(
    beer.likes.length > 0 ? true : false
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

  const heartColor = { filled: "#fdc300", unfilled: "grey" };

  async function handleLike() {
    if (!isLike) {
      const { error } = await supabase
        .from("likes")
        .insert([{ beer_id: beer.id, owner_id: beer.owner_id }]);

      if (error) throw error;

      setIsLike(true);
    } else {
      const { error } = await supabase
        .from("likes")
        .delete()
        .match({ beer_id: beer.id, owner_id: beer.owner_id });

      if (error) throw error;

      setIsLike(false);
    }
  }

  const handleIncreaseToCartItem = () => {
    increaseCartQuantity(id);
    if (marketplaceItems.find((item) => item.id === id)) return;
    addMarketplaceItems(beer);
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
    <div className="max-w-sm w-full bg-gray-900 shadow-lg rounded-xl p-6">
      <div className="flex flex-col ">
        <div className="relative h-62 w-full mb-3">
          <div className="absolute flex flex-col top-0 right-0 p-3">
            <IconButton
              icon={faHeart}
              onClick={() => handleLike()}
              isActive={isLike}
              color={heartColor}
              class={
                "transition ease-in duration-300 bg-gray-800 shadow hover:shadow-md text-gray-500 rounded-full w-auto h-10 text-center p-2"
              }
              title="Add to favorites"
            ></IconButton>
          </div>

          <Image
            width={128}
            height={128}
            src={beer.product_multimedia[0]?.p_principal}
            alt="Principal Product Image"
            className="w-full object-fill rounded-2xl"
          />

          <div className="flex-auto justify-evenly">
            <div className="flex flex-wrap ">
              <div className="w-full flex-none text-sm flex items-center text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-beer-blonde mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-gray-400 whitespace-nowrap mr-3 mt-2">
                  {overAll}
                </span>
                <span className="mr-2 text-gray-400">India</span>
              </div>

              <div className="flex items-center w-full justify-between min-w-0 ">
                <h2 className="transition-all text-lg mr-auto cursor-pointer text-gray-200 hover:text-purple-500 truncate hover:text-beer-blonde">
                  <Link href={`/products/${beer.id}`}>{beer.name}</Link>
                </h2>
                {beer.product_inventory[0]?.quantity > 0 ? (
                  <div className="flex items-center bg-green-400 text-white text-sm px-2 py-1 ml-3 rounded-lg">
                    {t("instock")}
                  </div>
                ) : (
                  <div className="flex items-center bg-red-400 text-white text-sm px-2 py-1 ml-3 rounded-lg">
                    {t("outstock")}
                  </div>
                )}
              </div>
            </div>

            <div className="text-xl text-white font-semibold mt-1">
              {formatCurrency(beer.price)}
            </div>

            <div className="lg:flex flex-col py-4 text-sm text-gray-600">
              <div className="flex-1 inline-flex items-center  mb-3">
                <span className="text-secondary whitespace-nowrap mr-3">
                  {t("format")}
                </span>

                <div className="cursor-pointer text-gray-400 ">
                  <span className="hover:text-purple-500 p-1 py-0">
                    {t("bottle")}
                  </span>
                  <span className="hover:text-purple-500 p-1 py-0">
                    {t("can")}
                  </span>
                  <span className="hover:text-purple-500 p-1 py-0">
                    {t("draft")}
                  </span>
                </div>
              </div>

              <div className="flex-1 inline-flex items-center mb-3">
                <span className="text-secondary whitespace-nowrap mr-3">
                  {t("volume")}
                </span>

                <div className="cursor-pointer text-gray-400 ">
                  <span className="hover:text-purple-500 p-1 py-0">S</span>
                  <span className="hover:text-purple-500 p-1 py-0">M</span>
                  <span className="hover:text-purple-500 p-1 py-0">L</span>
                  <span className="hover:text-purple-500 p-1 py-0">XL</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 text-sm font-medium justify-start">
              <div className="mt-auto">
                {getItemQuantity(id) === 0 ? (
                  <button
                    onClick={() => handleIncreaseToCartItem()}
                    className="transition-all ease-in duration-300 border-2 border-bear-light inline-flex items-center text-sm font-medium mb-2 md:mb-0 bg-purple-500 px-5 py-2 hover:shadow-lg tracking-wider text-beer-softBlonde hover:text-beer-dark rounded-full hover:bg-beer-blonde "
                  >
                    <span>{t("add_to_cart")}</span>
                  </button>
                ) : (
                  <div>
                    <div className="flex items-center justify-center">
                      <Button onClick={() => handleDecreaseFromCartItem()}>
                        -
                      </Button>
                      <span className="px-2 text-3xl text-white">
                        {getItemQuantity(id)}
                      </span>
                      <Button onClick={() => handleIncreaseToCartItem()}>
                        +
                      </Button>
                    </div>

                    <Button
                      className={"bg-red-200"}
                      onClick={() => {
                        handleRemoveFromCart();
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>

              <button className="transition ease-in duration-300 bg-gray-700 hover:bg-gray-800 border hover:border-gray-500 border-gray-700 hover:text-white  hover:shadow-lg text-gray-400 rounded-full w-9 h-9 text-center p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className=""
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
