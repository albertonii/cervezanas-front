"use client";

import Link from "next/link";
import DisplayImageProduct from "../components/common/DisplayImageProduct";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { IProduct } from "../lib/types";
import { formatCurrency } from "../utils/formatCurrency";
import { useEventCartContext } from "../components/Context/EventCartContext";
import MarketCartButtons from "../components/common/MarketCartButtons";

type CartItemProps = {
  id: string;
  quantity: number;
  products: IProduct[];
};

export function EventCartItem({ id, quantity, products }: CartItemProps) {
  const { t } = useTranslation();
  const [item, setItem] = useState<IProduct | null>(null);
  const [itemMultimedia, setItemMultimedia] = useState<string>("");
  const {
    removeFromCart,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeMarketplaceItems,
    marketplaceEventItems,
    addMarketplaceItems,
    getItemQuantity,
  } = useEventCartContext();

  useEffect(() => {
    const findProducts = async () => {
      const p = products?.find((i) => i.id === id);
      if (p) {
        setItem(p);
        setItemMultimedia(p.product_multimedia[0]?.p_principal);
      }
    };

    if (products && products.length > 0) {
      findProducts();
    }

    () => {
      setItem(null);
      setItemMultimedia("");
    };
  }, [products, id, item]);

  const handleIncreaseCartQuantity = useCallback(() => {
    increaseCartQuantity(id);
    if (marketplaceEventItems.find((item) => item.id === id)) return;
    const product: IProduct | undefined = marketplaceEventItems.find(
      (item) => item.id === id
    );
    if (product) {
      addMarketplaceItems(product);
    }
  }, [increaseCartQuantity, marketplaceEventItems, addMarketplaceItems]);

  const handleDecreaseCartQuantity = useCallback(() => {
    decreaseCartQuantity(id);
    if (getItemQuantity(id) > 1) return;
    removeMarketplaceItems(id);
  }, [decreaseCartQuantity, getItemQuantity, removeMarketplaceItems]);

  const handleRemoveFromCart = useCallback(
    (itemId: string) => {
      removeMarketplaceItems(itemId);
      removeFromCart(itemId);
    },
    [removeFromCart, removeMarketplaceItems]
  );

  const formattedPrice = useMemo(
    () => formatCurrency(item?.price ?? 0),
    [item?.price]
  );

  return (
    <>
      {item && (
        <>
          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
            <DisplayImageProduct
              width={240}
              height={200}
              imgSrc={itemMultimedia}
              alt={"Cart Item display image"}
              class="h-full w-full object-cover object-center"
            />
          </div>

          <div className="ml-4 flex flex-1 flex-col">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p className="mt-1 text-lg text-gray-500">
                <Link href={`/products/${item.id}`}>{item.name}</Link>
              </p>

              <h3>
                <p className="ml-4">{formattedPrice}</p>
              </h3>
            </div>

            <div className="flex flex-1 items-end justify-between text-sm">
              <p className="text-gray-500">
                {t("quantity")} {quantity}
              </p>

              <MarketCartButtons
                quantity={quantity}
                item={item}
                handleIncreaseCartQuantity={() => handleIncreaseCartQuantity()}
                handleDecreaseCartQuantity={() => handleDecreaseCartQuantity()}
                handleRemoveFromCart={() => handleRemoveFromCart(item.id)}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
