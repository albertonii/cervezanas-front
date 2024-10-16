'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ShoppingCart } from '../[locale]/components/cart/ShoppingCart';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import {
    IProductPackCartItem,
    IProduct,
    IProductPack,
    IDistributionContract,
    IAddress,
} from '@/lib//types/types';
import {
    calculateCheapestShippingCostsByDistributor,
    getListAsociatedDistributors,
    getShippingInfo,
} from '../[locale]/(common-display)/cart/actions';

interface IAddressWithPrev extends IAddress {
    prevDefaultAddressId?: string;
}

type ShoppingCartContextType = {
    items: IProductPackCartItem[];
    undeliverableItems: IProductPackCartItem[];
    handleItems: (items: IProductPackCartItem[]) => void;
    handleUndeliverableItems: (items: IProductPackCartItem[]) => void;
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
    calculateShippingCostCartContext: (
        selectedShippingInfoId: string,
    ) => Promise<{
        [producerId: string]: {
            items: IProductPackCartItem[];
            shippingCost: number;
            distributor_id: string;
        };
    }>;
    selectedShippingAddress: IAddress | undefined;
    defaultShippingAddress: IAddressWithPrev | undefined;
    selectedBillingAddress: IAddress | undefined;
    defaultBillingAddress: IAddressWithPrev | undefined;
    isShippingAddressSelected: (addressId: string) => boolean;
    isBillingAddressSelected: (addressId: string) => boolean;
    updateSelectedShippingAddress: (addressId: IAddress) => void;
    updateDefaultShippingAddress: (address: IAddress) => void;
    updateSelectedBillingAddress: (addressId: IAddress) => void;
    updateDefaultBillingAddress: (address: IAddress) => void;
    canMakeThePayment: boolean;
    updateCanMakeThePayment: (canMakeThePayment: boolean) => void;
    needsToCheckDelivery: boolean;
    updateNeedsToCheckDelivery: (value: boolean) => void;
};

const ShoppingCartContext = createContext<ShoppingCartContextType>({
    items: [],
    undeliverableItems: [],
    handleItems: () => void {},
    handleUndeliverableItems: () => void {},
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
    calculateShippingCostCartContext: () =>
        Promise.resolve(
            {} as {
                [producerId: string]: {
                    items: IProductPackCartItem[];
                    shippingCost: number;
                    distributor_id: string;
                };
            },
        ),
    selectedShippingAddress: {} as IAddress,
    defaultShippingAddress: {} as IAddressWithPrev,
    selectedBillingAddress: {} as IAddress,
    defaultBillingAddress: {} as IAddressWithPrev,
    updateSelectedShippingAddress: () => void {},
    updateDefaultShippingAddress: () => void {},
    updateSelectedBillingAddress: () => void {},
    updateDefaultBillingAddress: () => void {},
    isShippingAddressSelected: () => false,
    isBillingAddressSelected: () => false,
    canMakeThePayment: false,
    updateCanMakeThePayment: () => void {},
    needsToCheckDelivery: true,
    updateNeedsToCheckDelivery: () => void {},
});

interface Props {
    children: React.ReactNode;
}

