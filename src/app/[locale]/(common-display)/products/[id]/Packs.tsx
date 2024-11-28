'use client';

import PackItem from './PackItem';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { IProduct, IProductPack } from '@/lib//types/types';
import { useShoppingCart } from '@/app/context/ShoppingCartContext';
import { formatCurrency } from '@/utils/formatCurrency';
import { AddCartButton } from '@/app/[locale]/components/cart/AddCartButton';
import MarketCartButtons2 from '@/app/[locale]/components/cart/MarketCartButtons2';

interface Props {
    product: IProduct;
}

export default function Packs({ product }: Props) {
    const { product_packs } = product;

    if (!product_packs) return null;

    const t = useTranslations();

    const { addPackToCart } = useShoppingCart();

    const [packQuantity, setPackQuantity] = useState(1);
    const [isPackSelected, setIsPackSelected] = useState(true);

    const [selectedPack, setSelectedPack] = useState<IProductPack>(
        product_packs.slice().sort((a, b) => a.price - b.price)[0],
    );

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
            <section aria-labelledby="information-heading">
                <h3 id="information-heading" className="sr-only">
                    {t('product_information')}
                </h3>

                <p className="text-2xl font-semibold mt-6 bg-cerv-banana max-w-[140px] text-center p-5 rounded-full text-white shadow-xl  border-white border-4">
                    {formatCurrency(selectedPack?.price)}
                </p>
                <div className="m-auto text-center">
                    <img
                        className="m-auto"
                        src="/assets/home/detalle.svg"
                        width="80"
                    ></img>
                </div>
            </section>

            {product_packs && (
                <div className="mt-5">
                    <div className="flex items-center justify-between w-[140px]  rounded-t-md bg-beer-blonde text-white pl-2">
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold">
                            {t('select_your_product_packs')}:
                        </h4>
                    </div>

                    <fieldset className="">
                        <legend className="sr-only bg-white">
                            {t('choose_pack')}
                        </legend>

                        <div className="flex flex-wrap gap-4 border-2 pl-2 rounded-md border-beer-blonde p-2 bg-white shadow-lg dark:bg-cerv-titlehigh">
                            {product_packs
                                .slice() // Copy the array to avoid mutating the original
                                .sort((a, b) => a.quantity - b.quantity) // Sort by quantity
                                .map((productPack) => (
                                    <div
                                        key={productPack.id}
                                        className="flex-1"
                                    >
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
                        </div>

                        {/* Warning message if pack is not selected  */}
                        {!isPackSelected && (
                            <div className="text-md mt-4 flex justify-start text-red-500">
                                {t('select_pack')}
                            </div>
                        )}

                        <div className="flex space-x-2 bg-gray-100 p-3 shadow-lg relative float-left justify-center items-center dark:bg-cerv-titlehigh">
                            <MarketCartButtons2
                                item={product_packs[0]}
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

                            <AddCartButton
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
