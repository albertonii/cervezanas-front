import Link from 'next/link';
import TR from '@/app/[locale]/components/ui/table/TR';
import TD from '@/app/[locale]/components/ui/table/TD';
import useEventCartStore from '@/app/store//eventCartStore';
import EventCartButtons from '@/app/[locale]/components/cart/EventCartButtons';
import DisplayImageProduct from '@/app/[locale]/components/ui/DisplayImageProduct';
import React, { useEffect, useState } from 'react';
import { SupabaseProps } from '@/constants';
import { useLocale, useTranslations } from 'next-intl';
import { ROUTE_EVENTS, ROUTE_PRODUCTS } from '@/config';
import { formatCurrency } from '@/utils/formatCurrency';
import { ICartEventProduct, IProductPack } from '@/lib/types/types';
import { useAuth } from '../../../../../../../(auth)/Context/useAuth';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { AddCartButton } from '@/app/[locale]/components/cart/AddCartButton';

import {
    IConsumptionPointEvent,
    IConsumptionPointProduct,
} from '@/lib/types/consumptionPoints';

interface ProductProps {
    eventId: string;
    cpProduct: IConsumptionPointProduct;
    cpEvent: IConsumptionPointEvent;
}

export default function CPProductItem({
    eventId,
    cpProduct,
    cpEvent,
}: ProductProps) {
    const t = useTranslations();
    const locale = useLocale();
    const { isLoggedIn } = useAuth();
    const { handleMessage } = useMessage();

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
    }, [eventCarts]);

    const handleAddToCart = () => {
        if (!isLoggedIn) {
            handleMessage({
                type: 'info',
                message: 'must_be_logged_in_add_store',
            });
            return;
        }

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
            // promo_code: product.promo_code,
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
        <TR key={cpId}>
            <TD>
                <DisplayImageProduct
                    imgSrc={
                        SupabaseProps.BASE_PRODUCTS_URL +
                        decodeURIComponent(pack.img_url)
                    }
                    alt={pack.name}
                    width={600}
                    height={600}
                    class="w-[10vw] px-2 py-2 sm:w-[15vw] md:w-[20vw] lg:w-[6vw]"
                />
            </TD>

            <TD class_="hover:cursor-pointer hover:text-beer-gold">
                <Link
                    target={'_blank'}
                    href={`${ROUTE_EVENTS}/${eventId}${ROUTE_PRODUCTS}/${cpId}`}
                    locale={locale}
                >
                    {product?.name}
                </Link>
            </TD>

            <TD>{name}</TD>

            <TD>{quantity}</TD>

            <TD class_="font-medium text-green-500">{formatCurrency(price)}</TD>

            <TD>{t(cpEvent.cp?.type.toLowerCase())}</TD>

            <TD>
                {packQuantity === 0 ? (
                    <>
                        <AddCartButton
                            withText={true}
                            onClick={() => handleAddToCart()}
                        />
                    </>
                ) : (
                    <>
                        <EventCartButtons
                            item={pack}
                            quantity={packQuantity}
                            handleIncreaseCartQuantity={() =>
                                handleIncreaseCartQuantity()
                            }
                            handleDecreaseCartQuantity={() =>
                                handleDecreaseCartQuantity()
                            }
                            handleRemoveFromCart={() => {
                                handleRemoveFromCart();
                            }}
                            displayDeleteButton={true}
                        />
                    </>
                )}
            </TD>
        </TR>
    );
}
