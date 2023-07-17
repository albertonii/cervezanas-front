import React, { useState } from "react";
import Image from "next/image";
import { IProduct, IProductPack } from "../../../../../lib/types";
import { COMMON, SupabaseProps } from "../../../../../constants";
import { useTranslations } from "next-intl";
import DisplayImageProduct from "../../../../../components/common/DisplayImageProduct";

interface Props {
  product: IProduct;
  pack: IProductPack;
  handleItemSelected: (item: IProductPack) => void;
  selectedPackId: string;
}

export default function PackItem({
  pack,
  handleItemSelected,
  selectedPackId,
}: Props) {
  const t = useTranslations();
  console.log(pack.img_url);
  const [isHovering, setIsHovering] = useState(false);

  // const handleDecreaseFromCartItem = () => {
  //   if (quantity > 0) setQuantity(quantity - 1);
  //   decreaseCartQuantity(productId, pack.id);
  //   if (getItemQuantity(productId) > 1) return;
  //   removeMarketplaceItems(productId);
  // };

  return (
    <li
      className="flex flex-row space-x-4"
      onClick={() => handleItemSelected(pack)}
    >
      <div
        className={`relative w-full rounded-md ${
          selectedPackId === pack.id &&
          "bg-beer-softBlondeBubble ring-2 ring-beer-softBlonde"
        }`}
        key={pack.id}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* <!-- Active: "ring-2 ring-indigo-500" --> */}
        <label
          className={`group relative flex cursor-pointer items-center justify-center border py-3 px-4 text-sm font-medium uppercase text-gray-900 hover:opacity-75 focus:outline-none sm:flex-1
     `}
        >
          <input
            type="radio"
            id={`pack-${pack.id}`}
            value={pack.id}
            className={"hidden"}
          />
          <span id="size-choice-0-label">
            {pack.quantity} {t("units")}
          </span>
        </label>

        <div
          className={`absolute bottom-full left-1/2 m-auto w-[70vw] -translate-x-1/2 -translate-y-[2rem] transform rounded-md bg-beer-foam shadow-xl transition-all duration-300 ease-in-out sm:w-[35vw] lg:w-[15vw]
        ${!isHovering && "hidden"}`}
        >
          <div className="m-4 flex flex-col items-center text-lg">
            <span className="font-semibold">{pack.name}</span>
            <span className="">
              {pack.quantity} {pack.quantity > 1 ? t("units") : t("unit")} -{" "}
              {pack.price} €
            </span>

            <DisplayImageProduct
              imgSrc={
                pack.img_url
                  ? SupabaseProps.BASE_PRODUCTS_URL +
                    decodeURIComponent(pack.img_url)
                  : COMMON.NO_BEER
              }
              alt={pack.name}
              width={600}
              height={600}
              class="w-[30vw] px-2 py-2 sm:w-[25vw] md:w-[20vw] lg:w-[10vw]"
            />
          </div>
        </div>
      </div>
    </li>
  );
}
