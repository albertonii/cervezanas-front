'use client';

import EventCheckoutPackItem from './EventCheckoutPackItem';
import React from 'react';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { IProductPackEventCartItem } from '@/lib/types/types';
import useFetchProductById from '../../../../../../../hooks/useFetchProductById';
import Spinner from '@/app/[locale]/components/ui/Spinner';

interface Props {
    eventId: string;
    productPack: IProductPackEventCartItem;
}

export function EventCheckoutItem({ eventId, productPack }: Props) {
    const t = useTranslations();

    const {
        data: productWithInfo,
        isError,
        isLoading,
        refetch,
    } = useFetchProductById(productPack.product_id);

    useEffect(() => {
        refetch();
    }, []);

    if (isLoading) return <Spinner color={'beer-blonde'} />;

    if (isError) return <div className="text-center text-red-500">Error</div>;

    if (!productWithInfo) return null;

    return (
        <>
            {productPack && (
                <section className="mt-4 space-y-4">
                    <header className="">
                        <p className="text-xl">
                            <span className="font-semibold">
                                {t('product_name')}:
                            </span>{' '}
                            {productPack.name}
                        </p>
                    </header>

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
