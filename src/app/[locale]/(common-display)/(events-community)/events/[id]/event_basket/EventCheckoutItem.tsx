'use client';

import Spinner from '@/app/[locale]/components/ui/Spinner';
import EventCheckoutPackItem from './EventCheckoutPackItem';
import useFetchProductById from '../../../../../../../hooks/useFetchProductById';
import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { IProductPackEventCartItem } from '@/lib/types/types';
import Link from 'next/link';
import Label from '@/app/[locale]/components/ui/Label';

interface Props {
    eventId: string;
    productPack: IProductPackEventCartItem;
}

export function EventCheckoutItem({ eventId, productPack }: Props) {
    const t = useTranslations();
    const locale = useLocale();

    const {
        data: productWithInfo,
        isError,
        isLoading,
    } = useFetchProductById(productPack.product_id);

    if (isLoading) return <Spinner color={'beer-blonde'} />;

    if (isError) return <div className="text-center text-red-500">Error</div>;

    if (!productWithInfo) return null;

    return (
        <div className="rounded-lg shadow-sm space-y-2">
            {productPack && (
                <section className="space-y-4">
                    <div className="w-full flex justify-between items-baseline space-x-2">
                        <div>
                            <Link
                                className="text-lg font-semibold text-beer-draft dark:text-white hover:underline hover:text-beer-draft dark:hover:text-beer-gold transition-all ease-in-out duration-200"
                                href={`/products/${productPack.product_id}`}
                                locale={locale}
                            >
                                {productPack.name}
                            </Link>
                        </div>

                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            {t('quantity')}: {productPack.quantity}
                        </div>
                    </div>

                    {productPack.packs.map((pack) => (
                        <>
                            <div key={pack.id}>
                                <EventCheckoutPackItem
                                    eventId={eventId}
                                    productPack={productPack}
                                    productWithInfo={productWithInfo}
                                    pack={pack}
                                />
                            </div>
                        </>
                    ))}
                </section>
            )}
        </div>
    );
}
