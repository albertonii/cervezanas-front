'use client';

import { create } from 'zustand';
import { IBoxPackItem } from '../../lib/types/product';

interface BoxCartType {
    id: string;
    slots: number;
    boxPackItems: IBoxPackItem[];
}

interface BoxCartState {
    boxPack: BoxCartType;
    addSlot: (product: IBoxPackItem) => void;
    increaseOneSlotQuantity: (productId: string) => void;
    decreaseOneSlotQuantity: (productId: string) => void;
    removeProductSlot: (productId: string) => void;
    clear: () => void;
}

const useBoxPackStore = create<BoxCartState>((set, get) => {
    let initialState = {
        boxPack: {
            slots: 0,
            id: '',
            boxPackItems: [],
        }, // Estado inicial
    };

    return {
        ...initialState,
        addSlot: (product: IBoxPackItem) => {
            set((state) => {
                const { boxPack } = state;

                const productFind = boxPack.boxPackItems?.find(
                    (item) => item.id === product.id,
                );

                if (productFind) {
                    productFind.quantity += 1;

                    boxPack.boxPackItems = boxPack.boxPackItems.map((item) => {
                        if (item.id === productFind.id) {
                            return productFind;
                        }
                        return item;
                    });
                } else {
                    const newProduct = {
                        id: product.id,
                        product_id: product.product_id,
                        quantity: 1,
                        slots_per_product: product.slots_per_product,
                        product: product.product,
                        box_pack_id: boxPack.id,
                    };

                    boxPack.boxPackItems.push({
                        ...newProduct,
                    });
                }

                return { boxPack };
            });
        },

        increaseOneSlotQuantity: (productId) => {
            set((state) => {
                const { boxPack } = state;

                const productFind = boxPack.boxPackItems.find(
                    (item) => item.id === productId,
                );

                if (productFind) {
                    productFind.quantity += 1;

                    boxPack.boxPackItems = boxPack.boxPackItems.map((item) => {
                        if (item.id === productFind.id) {
                            return productFind;
                        }
                        return item;
                    });

                    return { boxPack };
                }

                return { boxPack };
            });
        },
        decreaseOneSlotQuantity: (productId) => {
            set((state) => {
                const { boxPack } = state;

                const productFind = boxPack.boxPackItems.find(
                    (item) => item.id === productId,
                );

                if (productFind && productFind.quantity > 1) {
                    productFind.quantity -= 1;

                    boxPack.boxPackItems = boxPack.boxPackItems.map((item) => {
                        if (item.id === productFind.id) {
                            return productFind;
                        }
                        return item;
                    });

                    return { boxPack };
                } else {
                    return { boxPack };
                }
            });
        },
        removeProductSlot: (productId) => {
            set((state) => {
                const { boxPack } = state;

                const newBoxPackItems = boxPack.boxPackItems.filter(
                    (item) => item.id !== productId,
                );

                boxPack.boxPackItems = newBoxPackItems;

                return { boxPack };
            });
        },

        clear: () => {
            set((state) => {
                return {
                    ...state,
                };
            });
        },
    };
});

export default useBoxPackStore;
