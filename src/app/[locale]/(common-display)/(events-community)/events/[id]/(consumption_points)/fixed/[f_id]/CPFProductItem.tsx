import Link from 'next/link';

import TR from '@/app/[locale]/components/ui/table/TR';
import TD from '@/app/[locale]/components/ui/table/TD';
import useEventCartStore from '@/app/store//eventCartStore';
import MarketCartButtons2 from '@/app/[locale]/components/cart/MarketCartButtons2';
import DisplayImageProduct from '@/app/[locale]/components/ui/DisplayImageProduct';
import React, { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { SupabaseProps } from '@/constants';
import { formatCurrency } from '@/utils/formatCurrency';
import { ROUTE_EVENTS, ROUTE_PRODUCTS } from '@/config';
import { ICPFixed } from '@/lib/types/consumptionPoints';
import { ICartEventProduct, IProductPack } from '@/lib/types/types';
import { useAuth } from '../../../../../../../(auth)/Context/useAuth';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { AddCartButton } from '@/app/[locale]/components/cart/AddCartButton';

interface ProductProps {
    pack: IProductPack;
    cpfId: string;
    eventId: string;
    cpFixed: ICPFixed;
}

export default function CPFProductItem({
    pack,
    cpfId,
    eventId,
    cpFixed,
}: ProductProps) {
    const t = useTranslations();
    const locale = useLocale();
    const { isLoggedIn } = useAuth();
    const { handleMessage } = useMessage();

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
            getPackQuantity(eventId, pack.product_id, cpFixed.id, pack.id),
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
            cp_id: cpFixed.id,
            cp_name: cpFixed.cp_name,
        };

        addPackToCart(eventId, productEvent, packCartItem);
    };

    const handleIncreaseCartQuantity = () => {
        increaseOnePackCartQuantity(
            eventId,
            product_id,
            cpFixed.id,
            pack.product_id,
        );
    };

    const handleDecreaseCartQuantity = () => {
        decreaseOnePackCartQuantity(
            eventId,
            product_id,
            cpFixed.id,
            pack.product_id,
        );
    };

    const handleRemoveFromCart = () => {
        removeFromCart(eventId, product_id, cpFixed.id, pack.product_id);
    };

    return (
        <TR key={pack.product_id}>
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

            <TD class_="hover:cursor-pointer hover:text-beer-draft">
                <Link
                    target={'_blank'}
                    href={`${ROUTE_EVENTS}/${eventId}${ROUTE_PRODUCTS}/${cpfId}`}
                    locale={locale}
                >
                    {product?.name}
                </Link>
            </TD>

            <TD>{name}</TD>

            <TD>{quantity}</TD>

            <TD class_="hidden max-w-[14vw] overflow-hidden md:block">
                <span className="truncate">{product?.description}</span>
            </TD>

            <TD class_="text-green-500">{formatCurrency(price)}</TD>

            <TD class_="hidden md:block">{t(product?.type.toLowerCase())}</TD>

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
                        <MarketCartButtons2
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
