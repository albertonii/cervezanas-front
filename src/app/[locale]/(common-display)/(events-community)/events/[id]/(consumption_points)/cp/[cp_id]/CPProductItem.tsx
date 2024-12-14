// components/CPProductItem.tsx
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { SupabaseProps } from '@/constants';
import { useLocale, useTranslations } from 'next-intl';
import { ROUTE_EVENTS, ROUTE_PRODUCTS } from '@/config';
import { formatCurrency } from '@/utils/formatCurrency';
import { ICartEventProduct, IProductPack } from '@/lib/types/types';

import {
    IConsumptionPointEvent,
    IConsumptionPointProduct,
} from '@/lib/types/consumptionPoints';
import { useAuth } from '@/app/[locale]/(auth)/Context/useAuth';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import useEventCartStore from '@/app/store/eventCartStore';
import DisplayImageProduct from '@/app/[locale]/components/ui/DisplayImageProduct';
import TD from '@/app/[locale]/components/ui/table/TD';
import TR from '@/app/[locale]/components/ui/table/TR';
import { AddCartButton } from '@/app/[locale]/components/cart/AddCartButton';
import EventCartButtons from '@/app/[locale]/components/cart/EventCartButtons';

interface ProductProps {
    eventId: string;
    cpProduct: IConsumptionPointProduct;
    cpEvent: IConsumptionPointEvent;
}

const CPProductItem: React.FC<ProductProps> = ({
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
        if (!pack) {
            return;
        }

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
        <TR>
            {/* Imagen del Producto */}
            <TD class_="hidden sm:table-cell">
                <DisplayImageProduct
                    imgSrc={
                        SupabaseProps.BASE_PRODUCTS_URL +
                        decodeURIComponent(pack.img_url)
                    }
                    alt={pack.name}
                    width={100}
                    height={100}
                    class="w-12 h-12 lg:w-24 lg:h-24 object-cover rounded-md"
                />
            </TD>

            {/* Nombre del Producto */}
            <TD class_="text-gray-800 dark:text-gray-100">
                <Link
                    target={'_blank'}
                    // href={`${ROUTE_EVENTS}/${eventId}${ROUTE_PRODUCTS}/${cpProduct.id}`}
                    href={`${ROUTE_PRODUCTS}/${pack.product_id}`}
                    locale={locale}
                    className="text-beer-gold dark:text-beer-blonde hover:underline"
                >
                    {product?.name}
                </Link>
            </TD>

            {/* Nombre del Paquete */}
            <TD class_="hidden sm:table-cell text-gray-800 dark:text-gray-100">
                {name}
            </TD>

            {/* Cantidad en el Paquete */}
            <TD class_="hidden sm:table-cell text-center text-gray-800 dark:text-gray-100">
                {quantity}
            </TD>

            {/* Precio del Paquete */}
            <TD class_="text-green-500 font-medium">{formatCurrency(price)}</TD>

            {/* Tipo de Paquete */}
            <TD class_="hidden sm:table-cell stext-gray-800 dark:text-gray-100">
                {t(cpEvent.cp?.type.toLowerCase())}
            </TD>

            {/* Acciones */}
            <TD class_="text-center">
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
            </TD>
        </TR>
    );
};

export default CPProductItem;
