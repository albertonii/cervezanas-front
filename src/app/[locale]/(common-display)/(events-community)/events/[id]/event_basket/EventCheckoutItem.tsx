'use client';

import Spinner from '@/app/[locale]/components/ui/Spinner';
import EventCheckoutPackItem from './EventCheckoutPackItem';
import useFetchProductById from '../../../../../../../hooks/useFetchProductById';
import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { IProductPackEventCartItem } from '@/lib/types/types';
import Link from 'next/link';

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
        <>
            {productPack && (
                <section className="mt-4 space-y-4">
                    <div className="flex items-baseline space-x-2">
                        <span className=" dark:text-white">
                            {t('product_name')}:
                        </span>

                        <Link
                            href={`/products/${productPack.product_id}`}
                            locale={locale}
                            target={'_blank'}
                        >
                            <span className="text-lg font-semibold text-beer-draft text-right hover:text-beer-gold dark:text-white hover:underline animation-all ease-in-out duration-200">
                                {productPack.name}
                            </span>
                        </Link>
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
        </>
    );
}
