import { Button } from "@supabase/ui";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SupabaseProps } from "../../constants";
import { Product } from "../../lib/types";
import { formatCurrency } from "../../utils/formatCurrency";
import { useShoppingCart } from "../Context/ShoppingCartContext";

type CartItemProps = {
  id: string;
  quantity: number;
  products: Product[];
};

export function CartItem({ id, quantity, products }: CartItemProps) {
  const { t } = useTranslation();
  const [item, setItem] = useState<Product | null>(null);
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
      setItem(products?.find((i) => i.id === id)!);

      if (item == null) return null;

      if (item.product_multimedia[0] != null || undefined) {
        setItemMultimedia(
          `${SupabaseProps.BASE_PRODUCTS_URL}${SupabaseProps.PRODUCT_P_PRINCIPAL}${item.owner_id}/${item.product_multimedia[0].p_principal}`
        );
      } else {
        setItemMultimedia("/marketplace_product_default.png");
      }
    };

    if (products != null && products.length > 0) {
      findProducts();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    () => {
      setItem(null);
      setItemMultimedia("");
    };
  }, [products, id, item]);

  const handleIncreaseCartQuantity = (productId: string) => {
    increaseCartQuantity(productId);
    if (marketplaceItems.find((item) => item.id === productId)) return;
    const product: Product | undefined = marketplaceItems.find(
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
      {item ? (
        <>
          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
            <Image
              width={240}
              height={200}
              src={itemMultimedia}
              alt={""}
              className="h-full w-full object-cover object-center"
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
                <div className="flex items-center justify-center mr-2">
                  <Button onClick={() => handleDecreaseCartQuantity(id)}>
                    -
                  </Button>
                  <span className="text-lg text-white">{quantity}</span>
                  <Button onClick={() => handleIncreaseCartQuantity(id)}>
                    +
                  </Button>
                </div>

                <button
                  type="button"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                  onClick={() => handleRemoveFromCart(item.id)}
                >
                  {t("remove")}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
