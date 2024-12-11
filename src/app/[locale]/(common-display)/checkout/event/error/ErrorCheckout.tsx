'use client';

import Link from 'next/link';
import DisplayImageProduct from '@/app/[locale]/components/ui/DisplayImageProduct';
import React, { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { SupabaseProps } from '@/constants';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDateString } from '@/utils/formatDate';
import {
    IEventOrder,
    IEventOrderItem,
    IEventOrderCPS,
} from '@/lib/types/eventOrders';
import Title from '@/app/[locale]/components/ui/Title';
import Label from '@/app/[locale]/components/ui/Label';

interface Props {
    isError?: boolean;
    eventOrder: IEventOrder;
}

const BASE_PRODUCTS_URL = SupabaseProps.BASE_PRODUCTS_URL;

export default function ErrorCheckout({ eventOrder, isError }: Props) {
    const t = useTranslations();
    const locale = useLocale();

    const { event_order_cps: eventOrderCPs } = eventOrder;

    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        setLoading(!user);
    }, [user]);

    if (isError) {
        return (
            <div className="container mx-auto sm:py-4 lg:py-6">
                <div className=" flex flex-col sm:items-baseline sm:space-x-4 space-y-2 px-4 sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0">
                    <Title size="xlarge" color="black" font="bold">
                        {t('order_error')}
                    </Title>
                </div>
            </div>
        );
    }

    return (
        <>
            {!loading && (
                <div className="container mx-auto sm:py-4 lg:py-6">
                    <div className="space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0">
                        <div className="flex flex-col">
                            <div className="flex sm:items-baseline sm:space-x-4">
                                <Title
                                    size="large"
                                    color="beer-draft"
                                    font="bold"
                                >
                                    {t('order_number')} #
                                    {eventOrder.order_number}
                                </Title>
                            </div>

                            {/* Estado del Pedido */}
                            <div className="right-0 col-span-12 pr-12 md:col-span-4 md:mt-2">
                                <Label size="large" color="beer-draft">
                                    {t('order_status')}:{' '}
                                    <Label
                                        size="large"
                                        color="beer-draft"
                                        font="semibold"
                                    >
                                        {t(eventOrder.status)}
                                    </Label>
                                </Label>
                            </div>
                        </div>

                        <Label size="small" color="gray">
                            {t('status_order_placed')}{' '}
                            <time
                                dateTime={eventOrder.created_at}
                                className="font-medium text-gray-900"
                            >
                                {formatDateString(eventOrder.created_at)}
                            </time>
                        </Label>
                    </div>

                    {/* Productos */}
                    <div className="mt-6">
                        <h2 className="sr-only">{t('products_purchased')}</h2>

                        <div className="space-y-8">
                            {eventOrderCPs?.map(
                                (eventOrderCP: IEventOrderCPS) =>
                                    eventOrderCP.event_order_items?.map(
                                        (item: IEventOrderItem) => (
                                            <div
                                                key={item.id}
                                                className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
                                            >
                                                {item.product_packs && (
                                                    <div className="relative grid grid-cols-12 gap-x-8 p-8 px-4 py-6 sm:px-6 lg:grid-cols-12 lg:gap-x-8 lg:p-8">
                                                        {/* Imagen del Producto */}
                                                        <div className="col-span-12 mt-6 flex justify-center sm:ml-6 md:col-span-2 md:mt-6">
                                                            <div className="aspect-w-1 aspect-h-1 sm:aspect-none h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg lg:h-40 lg:w-40">
                                                                <DisplayImageProduct
                                                                    width={128}
                                                                    height={128}
                                                                    alt={
                                                                        item
                                                                            .product_packs
                                                                            .products
                                                                            ?.name ||
                                                                        'Product Image'
                                                                    }
                                                                    imgSrc={
                                                                        BASE_PRODUCTS_URL +
                                                                        decodeURIComponent(
                                                                            item
                                                                                .product_packs
                                                                                .img_url,
                                                                        )
                                                                    }
                                                                    class="h-full w-full rounded-2xl object-contain hover:cursor-pointer"
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Información del Producto */}
                                                        <div className="col-span-12 mt-6 md:col-span-4 md:mt-6">
                                                            <Title
                                                                size="medium"
                                                                color="gray"
                                                                font="medium"
                                                            >
                                                                <Link
                                                                    href={`/products/${item.product_packs.product_id}`}
                                                                    locale={
                                                                        locale
                                                                    }
                                                                    className="hover:text-beer-draft"
                                                                >
                                                                    {
                                                                        item
                                                                            .product_packs
                                                                            .name
                                                                    }
                                                                </Link>
                                                            </Title>
                                                            <Label
                                                                size="small"
                                                                color="gray"
                                                                className="mt-2"
                                                            >
                                                                {t('price')}:{' '}
                                                                {formatCurrency(
                                                                    item
                                                                        .product_packs
                                                                        .price,
                                                                )}
                                                            </Label>
                                                            <Label
                                                                size="small"
                                                                color="gray"
                                                                className="mt-2"
                                                            >
                                                                {t('quantity')}:{' '}
                                                                {item.quantity}
                                                            </Label>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Estado del Pedido */}
                                                <div className="border-t border-gray-200">
                                                    <h4 className="sr-only">
                                                        Status
                                                    </h4>
                                                    <div className="flex justify-between items-center p-4">
                                                        <Label
                                                            size="small"
                                                            color="gray"
                                                            font="medium"
                                                        >
                                                            {t('status')}:{' '}
                                                            {t(
                                                                'user_cancelled',
                                                            )}
                                                        </Label>
                                                        <Label
                                                            size="small"
                                                            color="gray"
                                                        >
                                                            <time
                                                                dateTime={
                                                                    eventOrder.created_at
                                                                }
                                                            >
                                                                {formatDateString(
                                                                    eventOrder.created_at,
                                                                )}
                                                            </time>
                                                        </Label>
                                                    </div>
                                                    <div
                                                        className="mt-6"
                                                        aria-hidden="true"
                                                    >
                                                        <div className="overflow-hidden rounded-full bg-gray-200">
                                                            <div className="h-2 rounded-full bg-red-400"></div>
                                                        </div>
                                                        <div className="mt-6 hidden grid-cols-4 text-sm font-medium text-gray-600 sm:grid">
                                                            <div className="text-beer-draft">
                                                                {t(
                                                                    'user_cancelled',
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ),
                                    ),
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
