'use client';

import PackItem from './PackItem';
import MarketCartButtons2 from '@/app/[locale]/components/common/MarketCartButtons2';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { IProduct, IProductPack } from '@/lib//types/types';
import { useShoppingCart } from '@/app/context/ShoppingCartContext';
import { AddCardButton } from '@/app/[locale]/components/common/AddCartButton';

interface Props {
    product: IProduct;
}

export default function Packs({ product }: Props) {
    const t = useTranslations();

    const { addPackToCart } = useShoppingCart();

    const [packQuantity, setPackQuantity] = useState(1);
    const [isPackSelected, setIsPackSelected] = useState(true);

    const [selectedPack, setSelectedPack] = useState<IProductPack>();

    const handleItemSelected = (item: IProductPack) => {
        setSelectedPack(item);
    };

    const handleIncreasePackQuantity = () => {
        setPackQuantity(packQuantity + 1);
    };

    const handleDecreasePackQuantity = () => {
        if (packQuantity > 1) setPackQuantity(packQuantity - 1);
    };

    const handleAddToCart = () => {
        if (!selectedPack) {
            setIsPackSelected(false);
            return;
        }

        setIsPackSelected(true);

        const packCartItem: IProductPack = {
            id: selectedPack.id,
            product_id: selectedPack.product_id,
            created_at: selectedPack.created_at,
            quantity: packQuantity,
            price: selectedPack.price,
            name: selectedPack.name,
            img_url: selectedPack.img_url,
            randomUUID: selectedPack.randomUUID,
            products: selectedPack.products,
        };

        addPackToCart(product, packCartItem);

        setPackQuantity(1);
    };

    return (
        <>
            {product && product.product_packs && (
                <div className="mt-10">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                            {t('product_packs')}
                        </h4>
                    </div>

                    <fieldset className="mt-4">
                        <legend className="sr-only">{t('choose_pack')}</legend>
                        <ul className="grid grid-cols-1 gap-2 rounded border bg-cerv-coffee p-2 sm:grid-cols-4 md:grid-cols-5 2xl:grid-cols-6">
                            {product.product_packs
                                .slice() // Copy the array to avoid mutating the original
                                .sort((a, b) => a.quantity - b.quantity) // Sort by quantity
                                .map((productPack) => (
                                    <div key={productPack.id}>
                                        <PackItem
                                            pack={productPack}
                                            handleItemSelected={
                                                handleItemSelected
                                            }
                                            selectedPackId={
                                                selectedPack?.id ?? ''
                                            }
                                        />
                                    </div>
                                ))}
                        </ul>

                        {/* Warning message if pack is not selected  */}
                        {!isPackSelected && (
                            <div className="text-md mt-4 flex flex-1 items-center justify-start text-red-500">
                                {t('select_pack')}
                            </div>
                        )}

                        <div className="mt-6 flex space-x-2 bg-white max-w-[200px] p-3 shadow-sm">
                            <MarketCartButtons2
                                item={product.product_packs[0]}
                                quantity={packQuantity}
                                handleIncreaseCartQuantity={() =>
                                    handleIncreasePackQuantity()
                                }
                                handleDecreaseCartQuantity={() =>
                                    handleDecreasePackQuantity()
                                }
                                handleRemoveFromCart={() => void 0}
                                displayDeleteButton={false}
                            />

                            <AddCardButton
                                withText={true}
                                onClick={() => handleAddToCart()}
                            />
                        </div>
                    </fieldset>
                </div>
            )}
        </>
    );
}
