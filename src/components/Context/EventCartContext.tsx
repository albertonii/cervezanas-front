"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { ICartItem, IProduct } from "../../lib/types.d";
import { ShoppingCart } from "../Cart/index";

type EventCartContextType = {
  eventItems: ICartItem[];
  cartQuantity: number;
  clearMarketplace: () => void;
  clearItems: () => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  getItemQuantity: (id: string) => number;
  increaseCartQuantity: (id: string) => void;
  decreaseCartQuantity: (id: string) => void;
  removeFromCart: (id: string) => void;
  marketplaceEventItems: IProduct[];
  addMarketplaceItems: (item: IProduct) => void;
  removeMarketplaceItems: (id: string) => void;
};

const EventCartContext = createContext<EventCartContextType>({
  eventItems: [],
  cartQuantity: 0,
  clearMarketplace: () => void {},
  clearItems: () => void {},
  clearCart: () => void {},
  isInCart: () => false,
  getItemQuantity: () => 0,
  increaseCartQuantity: () => void {},
  decreaseCartQuantity: () => void {},
  removeFromCart: () => void {},
  marketplaceEventItems: [],
  addMarketplaceItems: () => void {},
  removeMarketplaceItems: () => void {},
});

interface Props {
  children: React.ReactNode;
}

export function EventCartProvider({ children }: Props) {
  const [eventItems, setEventItems] = useLocalStorage<ICartItem[]>(
    "event-cart",
    []
  );

  const [marketplaceEventItems, setMarketplaceEventItems] = useLocalStorage<
    IProduct[]
  >("marketplace-event-selected-items", []);

  const addMarketplaceItems = (item: IProduct) => {
    if (marketplaceEventItems.some((i) => i.id === item.id)) return;
    setMarketplaceEventItems((items) => [...items, item]);
  };

  const removeMarketplaceItems = (id: string) => {
    setMarketplaceEventItems((items) => items.filter((item) => item.id !== id));
  };

  const clearMarketplace = () => {
    setMarketplaceEventItems([]);
  };

  const clearItems = () => {
    setEventItems([]);
  };

  const clearCart = () => {
    clearMarketplace();
    clearItems();
  };

  const isInCart = useCallback(
    (id: string) => {
      return eventItems.some((item) => item.id === id);
    },
    [eventItems]
  );

  const getItemQuantity = useCallback(
    (id: string) => {
      const item = eventItems?.find((item) => item?.id === id);
      return item?.quantity || 0;
    },
    [eventItems]
  );

  const increaseCartQuantity = useCallback((id: string) => {
    setEventItems((currItems) => {
      const item = currItems.find((item) => item.id === id);
      return item
        ? currItems.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [...currItems, { id, quantity: 1 }];
    });
  }, []);

  const decreaseCartQuantity = useCallback((id: string) => {
    setEventItems((currItems) => {
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
  }, []);

  const removeFromCart = (id: string) => {
    setEventItems((items) => items.filter((item) => item.id !== id));
  };

  //   const openCart = () => setIsOpen(true);
  //   const closeCart = () => setIsOpen(false);

  const cartQuantity = useMemo(() => {
    if (!eventItems) return 0;
    return eventItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [eventItems]);

  const value = useMemo(() => {
    return {
      eventItems,
      marketplaceEventItems,
      addMarketplaceItems,
      removeMarketplaceItems,
      clearMarketplace,
      clearItems,
      clearCart,
      isInCart,
      getItemQuantity,
      increaseCartQuantity,
      decreaseCartQuantity,
      removeFromCart,
      cartQuantity,
    };
  }, [
    eventItems,
    marketplaceEventItems,
    addMarketplaceItems,
    removeMarketplaceItems,
    clearMarketplace,
    clearItems,
    clearCart,
    isInCart,
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
    cartQuantity,
  ]);

  return (
    <EventCartContext.Provider value={value}>
      {children}
      {/* {eventItems && <ShoppingCart />} */}
    </EventCartContext.Provider>
  );
}

export function useEventCartContext() {
  const context = useContext(EventCartContext);
  if (context === undefined) {
    throw new Error("useEventCart must be used within a EventCartProvider");
  }

  return context;
}
