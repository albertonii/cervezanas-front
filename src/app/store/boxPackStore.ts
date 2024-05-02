'use client';
import { create } from 'zustand';
import { IBoxPackItem } from '../../lib/types/product';

interface BoxCartType {
    id: string;
    slots_per_box: number;
    boxPackItems: IBoxPackItem[];
    p_principal: any;
    p_back: any;
    p_extra_1: any;
    p_extra_2: any;
    p_extra_3: any;
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
}

const useBoxPackStore = create<BoxCartState>((set, get) => {
    let initialState = {
        boxPack: {
            id: '',
            slots_per_box: 6,
            boxPackItems: [],
            p_principal: null,
            p_back: null,
            p_extra_1: null,
            p_extra_2: null,
            p_extra_3: null,
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
                    const newProduct = {
                        product_id: boxPackItem.product_id,
                        quantity: boxPackItem.quantity,
                        slots_per_product: boxPackItem.slots_per_product,
                        product: boxPackItem.product,
                    };

                    boxPack.boxPackItems.push({
                        ...newProduct,
                    });
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

                    return { boxPack };
                }

                return { boxPack };
            });
        },

        onChangeSlotsPerBox: (slotsPerBox: number) => {
            set((state) => {
                const { boxPack } = state;

                boxPack.slots_per_box = slotsPerBox;

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

                return { boxPack };
            });
        },

        clear: () => {
            set(() => {
                return {
                    boxPack: {
                        id: '',
                        slots_per_box: 0,
                        boxPackItems: [],
                        p_principal: null,
                        p_back: null,
                        p_extra_1: null,
                        p_extra_2: null,
                        p_extra_3: null,
                    },
                };
            });
        },
    };
});

export default useBoxPackStore;
