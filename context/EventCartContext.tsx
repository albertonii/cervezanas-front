"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useLocalStorage } from "../src/hooks/useLocalStorage";
import { IProduct, IProductPack, IProductPackCartItem } from "../src/lib/types";

type EventCartContextType = {
  eventItems: IProductPackCartItem[];
  cartQuantity: number;
  clearItems: () => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  getItemQuantity: (id: string) => number;
  getPackQuantity: (id: string) => number;
  increasePackCartQuantity(product: IProduct, pack: IProductPack): void;
  increaseOnePackCartQuantity: (productId: string, packId: string) => void;
  decreaseOnePackCartQuantity: (productId: string, packId: string) => void;
  removeFromCart: (productId: string, packId: string) => void;
  openCart: () => void;
  closeCart: () => void;
  isOpen: boolean;
};

const EventCartContext = createContext<EventCartContextType>({
  eventItems: [],
  cartQuantity: 0,
  clearItems: () => void {},
  clearCart: () => void {},
  isInCart: () => false,
  getItemQuantity: () => 0,
  getPackQuantity: () => 0,
  removeFromCart: () => void {},
  increaseOnePackCartQuantity: () => void {},
  increasePackCartQuantity: () => void {},
  decreaseOnePackCartQuantity: () => void {},
  openCart: () => void {},
  closeCart: () => void {},
  isOpen: false,
});

interface Props {
  children: React.ReactNode;
}

export function EventCartProvider({ children }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const [eventItems, setEventItems] = useLocalStorage<IProductPackCartItem[]>(
    "event-cart",
    []
  );

  const clearItems = () => {
    setEventItems([]);
  };

  const clearCart = () => {
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

  const getPackQuantity = useCallback(
    (packId: string) => {
      let packFind: IProductPack | undefined;

      // Get the pack quantity from the cart product
      eventItems?.map(
        (item) =>
          (packFind = item?.packs.find((pack) => {
            return pack.id === packId;
          }))
      );

      return packFind ? packFind.quantity : 0;
    },
    [eventItems]
  );

  // const increasePackCartQuantity = useCallback((id: string) => {
  //   setEventItems((currItems) => {
  //     const item = currItems.find((item) => item.id === id);
  //     return item
  //       ? currItems.map((item) =>
  //           item.id === id ? { ...item, quantity: item.quantity + 1 } : item
  //         )
  //       : [...currItems, { id, quantity: 1 }];
  //   });
  // }, []);

  const increasePackCartQuantity = useCallback(
    (product: IProduct, pack: IProductPack) => {
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

      setEventItems((currItems) => {
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
    const newItems = eventItems.map((item) => {
      if (item && productId && item.id === productId) {
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

    setEventItems(newItems);
  };

  const decreaseOnePackCartQuantity = (productId: string, packId: string) => {
    const newItems = eventItems.map((item) => {
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

    setEventItems(newItems);
  };

  // const decreaseCartQuantity = useCallback((id: string) => {
  //   setEventItems((currItems) => {
  //     if (currItems.find((item) => item.id === id)?.quantity === 1) {
  //       return currItems.filter((item) => item.id !== id);
  //     } else {
  //       return currItems.map((item) => {
  //         if (item.id === id) {
  //           return { ...item, quantity: item.quantity - 1 };
  //         } else {
  //           return item;
  //         }
  //       });
  //     }
  //   });
  // }, []);

  // const removeFromCart = (id: string) => {
  //   setEventItems((items) => items.filter((item) => item.id !== id));
  // };

  const removeFromCart = (productId: string, packId: string) => {
    setEventItems((items) => {
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

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // const cartQuantity = useMemo(() => {
  //   if (!eventItems) return 0;
  //   return eventItems.reduce((acc, item) => acc + item.quantity, 0);
  // }, [eventItems]);

  const cartQuantity = useMemo(() => {
    let quantity = 0;
    if (!eventItems) return quantity;
    eventItems.map((item) => {
      quantity += item.packs.reduce((acc, pack) => acc + pack.quantity, 0);
    });

    return quantity;
  }, [eventItems]);

  const value = useMemo(() => {
    return {
      eventItems,
      clearItems,
      clearCart,
      isInCart,
      getItemQuantity,
      getPackQuantity,
      removeFromCart,
      openCart,
      closeCart,
      cartQuantity,
      isOpen,
      increasePackCartQuantity,
      increaseOnePackCartQuantity,
      decreaseOnePackCartQuantity,
    };
  }, [
    eventItems,
    clearItems,
    clearCart,
    isInCart,
    getItemQuantity,
    getPackQuantity,
    removeFromCart,
    openCart,
    closeCart,
    cartQuantity,
    isOpen,
    increasePackCartQuantity,
    increaseOnePackCartQuantity,
    decreaseOnePackCartQuantity,
  ]);

  return (
    <EventCartContext.Provider value={value}>
      {children}
      {/* {eventItems && <ShoppingCart />} */}
    </EventCartContext.Provider>
  );
}

export function useEventCart() {
  const context = useContext(EventCartContext);
  if (context === undefined) {
    throw new Error("useEventCart must be used within a EventCartProvider");
  }

  return context;
}
