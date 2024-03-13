'use client';

import { create } from 'zustand';
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
  addPackToCart: (
    eventId: string,
    product: IEventProduct,
    pack: IProductPack,
  ) => void;
  increaseOnePackCartQuantity: (
    eventId: string,
    productId: string,
    cpId: string,
    packId: string,
  ) => void;
  decreaseOnePackCartQuantity: (
    eventId: string,
    productId: string,
    cpId: string,
    packId: string,
  ) => void;
  removeFromCart: (
    eventId: string,
    productId: string,
    cpId: string,
    packId: string,
  ) => void;
  getCartQuantity: (eventId: string) => number;
  getPackQuantity: (
    eventId: string,
    productId: string,
    cpId: string,
    packId: string,
  ) => number;
  existEventCart: (eventId: string) => boolean;
  createNewCart: (eventId: string) => void;
  clearCart: (eventId: string) => void;
  saveState: () => void;
  setEventCarts: (eventCarts: EventCartsType) => void;
}

const STORAGE_KEY = 'event-carts';

const useEventCartStore = create<EventCartState>((set, get) => {
  let initialState = {
    eventCarts: {}, // Estado inicial
    isOpen: false,
    // ... otras propiedades iniciales
  };

  if (typeof window !== 'undefined') {
    // Acceder a localStorage solo si está en el lado del cliente
    const savedState = localStorage.getItem('event-carts');
    if (savedState) {
      initialState = JSON.parse(savedState);
    }
  }

  return {
    ...initialState,
    addPackToCart: (
      eventId: string,
      product: IEventProduct,
      pack: IProductPack,
    ) => {
      set((state) => {
        const cart = state.eventCarts[eventId] || [];
        const productFind = cart.find(
          (item) =>
            item.product_id === product.id && product.cpm_id === item.cpm_id,
        );

        if (productFind) {
          const packFind = productFind.packs.find((p) => p.id === pack.id);

          if (!packFind) {
            productFind.packs.push(pack);
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
          cart.push(newPack);
        }

        return { eventCarts: { ...state.eventCarts, [eventId]: cart } };
      });

      // Estado actualizado, ahora guardamos el estado
      get().saveState();
    },
    increaseOnePackCartQuantity: (eventId, productId, cpId, packId) => {
      set((state) => {
        const eventItems = state.eventCarts[eventId] || [];

        const newItems = eventItems.map((item) => {
          if (
            (item.product_id === productId && item.cpf_id === cpId) ||
            (item.product_id === productId && item.cpm_id === cpId)
          ) {
            const newPacks = item.packs.map((pack) => {
              if (pack.id === packId) {
                return { ...pack, quantity: pack.quantity + 1 };
              }

              return pack;
            });

            return { ...item, packs: newPacks };
          }
          return item;
        });

        return { eventCarts: { ...state.eventCarts, [eventId]: newItems } };
      });

      // Estado actualizado, ahora guardamos el estado
      get().saveState();
    },
    decreaseOnePackCartQuantity: (eventId, productId, cpId, packId) => {
      set((state) => {
        const eventItems = state.eventCarts[eventId] || [];

        const newItems = eventItems.map((item) => {
          if (
            (item.product_id === productId && item.cpf_id === cpId) ||
            (item.product_id === productId && item.cpm_id === cpId)
          ) {
            const newPacks = item.packs.map((pack) => {
              if (pack.id === packId && pack.quantity > 1) {
                return { ...pack, quantity: pack.quantity - 1 };
              }
              return pack;
            });

            return { ...item, packs: newPacks };
          }
          return item;
        });

        return {
          ...state,
          eventCarts: { ...state.eventCarts, [eventId]: newItems },
        };
      });

      // Estado actualizado, ahora guardamos el estado
      get().saveState();
    },
    removeFromCart: (eventId, productId, cpId, packId) => {
      set((state) => {
        const eventItems = state.eventCarts[eventId] || [];
        const newItems = eventItems.map((item) => {
          if (
            (item.product_id === productId && item.cpf_id === cpId) ||
            (item.product_id === productId && item.cpm_id === cpId)
          ) {
            const newPacks = item.packs.filter((pack) => pack.id !== packId);

            return { ...item, packs: newPacks };
          }
          return item;
        });

        // Si no hay packs en el producto, elimina el producto del carrito
        const newItemsv2 = newItems.filter((item) => item.packs.length > 0);

        return {
          ...state,
          eventCarts: { ...state.eventCarts, [eventId]: newItemsv2 },
        };
      });

      // Estado actualizado, ahora guardamos el estado
      get().saveState();
    },
    getCartQuantity: (eventId) => {
      const eventItems = get().eventCarts[eventId] || [];
      let quantity = 0;
      eventItems.forEach((item) => {
        quantity += item.packs.reduce((acc, pack) => acc + pack.quantity, 0);
      });
      return quantity;
    },
    getPackQuantity: (eventId, productId, cpId, packId) => {
      const eventItems = get().eventCarts[eventId] || [];

      const product = eventItems.find(
        (item) =>
          (item.product_id === productId && item.cpm_id === cpId) ||
          (item.product_id === productId && item.cpf_id === cpId),
      );

      if (product) {
        const pack = product.packs.find((p: IProductPack) => p.id === packId);
        return pack ? pack.quantity : 0;
      }

      return 0;
    },
    existEventCart: (eventId) => {
      return !!get().eventCarts[eventId];
    },
    createNewCart: (eventId) => {
      set((state) => {
        return { eventCarts: { ...state.eventCarts, [eventId]: [] } };
      });

      // Estado actualizado, ahora guardamos el estado
      get().saveState();
    },
    clearCart: (eventId) => {
      set((state) => {
        return {
          ...state,
          eventCarts: { ...state.eventCarts, [eventId]: [] },
        };
      });

      // Estado actualizado, ahora guardamos el estado
      get().saveState();
    },
    saveState: () => {
      const state = get();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },
    setEventCarts: (eventCarts) => {
      set((state) => {
        return { ...state, eventCarts };
      });
    },
  };
});

export default useEventCartStore;
