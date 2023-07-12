"use client";

import Link from "next/link";
import MarketCartButtons from "../common/MarketCartButtons";
import DisplayImageProduct from "../common/DisplayImageProduct";
import { useCallback, useMemo } from "react";
import { IProduct, IProductPackCartItem } from "../../lib/types.d";
import { formatCurrency } from "../../utils/formatCurrency";
import { useShoppingCart } from "../Context/ShoppingCartContext";
import { useLocale, useTranslations } from "next-intl";
import { SupabaseProps } from "../../constants";

type CartItemProps = {
  item: IProductPackCartItem;
};

const BASE_PRODUCTS_URL = SupabaseProps.BASE_PRODUCTS_URL;

export function CartItem({ item }: CartItemProps) {
  const t = useTranslations();
  const locale = useLocale();

  const {
    removeFromCart,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeMarketplaceItems,
    marketplaceItems,
    addMarketplaceItems,
    getItemQuantity,
  } = useShoppingCart();

  const handleIncreaseCartQuantity = useCallback(() => {
    increaseCartQuantity(item.id);
    if (marketplaceItems.find((i) => i.id === item.id)) return;
    const product: IProduct | undefined = marketplaceItems.find(
      (i) => i.id === item.id
    );
    if (product) {
      addMarketplaceItems(product);
    }
  }, [increaseCartQuantity, marketplaceItems, addMarketplaceItems]);

  const handleDecreaseCartQuantity = useCallback(() => {
    // decreaseCartQuantity(id);
    // if (getItemQuantity(id) > 1) return;
    // removeMarketplaceItems(id);
  }, [decreaseCartQuantity, getItemQuantity, removeMarketplaceItems]);

  const handleRemoveFromCart = useCallback(
    (itemId: string) => {
      removeMarketplaceItems(itemId);
      removeFromCart(itemId);
    },
    [removeFromCart, removeMarketplaceItems]
  );

  const formattedPrice = (packPrice: number) =>
    useMemo(() => formatCurrency(packPrice ?? 0), [packPrice]);

  return (
    <>
      {item && (
        <>
          <span>
            <p className="font-semibold">{t("product_name")}:</p> {item.name}
          </span>
          {item.packs.map((pack) => (
            <div key={pack.id} className="flex flex-row">
              <>
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <DisplayImageProduct
                    width={240}
                    height={200}
                    imgSrc={
                      BASE_PRODUCTS_URL + decodeURIComponent(pack.img_url)
                    }
                    alt={"Cart Item display image"}
                    class="h-full w-full object-cover object-center"
                  />
                </div>

                <div className="ml-4 flex flex-1 flex-col">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p className="md:text-md mt-1 text-gray-500 lg:text-lg">
                      <Link href={`/products/${item.id}`} locale={locale}>
                        {pack.name}
                      </Link>
                    </p>

                    <span>
                      <p className="ml-4">{formattedPrice(pack.price)}</p>
                    </span>
                  </div>

                  <div className="flex flex-col">
                    {t("product_pack_name")}:<span>{pack.name}</span>
                  </div>

                  <div className="flex flex-1 items-end justify-between text-sm">
                    <p className="text-gray-500">
                      {t("quantity")} {pack.quantity}
                    </p>

                    <MarketCartButtons
                      quantity={pack.quantity}
                      item={item}
                      handleIncreaseCartQuantity={() =>
                        handleIncreaseCartQuantity()
                      }
                      handleDecreaseCartQuantity={() =>
                        handleDecreaseCartQuantity()
                      }
                      handleRemoveFromCart={() => handleRemoveFromCart(pack.id)}
                    />
                  </div>
                </div>
              </>
            </div>
          ))}
        </>
      )}
    </>
  );
}
