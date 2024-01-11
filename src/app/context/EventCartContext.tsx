"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { IProduct, IProductPack, IProductPackCartItem } from "../../lib/types";

type EventCartsType = {
  [eventId: string]: IProductPackCartItem[];
};

type EventCartContextType = {
  eventCarts: EventCartsType;
  getCartQuantity: (eventId: string) => number;
  clearCart: (eventId:string) => void;
  isInCart: (eventId: string, id: string) => boolean;
  getItemQuantity: (eventId:string, id: string) => number;
  getPackQuantity: (eventId: string, productId:string, id: string) => number;
  increasePackCartQuantity(
    eventId: string,
    product: IProduct,
    pack: IProductPack
  ): void;
  increaseOnePackCartQuantity: (eventId:string, productId: string, packId: string) => void;
  decreaseOnePackCartQuantity: (eventId:string, productId: string, packId: string) => void;
  removeFromCart: (eventId:string, productId: string, packId: string) => void;
  openCart: () => void;
  closeCart: () => void;
  isOpen: boolean;
  existEventCart: (eventId: string) => boolean;
  createNewCart: (eventId: string) => void;
};

const EventCartContext = createContext<EventCartContextType>({
  eventCarts: {},
  getCartQuantity: () => 0,
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
  existEventCart: () => false,
  createNewCart: () => void {},
});

interface Props {
  children: React.ReactNode;
}

export function EventCartProvider({ children }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const [eventCarts, setEventCarts] = useLocalStorage<EventCartsType>(
    "event-carts",
    {}
  );


  const getCartByEvent = useCallback(
    (eventId: string) => {
      return eventCarts[eventId] || [];
    },
    [eventCarts]
  );

  const createNewCart = useCallback(
    (eventId: string) => {
      setEventCarts((currCarts) => {
        return {
          ...currCarts,
          [eventId]: [],
        };
      });
    },
    [setEventCarts]
  );

  const existEventCart = useCallback(
    (eventId: string) => {
      return !!eventCarts[eventId];
    },
    [eventCarts]
  );

  const clearCart = (eventId: string) => {
     setEventCarts((currCarts) => {
      return {
        ...currCarts,
        [eventId]: [],
      };
    });
  };

  const isInCart = useCallback(
    (eventId:string,id: string) => {
      const eventItems = getCartByEvent(eventId);

      return eventItems.some((item) => item.id === id);
    },
    [eventCarts]
  );

  const getItemQuantity = useCallback(
    (eventId:string, id: string) => {
      const eventItems = getCartByEvent(eventId);

      const item = eventItems?.find((item) => item?.id === id);
      return item?.quantity || 0;
    },
    [eventCarts]
  );
  

  const getPackQuantity = useCallback(
    (eventId: string, productId: string, packId: string) => {
      const cart = getCartByEvent(eventId);

      // Find the element in the cart
      const item = cart?.find((item) => {
        return item.id === productId;
      })

      if (!item) return 0;

      const pack = item.packs.find((pack) => {
        return pack.id === packId;
      });

      return pack?.quantity || 0;
    },
    [eventCarts]
  );


  const increasePackCartQuantity = useCallback(
    (eventId: string, product: IProduct, pack: IProductPack) => {
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

      setEventCarts((currCarts) => {
        const cart = currCarts[eventId] || [];

        // Buscamos el producto en el carrito
        const itemFind = cart.find((item) => item.id === product.id);

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

            const currItemsCopy = cart.map((item: IProductPackCartItem) => {
              return item.id === product.id ? itemFind : item;
            });

            // return [...currItemsCopy];
            return {
              ...currCarts,
              [eventId]: [...currItemsCopy],
            };
          }

          // Si existe el pack en el producto
          // Aumentamos SOLO la cantidad al pack
          const currItemsv2 = cart.map((item) => {
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

          // return currItemsv2;
          return {
            ...currCarts,
            [eventId]: [...currItemsv2],
          };
        } else {
          // Si no existe el producto aún en el carrito, lo añadimos
          return {
            ...currCarts,
            [eventId]: [...cart, newPack],
          };
        }
      });
    },
    []
  );

  const increaseOnePackCartQuantity = (eventId:string, productId: string, packId: string) => {
    const eventItems = getCartByEvent(eventId);

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

    setEventCarts((currCarts) => {
      return {
        ...currCarts,
        [eventId]: [...newItems],
      };
    });


  };

  const decreaseOnePackCartQuantity = (eventId: string, productId: string, packId: string) => {
    const eventItems = getCartByEvent(eventId);

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

    
    setEventCarts((currCarts) => {
      return {
        ...currCarts,
        [eventId]: [...newItems],
      };
    })
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

  const removeFromCart = (eventId:string, productId: string, packId: string) => {
    setEventCarts((currCarts) => {
      const cart = currCarts[eventId] || [];

      const newCart = cart.map((item) => {
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
      return {
        ...currCarts,
        [eventId]: [...newCart.filter((item) => {
          return item.packs.length > 0;
        })],
      };
    });


    // setEventItems((items) => {
    //   if (!items) return [];

    //   const itemsReturned = items.map((item) => {
    //     if (item.id === productId) {
    //       return {
    //         ...item,
    //         packs: item.packs.filter((pack) => {
    //           return pack.id !== packId;
    //         }),
    //       };
    //     } else {
    //       return item;
    //     }
    //   });

    //   // Eliminar el producto si no tiene packs
    //   return itemsReturned.filter((item) => {
    //     return item.packs.length > 0;
    //   });
    // });
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const getCartQuantity = (eventId: string) => {
    let quantity = 0;
    if (eventCarts[eventId].length === 0) return quantity;
    eventCarts[eventId].map((item) => {
      quantity += item.packs.reduce((acc, pack) => acc + pack.quantity, 0);
    });

    return quantity;
  };

  const value = useMemo(() => {
    return {
      eventCarts,
      clearCart,
      isInCart,
      getItemQuantity,
      getPackQuantity,
      removeFromCart,
      openCart,
      closeCart,
      getCartQuantity,
      isOpen,
      increasePackCartQuantity,
      increaseOnePackCartQuantity,
      decreaseOnePackCartQuantity,
      existEventCart,
      createNewCart,
    };
  }, [
    eventCarts,
    clearCart,
    isInCart,
    getItemQuantity,
    getPackQuantity,
    removeFromCart,
    openCart,
    closeCart,
    getCartQuantity,
    isOpen,
    increasePackCartQuantity,
    increaseOnePackCartQuantity,
    decreaseOnePackCartQuantity,
    existEventCart,
    createNewCart,
  ]);

  return (
    <EventCartContext.Provider value={value}>
      {children}
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
