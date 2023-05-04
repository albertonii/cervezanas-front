import Link from "next/link";
import DisplayImageProduct from "../common/DisplayImageProduct";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IProduct } from "../../lib/types.d";
import { formatCurrency } from "../../utils/formatCurrency";
import { DecreaseButton, DeleteButton, IncreaseButton } from "../common";
import { useShoppingCart } from "../Context/ShoppingCartContext";

type CartItemProps = {
  id: string;
  quantity: number;
  products: IProduct[];
};

export function CartItem({ id, quantity, products }: CartItemProps) {
  const { t } = useTranslation();
  const [item, setItem] = useState<IProduct | null>(null);
  const [itemMultimedia, setItemMultimedia] = useState<string>("");
  const {
    removeFromCart,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeMarketplaceItems,
    marketplaceItems,
    addMarketplaceItems,
    getItemQuantity,
  } = useShoppingCart();

  useEffect(() => {
    const findProducts = async () => {
      const p = products?.find((i) => i.id === id);
      if (!p) return;
      setItem(p);
      setItemMultimedia(p.product_multimedia[0].p_principal);
    };

    if (products != null && products.length > 0) {
      findProducts();
    }

    () => {
      setItem(null);
      setItemMultimedia("");
    };
  }, [products, id, item]);

  const handleIncreaseCartQuantity = (productId: string) => {
    increaseCartQuantity(productId);
    if (marketplaceItems.find((item) => item.id === productId)) return;
    const product: IProduct | undefined = marketplaceItems.find(
      (item) => item.id === productId
    );
    if (!product) return;
    addMarketplaceItems(product);
  };

  const handleDecreaseCartQuantity = (productId: string) => {
    decreaseCartQuantity(productId);
    if (getItemQuantity(productId) > 1) return;
    removeMarketplaceItems(productId);
  };

  const handleRemoveFromCart = (productId: string) => {
    removeMarketplaceItems(productId);
    removeFromCart(productId);
  };

  return (
    <>
      {item && (
        <>
          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
            <DisplayImageProduct
              width={240}
              height={200}
              imgSrc={itemMultimedia}
              alt={""}
              class="h-full w-full object-cover object-center"
            />
          </div>

          <div className="ml-4 flex flex-1 flex-col">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p className="mt-1 text-lg text-gray-500">
                <Link href={`/products/${item.id}`}>{item.name}</Link>
              </p>

              <h3>
                <p className="ml-4">{formatCurrency(item.price)}</p>
              </h3>
            </div>

            <div className="flex flex-1 items-end justify-between text-sm">
              <p className="text-gray-500">
                {t("quantity")} {quantity}
              </p>

              <div className="flex">
                <div className="mr-2 flex items-center justify-center">
                  <DecreaseButton
                    onClick={() => handleDecreaseCartQuantity(id)}
                  />

                  <span className="mx-2 text-xl text-beer-draft">
                    {quantity}
                  </span>

                  <IncreaseButton
                    onClick={() => handleIncreaseCartQuantity(id)}
                  />
                </div>

                <DeleteButton onClick={() => handleRemoveFromCart(item.id)} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
