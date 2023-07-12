"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import {
  IProductPackCartItem,
  IProduct,
  IProductPack,
} from "../../lib/types.d";
import { ShoppingCart } from "../Cart/index";

type ShoppingCartContextType = {
  items: IProductPackCartItem[];
  cartQuantity: number;
  clearMarketplace: () => void;
  clearItems: () => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  getItemQuantity: (id: string) => number;
  increaseOnePackCartQuantity: (productId: string, packId: string) => void;
  increasePackCartQuantity(product: IProduct, pack: IProductPack): void;
  decreaseOnePackCartQuantity: (productId: string, packId: string) => void;
  removeFromCart: (productId: string, packId: string) => void;
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
  increaseOnePackCartQuantity: () => void {},
  increasePackCartQuantity: () => void {},
  decreaseOnePackCartQuantity: () => void {},
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

  const increasePackCartQuantity = useCallback(
    (product: IProduct, pack: IProductPack) => {
      const newPack: IProductPackCartItem = {
        id: product.id,
        quantity: pack.quantity,
        packs: [pack],
        name: product.name,
        price: product.price,
        image: product.product_multimedia[0].p_principal,
      };

      setItems((currItems) => {
        // Buscamos el producto en el carrito
        const itemFind = currItems.find((item) => item.id === product.id);

        if (itemFind) {
          // Si existe el producto, buscamos el pack
          const packFind = itemFind.packs.find((p) => {
            return p.id === pack.id;
          });

          // Si no existe el pack pero si el producto, lo añadimos
          if (!packFind) {
            // Añadimos el pack al listado de packs del producto
            itemFind.packs.push(pack);

            // Reemplazar el producto en el listado de productos
            const currItemsCopy = currItems.map(
              (item: IProductPackCartItem) => {
                return item.id === product.id ? itemFind : item;
              }
            );

            return [...currItemsCopy];
          }

          // Si existe el pack en el producto
          // Aumentamos SOLO la cantidad al pack
          const currItemsv2 = currItems.map((item) => {
            return item.id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + pack.quantity,
                  // Aumentar la cantidad del pack en el producto correspondiente
                  packs: item.packs.map((p) => {
                    return p.id === pack.id
                      ? {
                          ...p,
                          quantity: p.quantity + pack.quantity,
                        }
                      : p;
                  }),
                }
              : item;
          });

          return currItemsv2;
        } else {
          // Si no existe el producto aún en el carrito, lo añadimos
          return [...currItems, newPack];
        }
      });
    },
    []
  );

  const increaseOnePackCartQuantity = (productId: string, packId: string) => {
    const newItems = items.map((item) => {
      if (item.id === productId) {
        const newPacks = item.packs.map((pack) => {
          if (pack.id === packId) {
            return {
              ...pack,
              quantity: pack.quantity + 1,
            };
          } else {
            return pack;
          }
        });

        return {
          ...item,
          packs: newPacks,
        };
      } else {
        return item;
      }
    });

    setItems(newItems);
  };

  const decreaseOnePackCartQuantity = (productId: string, packId: string) => {
    const newItems = items.map((item) => {
      if (item.id === productId) {
        const newPacks = item.packs.map((pack) => {
          if (pack.id === packId && pack.quantity > 1) {
            return {
              ...pack,
              quantity: pack.quantity - 1,
            };
          } else {
            return pack;
          }
        });

        return {
          ...item,
          packs: newPacks,
        };
      } else {
        return item;
      }
    });

    setItems(newItems);
  };

  const removeFromCart = (productId: string, packId: string) => {
    setItems((items) => {
      if (!items) return [];
      if (items.length === 1) return [];

      return items.map((item) => {
        if (item.id === productId) {
          return {
            ...item,
            packs: item.packs.filter((pack) => {
              return pack.id !== packId;
            }),
          };
        } else {
          return item;
        }
      });
    });
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const cartQuantity = useMemo(() => {
    let quantity = 0;

    if (!items) return quantity;
    items.map((item) => {
      quantity += item.packs.reduce((acc, pack) => acc + pack.quantity, 0);
    });

    return quantity;
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
      increasePackCartQuantity,
      removeFromCart,
      openCart,
      closeCart,
      cartQuantity,
      isOpen,
      increaseOnePackCartQuantity,
      decreaseOnePackCartQuantity,
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
    increasePackCartQuantity,
    removeFromCart,
    openCart,
    closeCart,
    cartQuantity,
    isOpen,
    increaseOnePackCartQuantity,
    decreaseOnePackCartQuantity,
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
