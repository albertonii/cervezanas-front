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
        setAnimateRemove(true);
        setTimeout(() => {
            removeFromCart(eventId, item.product_id, cpId, pack.id);
        }, 300); // Ajuste del tiempo para una animación más suave
    };

    return (
        <div
            className={`flex items-center justify-between  space-x-2 rounded-lg sm:p-3 shadow-sm hover:shadow-md transition ${
                animateRemove ? 'opacity-0 transform translate-x-4' : ''
            }`}
        >
            {/* Imagen del Producto */}
            <DisplayImageProduct
                imgSrc={
                    SupabaseProps.BASE_PRODUCTS_URL +
                    decodeURIComponent(pack.img_url)
                }
                alt={pack.name}
                width={48}
                height={48}
                class="hidden sm:block w-12 h-12 sm:w-16 sm:h-16 rounded-md object-cover"
            />

            {/* Información del Producto */}
            <div className="flex-1 sm:px-4 flex flex-col">
                <Label
                    size="small"
                    font="medium"
                    color="black"
                    className="text-gray-900 dark:text-white "
                >
                    <span className="truncate max-w-[140px] lg:max-w-[170px]">
                        {pack.name}
                    </span>
                </Label>

                <Label
                    size="xsmall"
                    color="gray"
                    className="text-gray-500 dark:text-gray-400"
                >
                    {formatCurrency(pack.price)}
                </Label>
            </div>

            {/* Botones de Acción */}
            <MarketCartButtons
                item={pack}
                quantity={pack.quantity}
                handleIncreaseCartQuantity={handleIncreaseCartQuantity}
                handleDecreaseCartQuantity={handleDecreaseCartQuantity}
                handleRemoveFromCart={handleRemoveFromCart}
                displayDeleteButton={true}
            />
        </div>
    );
}
