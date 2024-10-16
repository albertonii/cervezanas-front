'use client';

import Link from 'next/link';
import DeliveryError from '../DeliveryError';
import CheckoutPackItem from './CheckoutPackItem';
import Spinner from '@/app/[locale]/components/ui/Spinner';
import useFetchProductById from '../../../../../hooks/useFetchProductById';
import React, { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { IProductPackCartItem } from '@/lib//types/types';
import { useShoppingCart } from '@/app/context/ShoppingCartContext';

interface Props {
    productPack: IProductPackCartItem;
    isShippingCostLoading: boolean;
}

export function CheckoutItem({ productPack, isShippingCostLoading }: Props) {
    const t = useTranslations();
    const locale = useLocale();

    const { undeliverableItems } = useShoppingCart();

    // Determinar si el producto no es entregable
    const isItemUndeliverable = React.useMemo(() => {
        return undeliverableItems.some((item) => item.id === productPack.id);
    }, [undeliverableItems, productPack.id]);

    return (
        <article
            className={`mt-6 ${
                isShippingCostLoading ? 'pointer-events-none opacity-50' : ''
            }`}
        >
            <div className="flex items-baseline space-x-2">
                <span className=" dark:text-white">{t('product_name')}:</span>
                <Link
                    href={`/products/${productPack.product_id}`}
                    locale={locale}
                    target={'_blank'}
                >
                    <span className="text-lg font-semibold text-beer-draft hover:text-beer-gold dark:text-white hover:underline animation-all ease-in-out duration-200">
                        {productPack.name}
                    </span>
                </Link>
            </div>

            {isItemUndeliverable && <DeliveryError />}

            {productPack.packs.map((pack) => (
                <div key={pack.id}>
                    <CheckoutPackItem productPack={productPack} pack={pack} />
                </div>
            ))}
        </article>
    );
}