export function ShoppingCartProvider({ children }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [items, setItems] = useLocalStorage<IProductPackCartItem[]>(
        'shopping-cart',
        [],
    );

    const [defaultShippingAddress, setDefaultShippingAddress] =
        useState<IAddress>();

    const [selectedShippingAddress, setSelectedShippingAddress] =
        useState<IAddress>();

    const [defaultBillingAddress, setDefaultBillingAddress] =
        useState<IAddress>();

    const [selectedBillingAddress, setSelectedBillingAddress] =
        useState<IAddress>();

    const [undeliverableItems, setUndeliverableItems] = useState<
        IProductPackCartItem[]
    >([]);

    const [canMakeThePayment, setCanMakeThePayment] = useState<boolean>(false);

    const [needsToCheckDelivery, setNeedsToCheckDelivery] =
        useState<boolean>(true);

    const clearItems = () => {
        setItems([]);
    };

    const clearCart = () => {
        clearItems();
    };

    const handleItems = (items_: IProductPackCartItem[]) => {
        setItems(items_);
    };

    const handleUndeliverableItems = (
        undeliverableItems_: IProductPackCartItem[],
    ) => {
        setUndeliverableItems(undeliverableItems_);
    };

    const calculateShippingCostCartContext = async (
        selectedShippingInfoId: string,
    ): Promise<{
        [producerId: string]: {
            items: IProductPackCartItem[];
            shippingCost: number;
            distributor_id: string;
        };
    }> => {
        // Vamos a crear un array de productores con los items que le corresponden y sus costes asociados
        let producerIdAndItemsWithCosts: {
            [producerId: string]: {
                items: IProductPackCartItem[];
                shippingCost: number | null;
                distributor_id: string | null;
            };
        } = {};

        if (!items || !selectedShippingInfoId) {
            return {} as {
                [producerId: string]: {
                    items: IProductPackCartItem[];
                    shippingCost: number;
                    distributor_id: string;
                };
            };
        }

        // Agrupar todos aquellos productos que tengan el mismo ID de productor
        const producerIdAndItems = items.reduce((acc: any, item) => {
            if (!acc[item.producer_id]) {
                acc[item.producer_id] = [];
            }

            acc[item.producer_id].push(item);

            return acc;
        }, {});

        // Obtener la información de envío seleccionada
        const selectedShippingInfo = await getShippingInfo(
            selectedShippingInfoId,
        );

        // Debido a que un productor puede tener varios distribuidores, obtenemos el listado de aquellos que pueden enviar los productos
        const distributorsContracts: IDistributionContract[] =
            await getListAsociatedDistributors(
                producerIdAndItems,
                selectedShippingInfo,
            );

        for (const producerId in producerIdAndItems) {
            const itemsProducer = producerIdAndItems[producerId];
            const distributorContractsByProducerId =
                distributorsContracts.filter(
                    (distributor) => distributor.producer_id === producerId,
                );

            const shippingCostInformation: {
                delivery_cost: number | null;
                distributor_id: string | null;
            } | null = await calculateCheapestShippingCostsByDistributor(
                itemsProducer,
                selectedShippingInfo,
                distributorContractsByProducerId,
            );

            // Update distributor_id in items
            const newItemsWithDistributorID = itemsProducer.map(
                (item: IProductPackCartItem) => {
                    return {
                        ...item,
                        distributor_id: shippingCostInformation
                            ? shippingCostInformation.distributor_id
                            : null,
                    };
                },
            );

            producerIdAndItemsWithCosts[producerId] = {
                items: newItemsWithDistributorID,
                shippingCost: shippingCostInformation
                    ? shippingCostInformation.delivery_cost
                    : null,
                distributor_id: shippingCostInformation
                    ? shippingCostInformation.distributor_id
                    : null,
            };
        }

        return producerIdAndItemsWithCosts as {
            [producerId: string]: {
                items: IProductPackCartItem[];
                shippingCost: number;
                distributor_id: string;
            };
        };
    };

    const assignDistributorIdToItems = async (itemsByProducer: {
        [producerId: string]: {
            items: IProductPackCartItem[];
            shippingCost: number;
            distributor_id: string;
        };
    }): Promise<{
        [producerId: string]: {
            items: IProductPackCartItem[];
            shippingCost: number;
            distributor_id: string;
        };
    }> => {
        const newElements = Object.values(itemsByProducer).map(
            (productPack) => {
                const updatedItems = productPack.items.map((item) => {
                    return {
                        ...item,
                        distributor_id: productPack.distributor_id,
                    };
                });

                return {
                    ...productPack,
                    items: updatedItems,
                };
            },
        );

        return newElements as unknown as {
            [producerId: string]: {
                items: IProductPackCartItem[];
                shippingCost: number;
                distributor_id: string;
            };
        };
    };

    const getItemQuantity = (id: string) => {
        const item = items?.find((item) => item?.product_id === id);
        return item?.quantity || 0;
    };

    const addPackToCart = (product: IProduct, pack: IProductPack) => {
        const newPack: IProductPackCartItem = {
            id: pack.id,
            product_id: product.id,
            quantity: pack.quantity,
            packs: [pack],
            name: product.name,
            price: product.price,
            image: product.product_multimedia?.p_principal ?? '',
            producer_id: product.owner_id,
            distributor_id: '',
            products: product,
        };

        setItems((currItems) => {
            // Buscamos el producto en el carrito
            const itemFind = currItems.find(
                (item) => item.product_id === product.id,
            );

            if (itemFind) {
                // Si existe el producto, buscamos el pack
                const packFind = itemFind.packs.find((p) => {
                    return p.product_id === pack.product_id;
                });

                // Si no existe el pack pero si el producto, lo añadimos
                if (!packFind) {
                    // Añadimos el pack al listado de packs del producto
                    itemFind.packs.push(pack);

                    // Reemplazar el producto en el listado de productos
                    const currItemsCopy = currItems.map(
                        (item: IProductPackCartItem) => {
                            return item.product_id === product.id
                                ? itemFind
                                : item;
                        },
                    );

                    return [...currItemsCopy];
                }

                // Si existe el pack en el producto
                // Aumentamos SOLO la cantidad al pack
                const currItemsv2 = currItems.map((item) => {
                    return item.product_id === product.id
                        ? {
                              ...item,
                              quantity: item.quantity + pack.quantity,
                              // Aumentar la cantidad del pack en el producto correspondiente
                              packs: item.packs.map((p) => {
                                  return p.id === pack.id
                                      ? {
                                            ...p,
                                            quantity:
                                                p.quantity + pack.quantity,
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
            if (item.product_id === productId) {
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
        updateNeedsToCheckDelivery(true);
    };

    const decreaseOnePackCartQuantity = (productId: string, packId: string) => {
        const newItems = items.map((item) => {
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

        setItems(newItems);
        updateNeedsToCheckDelivery(true);
    };

    const removeFromCart = (productId: string, packId: string) => {
        setItems((items) => {
            if (!items) return [];

            const itemsReturned = items.map((item) => {
                if (item.product_id === productId) {
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

        updateNeedsToCheckDelivery(true);
    };

    // Update one item in the cart by identifier
    const updateCartItem = (newItem: IProductPackCartItem) => {
        setItems((items) => {
            if (!items) return [];

            const itemsReturned = items.map((item) => {
                if (item.product_id === newItem.product_id) {
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
        items.forEach((item) => {
            quantity += item.packs.reduce(
                (acc, pack) => acc + pack.quantity,
                0,
            );
        });

        return quantity;
    };

    const updateSelectedShippingAddress = (address: IAddress) => {
        updateCanMakeThePayment(false);
        setSelectedShippingAddress(address);
    };

    const updateDefaultShippingAddress = (address: IAddress) => {
        const addressWithPrev: IAddressWithPrev = {
            ...address,
            prevDefaultAddressId: defaultShippingAddress?.id
                ? defaultShippingAddress?.id
                : address.id,
        };

        setDefaultShippingAddress(addressWithPrev);
    };

    const isShippingAddressSelected = (addressId: string): boolean => {
        return selectedShippingAddress?.id === addressId;
    };

    const updateSelectedBillingAddress = (address: IAddress) => {
        setSelectedBillingAddress(address);
    };

    const updateDefaultBillingAddress = (address: IAddress) => {
        const addressWithPrev: IAddressWithPrev = {
            ...address,
            prevDefaultAddressId: defaultBillingAddress?.id
                ? defaultBillingAddress?.id
                : address.id,
        };

        setDefaultBillingAddress(addressWithPrev);
    };

    const isBillingAddressSelected = (addressId: string): boolean => {
        return selectedBillingAddress?.id === addressId;
    };

    const updateCanMakeThePayment = (canMakeThePayment: boolean) => {
        setCanMakeThePayment(canMakeThePayment);
    };

    const updateNeedsToCheckDelivery = (value: boolean) => {
        setNeedsToCheckDelivery(value);
    };

    const value = {
        items,
        undeliverableItems,
        isOpen,
        handleItems,
        handleUndeliverableItems,
        clearItems,
        clearCart,
        getItemQuantity,
        removeFromCart,
        openCart,
        closeCart,
        cartQuantity,
        addPackToCart,
        increaseOnePackCartQuantity,
        decreaseOnePackCartQuantity,
        updateCartItem,
        calculateShippingCostCartContext,
        selectedShippingAddress,
        defaultShippingAddress,
        updateSelectedShippingAddress,
        updateDefaultShippingAddress,
        selectedBillingAddress,
        defaultBillingAddress,
        isShippingAddressSelected,
        updateSelectedBillingAddress,
        updateDefaultBillingAddress,
        isBillingAddressSelected,
        canMakeThePayment,
        updateCanMakeThePayment,
        needsToCheckDelivery,
        updateNeedsToCheckDelivery,
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
            'useShoppingCart must be used within a ShoppingCartProvider',
        );
    }

    return context;
}
