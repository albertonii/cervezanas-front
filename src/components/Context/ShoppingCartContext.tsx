"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { IProductPackCartItem, IProduct, IPackItem } from "../../lib/types.d";
import { ShoppingCart } from "../Cart/index";

type ShoppingCartContextType = {
  items: IProductPackCartItem[];
  cartQuantity: number;
  clearMarketplace: () => void;
  clearItems: () => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  getItemQuantity: (id: string) => number;
  increaseCartQuantity: (id: string) => void;
  increasePackCartQuantity(product: IProduct, pack: IPackItem): void;
  decreaseCartQuantity: (id: string, productId: string) => void;
  removeFromCart: (id: string) => void;
  openCart: () => void;
  closeCart: () => void;
  marketplaceItems: IProduct[];
  addMarketplaceItems: (item: IProduct) => void;
  addShoppingItem: (item: IProductPackCartItem) => void;
  removeMarketplaceItems: (id: string) => void;
  isOpen: boolean;
};

const ShoppingCartContext = createContext<ShoppingCartContextType>({
  items: [],
  cartQuantity: 0,
  clearMarketplace: () => void {},
  clearItems: () => void {},
  clearCart: () => void {},
  isInCart: () => false,
  getItemQuantity: () => 0,
  increaseCartQuantity: () => void {},
  increasePackCartQuantity: () => void {},
  decreaseCartQuantity: () => void {},
  removeFromCart: () => void {},
  openCart: () => void {},
  closeCart: () => void {},
  marketplaceItems: [],
  addMarketplaceItems: () => void {},
  addShoppingItem: () => void {},
  removeMarketplaceItems: () => void {},
  isOpen: false,
});

interface Props {
  children: React.ReactNode;
}

export function ShoppingCartProvider({ children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useLocalStorage<IProductPackCartItem[]>(
    "shopping-cart",
    []
  );

  const [marketplaceItems, setMarketplaceItems] = useLocalStorage<IProduct[]>(
    "marketplace-selected-items",
    []
  );

  const addShoppingItem = (item: IProductPackCartItem) => {
    if (items.some((i) => i.id === item.id)) return;
    setItems((items) => [...items, item]);
  };

  const addMarketplaceItems = (item: IProduct) => {
    if (marketplaceItems.some((i) => i.id === item.id)) return;
    setMarketplaceItems((items) => [...items, item]);
  };

  const removeMarketplaceItems = (id: string) => {
    setMarketplaceItems((items) => items.filter((item) => item.id !== id));
  };

  const clearMarketplace = () => {
    setMarketplaceItems([]);
  };

  const clearItems = () => {
    setItems([]);
  };

  const clearCart = () => {
    clearMarketplace();
    clearItems();
  };

  const isInCart = useCallback(
    (id: string) => {
      return items.some((item) => item.id === id);
    },
    [items]
  );

  const getItemQuantity = useCallback(
    (id: string) => {
      const item = items?.find((item) => item?.id === id);
      return item?.quantity || 0;
    },
    [items]
  );

  const increaseCartQuantity = useCallback((id: string) => {
    // setItems((currItems) => {
    //   const item = currItems.find((item) => item.id === id);
    //   return item
    //     ? currItems.map((item) =>
    //         item.id === id
    //           ? {
    //               ...item,
    //               quantity: item.quantity + 1,
    //             }
    //           : item
    //       )
    //     : [...currItems, { id, quantity: 1 }];
    // });
    return [];
  }, []);

  const increasePackCartQuantity = useCallback(
    (product: IProduct, pack: IPackItem) => {
      setItems((currItems) => {
        const itemFind = currItems.find((item) => item.id === product.id);

        if (itemFind) {
          // Si existe el producto, buscamos el pack
          const packFind = itemFind?.packs.find((p) => {
            return p.id === pack.id;
          });

          // Si no existe el pack pero si el producto, lo añadimos
          if (!packFind) {
            return [
              ...currItems,
              {
                id: product.id,
                quantity: pack.quantity,
                packs: [pack],
                name: product.name,
                price: product.price,
                image: product.product_multimedia[0].p_principal,
              },
            ];
          }

          // Si existe el producto y el pack:
          // Aumentar SOLO la cantidad al pack
          const currItemsv2 = currItems.map((item) => {
            return item.id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + pack.quantity,
                  // Aumentar la cantidad del pack en el producto correspondiente
                  packs: item.packs.map((p) => {
                    return (
                      p.id === pack.id && {
                        ...p,
                        quantity: p.quantity + pack.quantity,
                      }
                    );
                  }),
                }
              : item;
          });

          return currItemsv2;
        } else {
          // Si no existe el product aún en el carrito, lo añadimos
          return [
            ...currItems,
            {
              id: product.id,
              quantity: pack.quantity,
              packs: [pack],
              name: product.name,
              price: product.price,
              image: product.product_multimedia[0].p_principal,
            },
          ];
        }
      });
    },
    []
  );

  const decreaseCartQuantity = useCallback((id: string, productId: string) => {
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
  }, []);

  const removeFromCart = (id: string) => {
    setItems((items) => items.filter((item) => item.id !== id));
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const cartQuantity = useMemo(() => {
    if (!items) return 0;
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const value = useMemo(() => {
    return {
      items,
      marketplaceItems,
      addMarketplaceItems,
      addShoppingItem,
      removeMarketplaceItems,
      clearMarketplace,
      clearItems,
      clearCart,
      isInCart,
      getItemQuantity,
      increaseCartQuantity,
      increasePackCartQuantity,
      decreaseCartQuantity,
      removeFromCart,
      openCart,
      closeCart,
      cartQuantity,
      isOpen,
    };
  }, [
    items,
    marketplaceItems,
    addMarketplaceItems,
    addShoppingItem,
    removeMarketplaceItems,
    clearMarketplace,
    clearItems,
    clearCart,
    isInCart,
    getItemQuantity,
    increaseCartQuantity,
    increasePackCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
    openCart,
    closeCart,
    cartQuantity,
    isOpen,
  ]);

  return (
    <ShoppingCartContext.Provider value={value}>
      {children}
      {items && <ShoppingCart />}
    </ShoppingCartContext.Provider>
  );
}

export function useShoppingCart() {
  const context = useContext(ShoppingCartContext);
  if (context === undefined) {
    throw new Error(
      "useShoppingCart must be used within a ShoppingCartProvider"
    );
  }

  return context;
}
