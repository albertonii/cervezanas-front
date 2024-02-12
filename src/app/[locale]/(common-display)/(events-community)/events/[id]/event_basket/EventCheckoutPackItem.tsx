import DisplayImageProduct from "../../../../../components/common/DisplayImageProduct";
import MarketCartButtons from "../../../../../components/common/MarketCartButtons";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { SupabaseProps } from "../../../../../../../constants";
import { Type } from "../../../../../../../lib/productEnum";
import {
  IProduct,
  IProductPack,
  IProductPackEventCartItem,
} from "../../../../../../../lib/types";
import { formatCurrency } from "../../../../../../../utils/formatCurrency";
import useEventCartStore from "../../../../../../store/eventCartStore";

const BASE_PRODUCTS_URL = SupabaseProps.BASE_PRODUCTS_URL;

interface Props {
  eventId: string;
  productPack: IProductPackEventCartItem;
  productWithInfo: IProduct;
  pack: IProductPack;
}

export default function EventCheckoutPackItem({
  eventId,
  productPack,
  productWithInfo,
  pack,
}: Props) {
  const t = useTranslations();

  const cpId =
    productPack.cpm_id !== "" ? productPack.cpm_id : productPack.cpf_id;

  const [animateRemove, setAnimateRemove] = useState(false);
  const [packQuantity, setPackQuantity] = React.useState(0);

  const {
    eventCarts,
    getPackQuantity,
    removeFromCart,
    increaseOnePackCartQuantity,
    decreaseOnePackCartQuantity,
  } = useEventCartStore();

  useEffect(() => {
    setPackQuantity(getPackQuantity(eventId, pack.product_id, cpId, pack.id));
  }, [eventCarts]);

  const handleIncreaseCartQuantity = (
    item: IProductPackEventCartItem,
    pack: IProductPack
  ) => {
    increaseOnePackCartQuantity(eventId, item.id, cpId, pack.id);
  };

  const handleDecreaseCartQuantity = (
    item: IProductPackEventCartItem,
    pack: IProductPack
  ) => {
    decreaseOnePackCartQuantity(eventId, item.id, cpId, pack.id);
  };

  const handleRemoveFromCart = (itemId: string, packId: string) => {
    setAnimateRemove(true);
    setTimeout(() => {
      removeFromCart(eventId, itemId, cpId, packId);
    }, 500);
  };

  return (
    <section
      className={`${
        animateRemove && "animate-ping overflow-hidden"
      } mt-4 flex w-full flex-col items-start justify-start md:mt-6 md:flex-row md:items-center md:space-x-6 xl:space-x-8`}
    >
      <figure className="pb-4 md:pb-8 ">
        <DisplayImageProduct
          imgSrc={BASE_PRODUCTS_URL + decodeURIComponent(pack.img_url)}
          alt={pack.name}
          width={600}
          height={600}
          class="h-24 w-24 rounded md:h-32 md:w-32 lg:h-40 lg:w-40"
        />
      </figure>

      <div className="flex w-full flex-col items-start justify-between space-y-4 border-b border-gray-200 pb-8 md:flex-row md:space-y-0">
        <div className="flex w-full flex-col items-start justify-start space-y-8">
          <h3 className="text-xl font-semibold leading-6 text-gray-800 dark:text-white xl:text-2xl">
            {pack.name}
          </h3>

          {/* Product Type Beer */}
          {productWithInfo.type === Type.BEER && productWithInfo.beers && (
            <div className="flex flex-col items-start justify-start space-y-2">
              <p className="text-sm leading-none text-gray-800 dark:text-white">
                <span className="text-gray-300 dark:text-gray-400">
                  {t("aroma")}:{" "}
                </span>
                {t(`${productWithInfo.beers?.aroma}`)}
              </p>
              <p className="text-sm leading-none text-gray-800 dark:text-white">
                <span className="text-gray-300 dark:text-gray-400">
                  {t("family")}:{" "}
                </span>
                {t(`${productWithInfo.beers?.family}`)}
              </p>
              <p className="text-sm leading-none text-gray-800 dark:text-white">
                <span className="text-gray-300 dark:text-gray-400">
                  {t("fermentation")}:{" "}
                </span>
                {t(`${productWithInfo.beers?.fermentation}`)}
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
                {/* {t(`${product.beers.aroma}`)} */}
              </p>
              <p className="text-sm leading-none text-gray-800 dark:text-white">
                <span className="text-gray-300 dark:text-gray-400">
                  {/* {t("family")}:{" "} */}
                </span>{" "}
                {/* {t(`${product.beers.family}`)} */}
              </p>
              <p className="text-sm leading-none text-gray-800 dark:text-white">
                <span className="text-gray-300 dark:text-gray-400">
                  {/* {t("fermentation")}:{" "} */}
                </span>{" "}
                {/* {t(`${product.beers.fermentation}`)} */}
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
                  quantity={packQuantity}
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
              {formatCurrency(pack.price * packQuantity)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
