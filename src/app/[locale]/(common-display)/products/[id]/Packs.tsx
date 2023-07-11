"use client";

import PackItem from "./PackItem";
import MarketCartButtons2 from "../../../../../components/common/MarketCartButtons2";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { AddCardButton } from "../../../../../components/common";
import { useShoppingCart } from "../../../../../components/Context";
import { IPackItem, IProduct, IProductPack } from "../../../../../lib/types";

interface Props {
  product: IProduct;
  marketplaceProducts: IProduct[];
}

export default function Packs({ product, marketplaceProducts }: Props) {
  const t = useTranslations();
  const productId = product.id;

  const {
    getItemQuantity,
    increasePackCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
    marketplaceItems,
    addMarketplaceItems,
    removeMarketplaceItems,
  } = useShoppingCart();

  const [packQuantity, setPackQuantity] = useState(1);
  const [isPackSelected, setIsPackSelected] = useState(true);

  const [selectedPack, setSelectedPack] = useState<IProductPack>();

  const handleItemSelected = (item: IProductPack) => {
    setSelectedPack(item);
  };

  // const handleIncreaseToCartItem = () => {
  //   // increaseCartQuantity(productId, "");
  //   if (marketplaceItems.find((item) => item.id === productId)) return;
  //   const product = marketplaceProducts.find(({ id }) => id === productId);
  //   if (!product) return;
  //   addMarketplaceItems(product);
  // };

  // const handleAddToCart = (packId: string) => {
  //   const pack = product.product_pack.find(({ id }) => id === packId);
  //   if (!pack) return;

  //   // Make a copy of the product only with one pack
  //   const productCopy = {
  //     ...product,
  //     product_pack: [pack],
  //   };

  //   increaseCartQuantity(productId);
  //   addMarketplaceItems(productCopy);

  //   // increaseCartQuantity(productId, "");
  //   // if (marketplaceItems.find((item) => item.id === productId)) return;
  //   // const p = marketplaceProducts.find(({ id }) => id === productId);
  //   // if (!p) return;
  //   // addMarketplaceItems(p);
  //   setSelectedPack("");
  //   setPackQuantity(1);
  // };

  const handleDecreaseFromCartItem = () => {
    decreaseCartQuantity(productId, "");
    if (getItemQuantity(productId) > 1) return;
    removeMarketplaceItems(productId);
  };

  const handleIncreasePackQuantity = () => {
    setPackQuantity(packQuantity + 1);
  };

  const handleAddToCart = () => {
    if (!selectedPack) {
      setIsPackSelected(false);
      return;
    }

    setIsPackSelected(true);

    // Comprobamos si existe el producto en el carrito
    const productExistInCart = marketplaceItems.find(
      (item) => item.id === productId
    );

    if (productExistInCart) {
      // Si existe, comprobamos si existe el pack
      const packExistInCart = productExistInCart.product_pack.find(
        (item) => item.id === selectedPack.id
      );

      if (packExistInCart) {
        console.log("Pack exist in cart ", packExistInCart);

        const packCartItem: IPackItem = {
          id: selectedPack.id,
          quantity: packExistInCart.quantity + packQuantity,
          price: selectedPack.price,
          name: selectedPack.name,
        };

        console.log("Pack quantity ", packQuantity);
        console.log("Pack cart item ", packCartItem);

        // Si existe, aumentamos la cantidad del pack
        increasePackCartQuantity(product, packCartItem);
      } else {
        const packCartItem: IPackItem = {
          id: selectedPack.id,
          quantity: packQuantity,
          price: selectedPack.price,
          name: selectedPack.name,
        };

        // Si no existe, añadimos el pack
        productExistInCart.product_pack.push(selectedPack);
        increasePackCartQuantity(product, packCartItem);
      }
    } else {
      // Creamos una copia del producto sin los packs que tenga configurados
      const productWithoutPacks = { ...product };
      productWithoutPacks.product_pack = [];

      const itemPack: IProductPack = {
        id: selectedPack.id,
        name: selectedPack.name,
        quantity: packQuantity,
        price: selectedPack.price,
        img_url: selectedPack.img_url,
        randomUUID: selectedPack.randomUUID,
      };

      // Añadimos el pack al producto
      productWithoutPacks.product_pack.push(itemPack);

      // Si no existe el producto, añadimos el producto y el pack
      addMarketplaceItems(productWithoutPacks);
    }

    setPackQuantity(1);
    // increaseCartQuantity(productId, pack);
    // if (marketplaceItems.find((item) => item.id === productId)) return;
    // const p = marketplaceProducts.find(({ id }) => id === productId);
    // if (!p) return;
    // addMarketplaceItems(p);
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
                    selectedPackId={selectedPack?.id ?? ""}
                  />
                </div>
              ))}
          </ul>

          {/* Warning message if pack is not selected  */}
          {!isPackSelected && (
            <div className="text-md mt-4 flex flex-1 items-center justify-start text-red-500">
              {t("select_pack")}
            </div>
          )}

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
                onClick={() => handleAddToCart()}
              />
            </div>
          </form>
        </fieldset>
      </div>
    </>
  );
}
