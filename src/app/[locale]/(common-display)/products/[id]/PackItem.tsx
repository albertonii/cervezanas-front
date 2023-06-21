import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IProduct, IProductPack } from "../../../../../lib/types";
import { SupabaseProps } from "../../../../../constants";
import { useTranslations } from "next-intl";
import MarketCartButtons from "../../../../../components/common/MarketCartButtons";

interface Props {
  product: IProduct;
  pack: IProductPack;
  marketplaceProducts: IProduct[];
}

export default function PackItem({
  product,
  pack,
  marketplaceProducts,
}: Props) {
  const t = useTranslations();

  const [quantity, setQuantity] = useState(1);
  const [isHovering, setIsHovering] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    console.log(isSelected);
  }, [isSelected]);

  const handleIncreaseToCartItem = () => {
    setQuantity(quantity + 1);
    // increaseCartQuantity(productId);
    // if (marketplaceItems.find((item) => item.id === productId)) return;
    // const product = marketplaceProducts.find(({ id }) => id === productId);
    // if (!product) return;
    // addMarketplaceItems(product);
  };

  const handleDecreaseFromCartItem = () => {
    if (quantity > 0) setQuantity(quantity - 1);
    // decreaseCartQuantity(productId);
    // if (getItemQuantity(productId) > 1) return;
    // removeMarketplaceItems(productId);
  };

  const handleRemoveFromCart = () => {
    setQuantity(0);
    // removeMarketplaceItems(productId);
    // removeFromCart(productId);
  };

  useEffect(() => {
    if (!isSelected) handleIncreaseToCartItem();
    else handleRemoveFromCart();
  }, [isSelected]);

  return (
    <>
      <button
        className={`relative rounded-md ${
          isSelected && "bg-beer-softBlondeBubble shadow-sm outline-none"
        }`}
        key={pack.id}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => {
          setIsSelected(!isSelected);
        }}
      >
        {/* <!-- Active: "ring-2 ring-indigo-500" --> */}
        <label
          className={`group relative flex cursor-pointer items-center justify-center border py-3 px-4 text-sm font-medium uppercase text-gray-900 hover:opacity-75 focus:outline-none sm:flex-1
     `}
        >
          <input
            type="radio"
            name="size-choice"
            value="XXS"
            className="sr-only"
            aria-labelledby="size-choice-0-label"
          />
          <span id="size-choice-0-label">
            {pack.quantity} {t("units")}
          </span>
          {/* <!--
        Active: "border", Not Active: "border-2"
        Checked: "border-indigo-500", Not Checked: "border-transparent"
        --> */}
          <span
            className="pointer-events-none absolute -inset-px rounded-md"
            aria-hidden="true"
          ></span>
        </label>

        <div
          className={`absolute  bottom-full left-1/2 m-auto w-full -translate-x-1/2 -translate-y-[2rem] transform rounded-md bg-beer-foam shadow-xl transition-all duration-300 ease-in-out  
        ${!isHovering && "hidden"}`}
        >
          <Image
            src={`${SupabaseProps.BASE_PRODUCTS_URL}${decodeURIComponent(
              pack.img_url
            )}`}
            width={1300}
            height={1300}
            alt={`Product pack - ${pack.quantity}`}
            className={"px-2 py-2 "}
          />
        </div>
      </button>

      {quantity > 0 && (
        <MarketCartButtons
          quantity={quantity}
          item={product}
          handleIncreaseCartQuantity={() => handleIncreaseToCartItem()}
          handleDecreaseCartQuantity={() => handleDecreaseFromCartItem()}
          handleRemoveFromCart={() => handleRemoveFromCart()}
        />
      )}
    </>
  );
}
