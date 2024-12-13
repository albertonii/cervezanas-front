import Link from 'next/link';
import useEventCartStore from '@/app/store/eventCartStore';
import DisplayImageProduct from '@/app/[locale]/components/ui/DisplayImageProduct';
import EventCartButtons from '@/app/[locale]/components/cart/EventCartButtons';
import React, { useEffect, useState } from 'react';
import { SupabaseProps } from '@/constants';
import { useLocale, useTranslations } from 'next-intl';
import { ROUTE_EVENTS, ROUTE_PRODUCTS } from '@/config';
import { formatCurrency } from '@/utils/formatCurrency';
import { ICartEventProduct, IProductPack } from '@/lib/types/types';
import { AddCartButton } from '@/app/[locale]/components/cart/AddCartButton';
import {
    IConsumptionPointEvent,
    IConsumptionPointProduct,
} from '@/lib/types/consumptionPoints';
import Label from '@/app/[locale]/components/ui/Label';

interface ProductProps {
    eventId: string;
    cpProduct: IConsumptionPointProduct;
    cpEvent: IConsumptionPointEvent;
}

const CPProductCollapsableItem: React.FC<ProductProps> = ({
    eventId,
    cpProduct,
    cpEvent,
}) => {
    const t = useTranslations();
    const locale = useLocale();

    const { cp_id: cpId, product_packs: pack } = cpProduct;

    if (!pack) return null;

    const {
        eventCarts,
        getPackQuantity,
        removeFromCart,
        addPackToCart,
        increaseOnePackCartQuantity,
        decreaseOnePackCartQuantity,
        existEventCart,
        createNewCart,
    } = useEventCartStore();

    const { name, price, product_id, products: product, quantity } = pack;

    const [packQuantity, setPackQuantity] = useState(0);

    useEffect(() => {
        if (!existEventCart(eventId)) {
            createNewCart(eventId);
        }

        setPackQuantity(
            getPackQuantity(eventId, pack.product_id, cpProduct.cp_id, pack.id),
        );
    }, [eventCarts, eventId, pack.product_id, cpProduct.cp_id, pack.id]);

    const handleAddToCart = () => {
        const packCartItem: IProductPack = {
            id: pack.id,
            product_id: pack.product_id,
            created_at: pack.created_at,
            quantity: 1,
            price: pack.price,
            name: pack.name,
            img_url: pack.img_url,
            randomUUID: pack.randomUUID,
            products: pack.products,
        };

        const product = pack.products;

        if (!product) return;

        const productEvent: ICartEventProduct = {
            id: product.id,
            created_at: product.created_at,
            name: product.name,
            description: product.description,
            type: product.type,
            is_public: product.is_public,
            discount_percent: product.discount_percent,
            weight: product.weight,
            price: product.price,
            campaign_id: product.campaign_id,
            is_archived: product.is_archived,
            category: product.category,
            is_monthly: product.is_monthly,
            owner_id: product.owner_id,
            beers: product.beers,
            product_media: product.product_media,
            product_lots: product.product_lots,
            product_inventory: product.product_inventory,
            reviews: product.reviews,
            likes: product.likes,
            awards: product.awards,
            product_packs: product.product_packs,
            cp_id: cpProduct.cp_id,
            cp_name: cpProduct.cp?.cp_name ?? '',
            cp_cps_id: cpEvent.id,
        };

        addPackToCart(eventId, productEvent, packCartItem);
    };

    const handleIncreaseCartQuantity = () => {
        increaseOnePackCartQuantity(
            eventId,
            product_id,
            cpProduct.cp_id,
            pack.id,
        );
    };

    const handleDecreaseCartQuantity = () => {
        decreaseOnePackCartQuantity(
            eventId,
            product_id,
            cpProduct.cp_id,
            pack.id,
        );
    };

    const handleRemoveFromCart = () => {
        removeFromCart(eventId, product_id, cpProduct.cp_id, pack.id);
    };

    return (
        <div className="flex sm:flex-wrap items-center justify-between w-full p-1 sm:p-4 border-b border-gray-200 dark:border-gray-700">
            {/* Imagen del Producto */}
            <div className="flex items-center w-full md:w-1/4">
                <DisplayImageProduct
                    imgSrc={
                        SupabaseProps.BASE_PRODUCTS_URL +
                        decodeURIComponent(pack.img_url)
                    }
                    alt={pack.name}
                    width={80}
                    height={80}
                    class="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md"
                />
                <div className="ml-4">
                    <Link
                        target={'_blank'}
                        href={`${ROUTE_EVENTS}/${eventId}${ROUTE_PRODUCTS}/${cpId}`}
                        locale={locale}
                        className="text-beer-gold dark:text-beer-blonde hover:underline text-sm sm:text-base md:text-lg font-semibold"
                    >
                        {product?.name}
                    </Link>
                </div>
            </div>

            {/* Información del Producto */}
            <div className="w-full mt-4 md:mt-0 md:w-1/2 hidden sm:flex sm:flex-col">
                <Label size="xsmall" color="black">
                    {name}
                </Label>
                <Label size="xsmall">
                    {t('quantity')}: {quantity}
                </Label>

                <Label color="light-green" font="medium" size="small">
                    {formatCurrency(price)}
                </Label>
            </div>

            {/* Acciones */}
            <div className="flex items-center w-full md:mt-0 md:w-1/4 justify-end">
                {packQuantity === 0 ? (
                    <AddCartButton withText={true} onClick={handleAddToCart} />
                ) : (
                    <EventCartButtons
                        item={pack}
                        quantity={packQuantity}
                        handleIncreaseCartQuantity={handleIncreaseCartQuantity}
                        handleDecreaseCartQuantity={handleDecreaseCartQuantity}
                        handleRemoveFromCart={handleRemoveFromCart}
                        displayDeleteButton={true}
                    />
                )}
            </div>
        </div>
    );
};

export default CPProductCollapsableItem;
