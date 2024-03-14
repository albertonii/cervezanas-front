'use client';

import { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import {
    IEventProduct,
    IProductPack,
    IProductPackEventCartItem,
} from '../../lib/types/types';

interface EventCartsType {
    [eventId: string]: IProductPackEventCartItem[];
}

interface EventCartState {
    eventCarts: EventCartsType;
    isOpen: boolean;
}

type EventCartContextType = {
    eventCarts: EventCartsType;
    getCartQuantity: (eventId: string) => number;
    clearCart: (eventId: string) => void;
    getItemQuantity: (eventId: string, id: string) => number;
    getPackQuantity: (
        eventId: string,
        productId: string,
        cpId: string,
        id: string,
    ) => number;
    addPackToCart(
        eventId: string,
        product: IEventProduct,
        pack: IProductPack,
    ): void;
    increaseOnePackCartQuantity: (
        eventId: string,
        productId: string,
        packId: string,
    ) => void;
    decreaseOnePackCartQuantity: (
        eventId: string,
        productId: string,
        packId: string,
    ) => void;
    removeFromCart: (
        eventId: string,
        productId: string,
        packId: string,
    ) => void;
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
    getItemQuantity: () => 0,
    getPackQuantity: () => 0,
    removeFromCart: () => void {},
    increaseOnePackCartQuantity: () => void {},
    addPackToCart: () => void {},
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

    const [eventCarts, setEventCarts] = useLocalStorage<EventCartState>(
        'event-carts',
        {
            eventCarts: {},
            isOpen: false,
        },
    );

    const getCartByEvent = (eventId: string) => {
        return eventCarts.eventCarts[eventId] || [];
    };

    const createNewCart = (eventId: string) => {
        setEventCarts((currCarts) => {
            return {
                ...currCarts,
                [eventId]: [],
            };
        });
    };

    const existEventCart = (eventId: string) => {
        return !!eventCarts.eventCarts[eventId];
    };

    const clearCart = (eventId: string) => {
        setEventCarts((currCarts) => {
            return {
                ...currCarts,
                [eventId]: [],
            };
        });
    };

    const getItemQuantity = (eventId: string, id: string) => {
        const eventItems = getCartByEvent(eventId);

        const item = eventItems?.find((item) => item?.product_id === id);
        return item?.quantity || 0;
    };

    const getPackQuantity = (
        eventId: string,
        productId: string,
        cpId: string,
        packId: string,
    ) => {
        const cart = getCartByEvent(eventId);

        // Find the element in the cart
        const cartItemFind = cart.find((item) => {
            const isSameId = item.product_id === productId;
            const isSameCPMid = cpId === item.cpm_id;
            const isSameCPFid = cpId === item.cpf_id;

            return (isSameId && isSameCPMid) || (isSameId && isSameCPFid);
        });

        // const item = cart?.find((item) => {
        //   return item.product_id === productId;
        // });

        if (!cartItemFind) return 0;

        const pack = cartItemFind.packs.find((pack) => {
            return pack.id === packId;
        });

        return pack?.quantity || 0;
    };

    const addPackToCart = (
        eventId: string,
        product: IEventProduct,
        pack: IProductPack,
    ) => {
        const cart = eventCarts.eventCarts[eventId];

        // Buscamos el producto en el carrito
        const productFind = cart.find((item) => {
            const isSameId = item.product_id === product.id;
            const isSameCPMid = product.cpm_id === item.cpm_id;

            return isSameId && isSameCPMid;
        });

        // console.log("¿Producto encontrado? ", productFind);

        if (productFind) {
            const packFind = productFind.packs.find((p) => {
                return p.id === pack.id;
            });

            if (packFind) {
                setEventCarts((currCarts) => {
                    return {
                        ...currCarts,
                        [eventId]: [...cart],
                    };
                });
            } else {
                productFind.packs.push(pack);

                const currItemsCopy = cart.map((item) => {
                    return item.product_id === product.id ? productFind : item;
                });

                setEventCarts((currCarts) => {
                    return {
                        ...currCarts,
                        [eventId]: [...currItemsCopy],
                    };
                });
            }
        } else {
            const newPack: IProductPackEventCartItem = {
                id: pack.id,
                product_id: product.id,
                quantity: 1,
                packs: [pack],
                name: product.name,
                price: product.price,
                image: product.product_multimedia?.p_principal ?? '',
                producer_id: product.owner_id,
                cpm_id: product.cpm_id,
                cpf_id: product.cpf_id,
                cp_name: product.cp_name,
            };

            setEventCarts((currCarts) => {
                return {
                    ...currCarts,
                    [eventId]: [...cart, newPack],
                };
            });
        }

        // setEventCarts((currCarts) => {
        // if (productFind) {
        //   console.log(" existe el producto");
        //   // Si existe el producto dentro del carrito, buscamos el pack
        //   const packFind = productFind.packs.find((p) => {
        //     const isSameId = p.id === pack.product_id;
        //     const isSameCPMid = product.cpm_id === productFind.cpm_id;
        //     const isSameCPFid = product.cpf_id === productFind.cpf_id;

        //     return (isSameId && isSameCPMid) || (isSameId && isSameCPFid);
        //   });

        //   // Si no existe el pack pero si el producto, lo añadimos
        //   if (packFind === undefined) {
        //     // Añadimos el pack al listado de packs del producto
        //     productFind.packs.push(pack);

        //     // Reemplazar el producto en el listado de productos
        //     const currItemsCopy = cart.map((item) => {
        //       return item.product_id === product.id ? productFind : item;
        //     });

        //     return {
        //       ...currCarts,
        //       [eventId]: [...currItemsCopy],
        //     };
        //   } else {
        //     return {
        //       ...currCarts,
        //       [eventId]: [...cart],
        //     };
        //   }
        // } else {
        //   console.log("no existe el producto");
        //   console.log(currCarts);
        //   const newPack: IProductPackEventCartItem = {
        //     id: product.id,
        //     quantity: 1,
        //     packs: [pack],
        //     name: product.name,
        //     price: product.price,
        //     image: product.product_multimedia.p_principal,
        //     producer_id: product.owner_id,
        //     cpm_id: product.cpm_id,
        //     cpf_id: product.cpf_id,
        //     cp_name: product.cp_name,
        //   };

        //   // Si no existe el producto aún en el carrito, lo añadimos
        //   return {
        //     ...currCarts,
        //     [eventId]: [...cart, newPack],
        //   };
        // }
        // });
    };

    const increaseOnePackCartQuantity = (
        eventId: string,
        productId: string,
        packId: string,
    ) => {
        const eventItems = getCartByEvent(eventId);

        const newItems = eventItems.map((item) => {
            if (item && productId && item.product_id === productId) {
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

    const decreaseOnePackCartQuantity = (
        eventId: string,
        productId: string,
        packId: string,
    ) => {
        const eventItems = getCartByEvent(eventId);

        const newItems = eventItems.map((item) => {
            if (item.product_id === productId) {
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
        });
    };

    // const decreaseCartQuantity = useCallback((id: string) => {
    //   setEventItems((currItems) => {
    //     if (currItems.find((item) => item.product_id === id)?.quantity === 1) {
    //       return currItems.filter((item) => item.product_id !== id);
    //     } else {
    //       return currItems.map((item) => {
    //         if (item.product_id === id) {
    //           return { ...item, quantity: item.quantity - 1 };
    //         } else {
    //           return item;
    //         }
    //       });
    //     }
    //   });
    // }, []);

    // const removeFromCart = (id: string) => {
    //   setEventItems((items) => items.filter((item) => item.product_id !== id));
    // };

    const removeFromCart = (
        eventId: string,
        productId: string,
        packId: string,
    ) => {
        const eventItems = getCartByEvent(eventId);

        const newItems = eventItems.map((item) => {
            if (item.product_id === productId) {
                // Delete the pack from the product
                const newPacks = item.packs.filter(
                    (pack) => pack.id !== packId,
                );

                return {
                    ...item,
                    packs: newPacks,
                };
            } else {
                return item;
            }
        });

        // If not packs in the product, delete the product from the cart
        const newItemsv2 = newItems.filter((item) => item.packs.length > 0);

        setEventCarts((currCarts) => {
            return {
                ...currCarts,
                [eventId]: [...newItemsv2],
            };
        });
    };

    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);

    const getCartQuantity = (eventId: string) => {
        let quantity = 0;
        if (eventCarts.eventCarts[eventId].length === 0) return quantity;
        eventCarts.eventCarts[eventId].map((item) => {
            quantity += item.packs.reduce(
                (acc, pack) => acc + pack.quantity,
                0,
            );
        });

        return quantity;
    };

    const value = {
        eventCarts: eventCarts.eventCarts,
        clearCart,
        getItemQuantity,
        getPackQuantity,
        removeFromCart,
        openCart,
        closeCart,
        getCartQuantity,
        isOpen,
        addPackToCart,
        increaseOnePackCartQuantity,
        decreaseOnePackCartQuantity,
        existEventCart,
        createNewCart,
    };

    return (
        <EventCartContext.Provider value={value}>
            {children}
        </EventCartContext.Provider>
    );
}

export function useEventCart() {
    const context = useContext(EventCartContext);
    if (context === undefined) {
        throw new Error('useEventCart must be used within a EventCartProvider');
    }

    return context;
}
