import DisplayImageProduct from "../../../components/common/DisplayImageProduct";
import MarketCartButtons from "../../../components/common/MarketCartButtons";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { SupabaseProps } from "../../../../../constants";
import { useEventCart } from "../../../../../context/EventCartContext";
import { Type } from "../../../../../lib/productEnum";
import {
  IProduct,
  IProductPack,
  IProductPackCartItem,
} from "../../../../../lib/types.d";
import { formatCurrency } from "../../../../../utils/formatCurrency";

const BASE_PRODUCTS_URL = SupabaseProps.BASE_PRODUCTS_URL;

interface Props {
  productPack: IProductPackCartItem;
  productWithInfo: IProduct;
  pack: IProductPack;
}

export default function EventCheckoutPackItem({
  productPack,
  productWithInfo,
  pack,
}: Props) {
  const t = useTranslations();

  const [animateRemove, setAnimateRemove] = useState(false);

  const {
    removeFromCart,
    increaseOnePackCartQuantity,
    decreaseOnePackCartQuantity,
  } = useEventCart();

  const handleIncreaseCartQuantity = (
    item: IProductPackCartItem,
    pack: IProductPack
  ) => {
    increaseOnePackCartQuantity(item.id, pack.id);
  };

  const handleDecreaseCartQuantity = (
    item: IProductPackCartItem,
    pack: IProductPack
  ) => {
    decreaseOnePackCartQuantity(item.id, pack.id);
  };

  const handleRemoveFromCart = (itemId: string, packId: string) => {
    setAnimateRemove(true);
    setTimeout(() => {
      removeFromCart(itemId, packId);
    }, 500);
  };

  return (
    <div
      className={`${
        animateRemove && "animate-ping overflow-hidden"
      } mt-4 flex w-full flex-col items-start justify-start md:mt-6 md:flex-row md:items-center md:space-x-6 xl:space-x-8`}
    >
      <div className="pb-4 md:pb-8 ">
        <DisplayImageProduct
          imgSrc={BASE_PRODUCTS_URL + decodeURIComponent(pack.img_url)}
          alt={pack.name}
          width={600}
          height={600}
          class="h-24 w-24 rounded md:h-32 md:w-32 lg:h-40 lg:w-40"
        />
      </div>
      <div className="flex w-full flex-col items-start justify-between space-y-4 border-b border-gray-200 pb-8 md:flex-row md:space-y-0">
        <div className="flex w-full flex-col items-start justify-start space-y-8">
          <h3 className="text-xl font-semibold leading-6 text-gray-800 dark:text-white xl:text-2xl">
            {pack.name}
          </h3>
          {/* Product Type Beer */}
          {productWithInfo.type === Type.BEER && (
            <div className="flex flex-col items-start justify-start space-y-2">
              <p className="text-sm leading-none text-gray-800 dark:text-white">
                <span className="text-gray-300 dark:text-gray-400">
                  {t("aroma")}:{" "}
                </span>{" "}
                {t(`${productWithInfo.beers[0]?.aroma}`)}
              </p>
              <p className="text-sm leading-none text-gray-800 dark:text-white">
                <span className="text-gray-300 dark:text-gray-400">
                  {t("family")}:{" "}
                </span>{" "}
                {t(`${productWithInfo.beers[0]?.family}`)}
              </p>
              <p className="text-sm leading-none text-gray-800 dark:text-white">
                <span className="text-gray-300 dark:text-gray-400">
                  {t("fermentation")}:{" "}
                </span>{" "}
                {t(`${productWithInfo.beers[0]?.fermentation}`)}
              </p>
            </div>
          )}

          {/* Product Type Merchandising */}
          {productWithInfo.type === Type.MERCHANDISING && (
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

        <div className="flex w-full flex-col items-center justify-between space-y-2 sm:flex-row sm:space-x-8">
          <div className="flex w-full items-center justify-between space-x-2 ">
            <p className="text-base leading-6 dark:text-white xl:text-lg">
              {formatCurrency(pack.price)}
              <span className="text-red-300 line-through"> $45.00</span>
            </p>

            <div className="text-base leading-6 text-gray-800 dark:text-white xl:text-lg">
              <div className="mt-6 flex w-full justify-between space-x-2">
                <MarketCartButtons
                  quantity={pack.quantity}
                  item={productPack}
                  handleIncreaseCartQuantity={() =>
                    handleIncreaseCartQuantity(productPack, pack)
                  }
                  handleDecreaseCartQuantity={() =>
                    handleDecreaseCartQuantity(productPack, pack)
                  }
                  handleRemoveFromCart={() =>
                    handleRemoveFromCart(productPack.id, pack.id)
                  }
                  displayDeleteButton={true}
                />
              </div>
            </div>
          </div>

          <div className="flex w-full items-center justify-between space-x-2">
            <p className="text-md text-base font-semibold leading-6 text-gray-800 dark:text-white xl:text-2xl">
              {formatCurrency(pack.price * pack.quantity)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
