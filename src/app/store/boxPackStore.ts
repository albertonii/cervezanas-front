'use client';
import { create } from 'zustand';
import { IBoxPack, IBoxPackItem } from '@/lib/types/product';

interface BoxCartType {
    id: string;
    slots_per_box: number;
    boxPackItems: IBoxPackItem[];
    is_box_pack_dirty: boolean;
}

interface BoxCartState {
    boxPack: BoxCartType;
    addSlot: (product: IBoxPackItem) => void;
    increaseOneSlotQuantity: (productId: string) => void;
    decreaseOneSlotQuantity: (productId: string) => void;
    removeProductSlot: (productId: string) => void;
    clear: () => void;
    onChangeQuantityProduct: (
        productId: string,
        slotsPerProduct: number,
    ) => void;
    onChangeSlotsPerProduct: (
        productId: string,
        slotsPerProduct: number,
    ) => void;
    onChangeSlotsPerBox: (slotsPerBox: number) => void;
    assignBoxPack: (boxPack: IBoxPack) => void;
}

const useBoxPackStore = create<BoxCartState>((set, get) => {
    let initialState = {
        boxPack: {
            id: '',
            slots_per_box: 6,
            boxPackItems: [],
            is_box_pack_dirty: false,
        },
    };

    return {
        ...initialState,
        addSlot: (boxPackItem: IBoxPackItem) => {
            set((state) => {
                const { boxPack } = state;

                // To avoid duplicate products
                if (
                    boxPack.boxPackItems.find(
                        (item) => item.product_id === boxPackItem.product_id,
                    )
                ) {
                    return { boxPack };
                }

                const productFind = boxPack.boxPackItems?.find(
                    (item) => item.id === boxPackItem.product_id,
                );

                if (!productFind) {
                    const newProduct: IBoxPackItem = {
                        product_id: boxPackItem.product_id,
                        quantity: boxPackItem.quantity,
                        slots_per_product: boxPackItem.slots_per_product,
                        products: boxPackItem.products,
                    };

                    const newBoxPack: BoxCartType = {
                        ...boxPack,
                        boxPackItems: [...boxPack.boxPackItems, newProduct],
                        is_box_pack_dirty: true,
                    };

                    return { boxPack: newBoxPack };
                }

                return { boxPack };
            });
        },

        onChangeSlotsPerProduct: (
            productId: string,
            slotsPerProduct: number,
        ) => {
            set((state) => {
                const { boxPack } = state;

                const productFind = boxPack.boxPackItems.find(
                    (item) => item.product_id === productId,
                );

                if (productFind) {
                    productFind.slots_per_product = slotsPerProduct;

                    const newBoxPackItems = boxPack.boxPackItems.map((item) => {
                        if (item.product_id === productFind.id) {
                            return productFind;
                        }
                        return item;
                    });

                    boxPack.boxPackItems = newBoxPackItems;
                    boxPack.is_box_pack_dirty = true;

                    return { boxPack };
                }

                return { boxPack };
            });
        },

        onChangeQuantityProduct: (productId: string, quantity: number) => {
            set((state) => {
                const { boxPack } = state;

                const productFind = boxPack.boxPackItems.find(
                    (item) => item.product_id === productId,
                );

                if (productFind) {
                    productFind.quantity = quantity;

                    const newBoxPackItems = boxPack.boxPackItems.map((item) => {
                        if (item.product_id === productFind.id) {
                            return productFind;
                        }
                        return item;
                    });

                    boxPack.boxPackItems = newBoxPackItems;
                    boxPack.is_box_pack_dirty = true;

                    return { boxPack };
                }

                return { boxPack };
            });
        },

        onChangeSlotsPerBox: (slotsPerBox: number) => {
            set((state) => {
                const { boxPack } = state;

                boxPack.slots_per_box = slotsPerBox;
                boxPack.is_box_pack_dirty = true;

                return { boxPack };
            });
        },

        increaseOneSlotQuantity: (productId) => {
            set((state) => {
                const { boxPack } = state;

                const productFind = boxPack.boxPackItems.find(
                    (item) => item.product_id === productId,
                );

                if (productFind) {
                    productFind.slots_per_product += 1;

                    boxPack.boxPackItems = boxPack.boxPackItems.map((item) => {
                        if (item.product_id === productFind.id) {
                            return productFind;
                        }
                        return item;
                    });

                    boxPack.is_box_pack_dirty = true;

                    return { boxPack };
                }

                return { boxPack };
            });
        },

        decreaseOneSlotQuantity: (productId) => {
            set((state) => {
                const { boxPack } = state;

                const productFind = boxPack.boxPackItems.find(
                    (item) => item.product_id === productId,
                );

                if (productFind && productFind.quantity > 1) {
                    productFind.slots_per_product -= 1;

                    boxPack.boxPackItems = boxPack.boxPackItems.map((item) => {
                        if (item.product_id === productFind.id) {
                            return productFind;
                        }
                        return item;
                    });

                    boxPack.is_box_pack_dirty = true;

                    return { boxPack };
                } else {
                    return { boxPack };
                }
            });
        },

        removeProductSlot: (productId) => {
            set((state) => {
                const { boxPack } = state;

                // Remove product from boxPackItems
                const newBoxPackItems = boxPack.boxPackItems.filter(
                    (item) => item.product_id !== productId,
                );

                boxPack.boxPackItems = newBoxPackItems;
                boxPack.is_box_pack_dirty = true;

                return { boxPack };
            });
        },

        clear: () => {
            set(() => {
                return {
                    boxPack: {
                        id: '',
                        slots_per_box: 6,
                        boxPackItems: [],
                        is_box_pack_dirty: false,
                    },
                };
            });
        },

        // Assgin new box pack
        assignBoxPack: (boxPack: IBoxPack) => {
            set(() => {
                return {
                    boxPack: {
                        id: boxPack.id,
                        slots_per_box: boxPack.slots_per_box,
                        boxPackItems: boxPack.box_pack_items ?? [],
                        is_box_pack_dirty: false,
                    },
                };
            });
        },
    };
});

export default useBoxPackStore;
