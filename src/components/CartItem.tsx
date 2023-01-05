import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import useFetchProducts from "../hooks/useFetchBeers";
import { Beer } from "../types";
import { formatCurrency } from "../utils/formatCurrency";
import { useShoppingCart } from "./Context/ShoppingCartContext";

type CartItemProps = {
  id: string;
  quantity: number;
};

export function CartItem({ id, quantity }: CartItemProps) {
  const [item, setItem] = useState<Beer | null>(null);
  const [itemMultimedia, setItemMultimedia] = useState<string>("");
  const { removeFromCart } = useShoppingCart();

  const { data: beers } = useFetchProducts();

  useEffect(() => {
    const findBeers = async () => {
      setItem(beers?.find((i) => i.id === id));
      if (item == null) return null;

      if (item.product_multimedia[0] != null) {
        setItemMultimedia(item.product_multimedia[0].p_principal?.bucket_url);
      } else {
        setItemMultimedia("/marketplace_product_default.png");
      }
    };

    if (beers != null && beers.length > 0) {
      findBeers();
    }
  }, [beers, id, item]);

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
            <div>
              <div className="flex justify-between text-base font-medium text-gray-900">
                <h3>{/* <a href={item.href}>{item.name}</a> */}</h3>
                <p className="ml-4">{formatCurrency(item.price)}</p>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                <Link href={`/products/${item.id}`}>{item.name}</Link>
              </p>
            </div>
            <div className="flex flex-1 items-end justify-between text-sm">
              <p className="text-gray-500">Qty {quantity}</p>

              <div className="flex">
                <button
                  type="button"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
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
