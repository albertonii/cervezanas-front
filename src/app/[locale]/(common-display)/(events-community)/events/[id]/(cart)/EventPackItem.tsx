import Label from '@/app/[locale]/components/ui/Label';
import MarketCartButtons from '@/app/[locale]/components/cart/MarketCartButtons';
import DisplayImageProduct from '@/app/[locale]/components/ui/DisplayImageProduct';
import React, { useState } from 'react';
import { SupabaseProps } from '@/constants';
import { formatCurrency } from '@/utils/formatCurrency';
import { IProductPack, IProductPackEventCartItem } from '@/lib/types/types';
import useEventCartStore from '@/app/store/eventCartStore';

interface Props {
    pack: IProductPack;
    item: IProductPackEventCartItem;
    eventId: string;
}

export default function EventPackItem({ pack, item, eventId }: Props) {
    const cpId = item.cp_id;
    const [animateRemove, setAnimateRemove] = useState(false);

    const {
        removeFromCart,
        increaseOnePackCartQuantity,
        decreaseOnePackCartQuantity,
    } = useEventCartStore();

    const handleIncreaseCartQuantity = () => {
        increaseOnePackCartQuantity(eventId, item.product_id, cpId, pack.id);
    };

    const handleDecreaseCartQuantity = () => {
        decreaseOnePackCartQuantity(eventId, item.product_id, cpId, pack.id);
    };

    const handleRemoveFromCart = () => {
        setTimeout(() => {
            setAnimateRemove(true);

            removeFromCart(eventId, item.product_id, cpId, pack.id);
        }, 500);
    };

    return (
        <div
            className={`flex items-center justify-between bg-white space-x-2 rounded-lg p-3 shadow-sm hover:shadow-md transition ${
                animateRemove && 'animate-ping overflow-hidden '
            }`}
        >
            {/* Product Image */}
            <DisplayImageProduct
                imgSrc={
                    SupabaseProps.BASE_PRODUCTS_URL +
                    decodeURIComponent(pack.img_url)
                }
                alt={pack.name}
                width={200}
                height={200}
                class="w-[6vw] px-2 py-2 sm:w-[5vw] md:w-[6vw] lg:w-[5vw]"
            />

            {/* Product Info */}
            <div className="px-4 items-start flex flex-col">
                <Label size="small" font="medium">
                    {pack.name}
                </Label>

                <Label size="xsmall" color="gray">
                    {formatCurrency(pack.price)}
                </Label>
            </div>

            {/* Action Buttons */}
            <MarketCartButtons
                item={pack}
                quantity={pack.quantity}
                handleIncreaseCartQuantity={() => {
                    handleIncreaseCartQuantity();
                }}
                handleDecreaseCartQuantity={() => {
                    handleDecreaseCartQuantity();
                }}
                handleRemoveFromCart={() => {
                    handleRemoveFromCart();
                }}
                displayDeleteButton={true}
            />
        </div>
    );
}
