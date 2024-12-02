import useEventCartStore from '@/app/store//eventCartStore';

import MarketCartButtons from '@/app/[locale]/components/cart/MarketCartButtons';
import DisplayImageProduct from '@/app/[locale]/components/ui/DisplayImageProduct';
import React, { useState } from 'react';
import { SupabaseProps } from '@/constants';
import { formatCurrency } from '@/utils/formatCurrency';
import { IProductPack, IProductPackEventCartItem } from '@/lib/types/types';
import Label from '@/app/[locale]/components/ui/Label';

interface Props {
    pack: IProductPack;
    item: IProductPackEventCartItem;
    eventId: string;
}

export default function EventPackItem({ pack, item, eventId }: Props) {
    const cpId = item.cp_id;

    const {
        removeFromCart,
        increaseOnePackCartQuantity,
        decreaseOnePackCartQuantity,
    } = useEventCartStore();

    const [animateRemove, setAnimateRemove] = useState(false);

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
        <section
            className={`flex items-center space-x-2 ${
                animateRemove && 'animate-ping overflow-hidden '
            }`}
        >
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

            <Label size="xsmall">{pack.name}</Label>

            <div className="flex flex-1 items-center justify-end gap-2 space-x-2">
                <Label size="xsmall">{formatCurrency(pack.price)}</Label>

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
        </section>
    );
}
