import React, { useState } from "react";
import MarketCartButtons from "../../../../../components/common/MarketCartButtons";
import { useShoppingCart } from "../../../../../components/Context";
import { IProduct, IProductPack } from "../../../../../lib/types";

interface Props {
  pack: IProductPack;
  product: IProduct;
  marketplaceProducts: IProduct[];
}

export default function PackUnits({
  pack,
  product,
  marketplaceProducts,
}: Props) {
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

  const [quantity, setQuantity] = useState(1);

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

  return (
    <>
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
