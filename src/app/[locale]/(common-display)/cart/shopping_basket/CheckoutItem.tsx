'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import DeliveryError from '../DeliveryError';
import CheckoutPackItem from './CheckoutPackItem';
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
    const [isItemUnDeliverable, setIsItemUnDeliverable] = useState(false);

    useEffect(() => {
        if (undeliverableItems?.length === 0) {
            setIsItemUnDeliverable(false);
            return;
        }

        // Comprobar si el producto es entregable
        undeliverableItems.find((item) => {
            if (item.id === productPack.id) {
                setIsItemUnDeliverable(true);
                return;
            }
        });
    }, [undeliverableItems]);

    const {
        data: productWithInfo,
        isError,
        isLoading: isLoadingProduct,
        refetch,
    } = useFetchProductById(productPack.product_id);

    useEffect(() => {
        refetch();
    }, []);

    if (isLoadingProduct) {
        const DynamicSpinner = dynamic(
            () => import('@/app/[locale]/components/common/Spinner'),
            {
                ssr: false,
            },
        );

        return <DynamicSpinner color={'beer-blonde'} size={'medium'} />;
    }

    if (isError) return <div className="text-center text-red-500">Error</div>;

    if (!productWithInfo) return null;

    return (
        <article
            className={`mt-4 space-y-4 
                        ${isShippingCostLoading ? 'pointer-events-none' : ''}
                     `}
        >
            <Link
                href={`/products/${productWithInfo.id}`}
                locale={locale}
                target={'_blank'}
            >
                <p className="space-x-2 text-xl">
                    <span className=" dark:text-white">
                        {t('product_name')}:
                    </span>

                    <span className="font-semibold hover:text-beer-gold dark:text-white hover:underline">
                        {productPack.name}
                    </span>
                </p>
            </Link>

            {isItemUnDeliverable && <DeliveryError />}

            {productPack.packs.map((pack) => (
                <div key={pack.id}>
                    <CheckoutPackItem
                        productPack={productPack}
                        productWithInfo={productWithInfo}
                        pack={pack}
                    />
                </div>
            ))}
        </article>
    );
}
