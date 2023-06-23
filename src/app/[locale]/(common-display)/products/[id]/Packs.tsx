"use client";

import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { AddCardButton } from "../../../../../components/common";
import MarketCartButtons from "../../../../../components/common/MarketCartButtons";
import MarketCartButtons2 from "../../../../../components/common/MarketCartButtons2";
import { useShoppingCart } from "../../../../../components/Context";
import { IProduct } from "../../../../../lib/types";
import PackItem from "./PackItem";

interface Props {
  product: IProduct;
  marketplaceProducts: IProduct[];
}

export default function Packs({ product, marketplaceProducts }: Props) {
  const t = useTranslations();
  const productId = product.id;

  const {
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
    marketplaceItems,
    addMarketplaceItems,
    removeMarketplaceItems,
  } = useShoppingCart();

  const quantity = getItemQuantity(productId);
  const [packQuantity, setPackQuantity] = useState(1);

  const [selectedPack, setSelectedPack] = useState("");

  const handleItemSelected = (itemId: string) => {
    setSelectedPack(itemId);
  };

  const handleIncreaseToCartItem = () => {
    // increaseCartQuantity(productId, "");
    if (marketplaceItems.find((item) => item.id === productId)) return;
    const product = marketplaceProducts.find(({ id }) => id === productId);
    if (!product) return;
    addMarketplaceItems(product);
  };

  const handleAddToCart = (packId: string) => {
    const pack = product.product_pack.find(({ id }) => id === packId);
    if (!pack) return;

    // Make a copy of the product only with one pack
    const productCopy = {
      ...product,
      product_pack: [pack],
    };

    increaseCartQuantity(productId);
    addMarketplaceItems(productCopy);

    // increaseCartQuantity(productId, "");
    // if (marketplaceItems.find((item) => item.id === productId)) return;
    // const p = marketplaceProducts.find(({ id }) => id === productId);
    // if (!p) return;
    // addMarketplaceItems(p);
    setSelectedPack("");
    setPackQuantity(1);
  };

  const handleDecreaseFromCartItem = () => {
    decreaseCartQuantity(productId, "");
    if (getItemQuantity(productId) > 1) return;
    removeMarketplaceItems(productId);
  };

  const handleIncreasePackQuantity = () => {
    setPackQuantity(packQuantity + 1);
  };

  const handleDecreasePackQuantity = () => {
    if (packQuantity > 1) setPackQuantity(packQuantity - 1);
  };

  const handleRemoveFromCart = () => {
    removeMarketplaceItems(productId);
    removeFromCart(productId);
  };

  return (
    <>
      {/* <!-- Sizes --> */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900">
            {t("product_packs")}
          </h4>
        </div>

        <fieldset className="mt-4">
          <legend className="sr-only">{t("choose_pack")}</legend>
          <ul className="grid grid-cols-1 gap-2 rounded border bg-beer-blonde/20 p-2 sm:grid-cols-4 md:grid-cols-5 2xl:grid-cols-6">
            {product.product_pack
              .slice() // Copy the array to avoid mutating the original
              .sort((a, b) => a.quantity - b.quantity) // Sort by quantity
              .map((p) => (
                <div key={p.id} className="space-y-2">
                  <PackItem
                    marketplaceProducts={marketplaceProducts}
                    product={product}
                    pack={p}
                    handleItemSelected={handleItemSelected}
                    selectedPack={selectedPack}
                  />
                </div>
              ))}
          </ul>

          <form>
            <div className="mt-6 flex space-x-2">
              <MarketCartButtons2
                quantity={packQuantity}
                item={product}
                handleIncreaseCartQuantity={() => handleIncreasePackQuantity()}
                handleDecreaseCartQuantity={() => handleDecreasePackQuantity()}
                handleRemoveFromCart={() => handleRemoveFromCart()}
              />

              <AddCardButton
                withText={true}
                onClick={() => handleAddToCart(selectedPack)}
              />
            </div>
          </form>
        </fieldset>
      </div>
    </>
  );
}
