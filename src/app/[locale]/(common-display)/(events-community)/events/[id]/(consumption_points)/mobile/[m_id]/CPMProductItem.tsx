import Link from 'next/link';
import useEventCartStore from '@/app/store//eventCartStore';
import MarketCartButtons2 from '@/app/[locale]/components/common/MarketCartButtons2';
import DisplayImageProduct from '@/app/[locale]/components/common/DisplayImageProduct';
import React, { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { SupabaseProps } from '@/constants';
import { ICPMobile, IEventProduct, IProductPack } from '@/lib/types/types';
import { formatCurrency } from '@/utils/formatCurrency';
import { AddCardButton } from '@/app/[locale]/components/common/AddCartButton';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { useAuth } from '../../../../../../../(auth)/Context/useAuth';
import { ROUTE_EVENTS, ROUTE_PRODUCTS } from '@/config';

interface ProductProps {
    pack: IProductPack;
    cpmId: string;
    eventId: string;
    cpMobile: ICPMobile;
}

export default function CPMProductItem({
    pack,
    cpmId,
    eventId,
    cpMobile,
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
            getPackQuantity(eventId, pack.product_id, cpMobile.id, pack.id),
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

        const productEvent: IEventProduct = {
            id: product.id,
            created_at: product.created_at,
            name: product.name,
            description: product.description,
            type: product.type,
            is_public: product.is_public,
            discount_code: product.discount_code,
            discount_percent: product.discount_percent,
            weight: product.weight,
            price: product.price,
            campaign_id: product.campaign_id,
            is_archived: product.is_archived,
            category: product.category,
            is_monthly: product.is_monthly,
            owner_id: product.owner_id,
            beers: product.beers,
            product_multimedia: product.product_multimedia,
            product_lots: product.product_lots,
            product_inventory: product.product_inventory,
            reviews: product.reviews,
            likes: product.likes,
            awards: product.awards,
            product_packs: product.product_packs,
            cpm_id: cpMobile.id,
            cpf_id: '',
            cp_name: cpMobile.cp_name,
        };

        addPackToCart(eventId, productEvent, packCartItem);
    };

    const handleIncreaseCartQuantity = () => {
        increaseOnePackCartQuantity(
            eventId,
            product_id,
            cpMobile.id,
            pack.product_id,
        );
    };

    const handleDecreaseCartQuantity = () => {
        decreaseOnePackCartQuantity(
            eventId,
            product_id,
            cpMobile.id,
            pack.product_id,
        );
    };

    const handleRemoveFromCart = () => {
        removeFromCart(eventId, product_id, cpmId, pack.product_id);
    };

    return (
        <tr key={pack.product_id} className="">
            <td className="space-x-2 px-6 py-4">
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
            </td>

            <td className="space-x-2 px-6 py-4 font-semibold hover:cursor-pointer hover:text-beer-draft">
                <Link
                    target={'_blank'}
                    href={`${ROUTE_EVENTS}/${eventId}${ROUTE_PRODUCTS}/${cpmId}`}
                    locale={locale}
                >
                    {product?.name}
                </Link>
            </td>

            <td className="space-x-2 px-6 py-4 font-semibold">{name}</td>

            <td className="space-x-2 px-6 py-4 font-semibold">{quantity}</td>

            <td className="hidden max-w-[14vw] space-x-2 overflow-hidden px-6 py-4 md:block">
                <span className="truncate">{product?.description}</span>
            </td>

            <td className="space-x-2 px-6 py-4 font-medium  text-green-500">
                {formatCurrency(price)}
            </td>

            <td className="hidden space-x-2 px-6 py-4 md:block">
                {t(product?.type.toLowerCase())}
            </td>

            <td className="space-x-2 px-6 py-4">
                {packQuantity === 0 ? (
                    <>
                        <AddCardButton
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
            </td>
        </tr>
    );
}
