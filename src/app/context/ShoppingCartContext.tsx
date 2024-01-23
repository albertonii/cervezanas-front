"use client";

import { createContext, useContext, useState } from "react";
import { ShoppingCart } from "../[locale]/components/Cart/ShoppingCart";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { IProductPackCartItem, IProduct, IProductPack } from "../../lib/types";

type ShoppingCartContextType = {
  items: IProductPackCartItem[];
  cartQuantity: () => number;
  clearItems: () => void;
  clearCart: () => void;
  getItemQuantity: (id: string) => number;
  addPackToCart(product: IProduct, pack: IProductPack): void;
  increaseOnePackCartQuantity: (productId: string, packId: string) => void;
  decreaseOnePackCartQuantity: (productId: string, packId: string) => void;
  removeFromCart: (productId: string, packId: string) => void;
  openCart: () => void;
  closeCart: () => void;
  isOpen: boolean;
  updateCartItem: (newItem: IProductPackCartItem) => void;
  checkIsShoppingCartDeliverable: () => boolean;
};

const ShoppingCartContext = createContext<ShoppingCartContextType>({
  items: [],
  cartQuantity: () => 0,
  clearItems: () => void {},
  clearCart: () => void {},
  getItemQuantity: () => 0,
  increaseOnePackCartQuantity: () => void {},
  addPackToCart: () => void {},
  decreaseOnePackCartQuantity: () => void {},
  removeFromCart: () => void {},
  openCart: () => void {},
  closeCart: () => void {},
  isOpen: false,
  updateCartItem: () => void {},
  checkIsShoppingCartDeliverable: () => false,
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

  const clearItems = () => {
    setItems([]);
  };

  const clearCart = () => {
    clearItems();
  };

  // Check if all the products in the cart are deliverable
  const checkIsShoppingCartDeliverable = () => {
    if (!items) return false;

    const isDeliverable = items.every((item) => {
      return item.distributor_id !== "";
    });

    return isDeliverable;
  };

  const getItemQuantity = (id: string) => {
    const item = items?.find((item) => item?.id === id);
    return item?.quantity || 0;
  };

  const addPackToCart = (product: IProduct, pack: IProductPack) => {
    const newPack: IProductPackCartItem = {
      id: product.id,
      quantity: pack.quantity,
      packs: [pack],
      name: product.name,
      price: product.price,
      image: product.product_multimedia[0].p_principal,
      producer_id: product.owner_id,
      distributor_id: "",
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
          const currItemsCopy = currItems.map((item: IProductPackCartItem) => {
            return item.id === product.id ? itemFind : item;
          });

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
  };

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

      const itemsReturned = items.map((item) => {
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

      // Eliminar el producto si no tiene packs
      return itemsReturned.filter((item) => {
        return item.packs.length > 0;
      });
    });
  };

  // Update one item in the cart by identifier
  const updateCartItem = (newItem: IProductPackCartItem) => {
    setItems((items) => {
      if (!items) return [];

      const itemsReturned = items.map((item) => {
        if (item.id === newItem.id) {
          return newItem;
        } else {
          return item;
        }
      });

      return itemsReturned;
    });
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const cartQuantity = () => {
    let quantity = 0;

    if (!items) return quantity;
    items.map((item) => {
      quantity += item.packs.reduce((acc, pack) => acc + pack.quantity, 0);
    });

    return quantity;
  };

  const value = {
    items,
    clearItems,
    clearCart,
    getItemQuantity,
    removeFromCart,
    openCart,
    closeCart,
    cartQuantity,
    isOpen,
    addPackToCart,
    increaseOnePackCartQuantity,
    decreaseOnePackCartQuantity,
    updateCartItem,
    checkIsShoppingCartDeliverable,
  };

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
