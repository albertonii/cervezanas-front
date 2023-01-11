import { createContext, useContext, useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { CartItem } from "../../lib/types";
import { Beer } from "../../types";
import ShoppingCart from "../Cart/ShoppingCart";

type ShoppingCartContextType = {
  items: CartItem[];
  cartQuantity: number;
  clear: () => void;
  isInCart: (id: string) => boolean;
  getItemQuantity: (id: string) => number;
  increaseCartQuantity: (id: string) => void;
  decreaseCartQuantity: (id: string) => void;
  removeFromCart: (id: string) => void;
  openCart: () => void;
  closeCart: () => void;
  marketplaceItems: Beer[];
  addMarketplaceItems: (item: Beer) => void;
  removeMarketplaceItems: (id: string) => void;
};

const ShoppingCartContext = createContext<ShoppingCartContextType>({
  items: [],
  cartQuantity: 0,
  clear: () => {},
  isInCart: (id: string) => false,
  getItemQuantity: (id: string) => 0,
  increaseCartQuantity: (id: string) => {},
  decreaseCartQuantity: (id: string) => {},
  removeFromCart: (id: string) => {},
  openCart: () => {},
  closeCart: () => {},
  marketplaceItems: [],
  addMarketplaceItems: (item: Beer) => {},
  removeMarketplaceItems: (id: string) => {},
});

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useLocalStorage<CartItem[]>("shopping-cart", []);

  const [marketplaceItems, setMarketplaceItems] = useState<Beer[]>([]);

  const addMarketplaceItems = (item: Beer) => {
    setMarketplaceItems((items) => [...items, item]);
  };

  const removeMarketplaceItems = (id: string) => {
    setMarketplaceItems((items) => items.filter((item) => item.id !== id));
  };

  const clear = () => {
    setItems([]);
  };

  const isInCart = (id: string) => {
    return items.some((item) => item.id === id);
  };

  const getItemQuantity = (id: string) => {
    const item = items.find((item) => item.id === id);
    return item ? item.quantity : 0;
  };

  const increaseCartQuantity = (id: string) => {
    setItems((currItems) => {
      if (currItems.find((item) => item.id === id) == null) {
        return [...currItems, { id, quantity: 1 }];
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });
  };

  const decreaseCartQuantity = (id: string) => {
    setItems((currItems) => {
      if (currItems.find((item) => item.id === id)?.quantity === 1) {
        return currItems.filter((item) => item.id !== id);
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  };

  const removeFromCart = (id: string) => {
    setItems((items) => items.filter((item) => item.id !== id));
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const cartQuantity = items?.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );

  return (
    <ShoppingCartContext.Provider
      value={{
        items,
        marketplaceItems,
        addMarketplaceItems,
        removeMarketplaceItems,
        clear,
        isInCart,
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        openCart,
        closeCart,
        cartQuantity,
      }}
    >
      {children}
      <ShoppingCart isOpen={isOpen} />
    </ShoppingCartContext.Provider>
  );
}
