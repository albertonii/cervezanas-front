'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { IEventOrder, IEventOrderItem } from '@/lib/types/types';
import { SupabaseProps } from '@/constants';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDateString } from '@/utils/formatDate';
import DisplayImageProduct from '@/app/[locale]/components/ui/DisplayImageProduct';

interface Props {
    isError?: boolean;
    eventOrder: IEventOrder;
}

const BASE_PRODUCTS_URL = SupabaseProps.BASE_PRODUCTS_URL;

export default function ErrorCheckout({ eventOrder, isError }: Props) {
    const t = useTranslations();
    const locale = useLocale();

    const { event_order_items: orderItems } = eventOrder;

    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            setLoading(false);
        }

        return () => {
            setLoading(true);
        };
    }, [user]);

    if (isError) {
        return (
            <div className="container mx-auto sm:py-4 lg:py-6">
                <div className=" space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0">
                    <div className="flex flex-col">
                        <div className="flex sm:items-baseline sm:space-x-4">
                            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                                Order Error
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {!loading && (
                <div className="container mx-auto sm:py-4 lg:py-6">
                    <div className=" space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0">
                        <div className="flex flex-col">
                            <div className="flex sm:items-baseline sm:space-x-4">
                                <h1 className="text-xl font-extrabold tracking-tight text-beer-dark sm:text-2xl">
                                    {t('order_number')} #
                                    {eventOrder.order_number}
                                </h1>
                            </div>

                            {/* Order Status  */}
                            <div className="right-0 col-span-12 pr-12 md:col-span-4 md:mt-2 ">
                                <p className=" text-lg font-medium text-beer-dark sm:text-xl">
                                    {t('order_status')}:{' '}
                                    <span className="text-beer-draft">
                                        {t(eventOrder.status)}{' '}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600">
                            {t('status_order_placed')}{' '}
                            <time
                                dateTime="2021-03-22"
                                className="font-medium text-gray-900"
                            >
                                {formatDateString(
                                    eventOrder.created_at.toString(),
                                )}
                            </time>
                        </p>
                        <a
                            href="#"
                            className="text-sm font-medium hover:text-beer-blonde sm:hidden"
                        >
                            View invoice<span aria-hidden="true"> &rarr;</span>
                        </a>
                    </div>

                    {/* <!-- Products --> */}
                    <div className="mt-6">
                        <h2 className="sr-only">{t('products_purchased')}</h2>

                        <div className="space-y-8">
                            {orderItems &&
                                orderItems.map((item: IEventOrderItem) => (
                                    <div
                                        key={
                                            item.order_id +
                                            '-' +
                                            item.product_pack_id
                                        }
                                        className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
                                    >
                                        {item.product_packs && (
                                            <div className="relative grid grid-cols-12 gap-x-8 p-8 px-4 py-6 sm:px-6 lg:grid-cols-12 lg:gap-x-8 lg:p-8">
                                                {/* Product Multimedia  */}
                                                <div className="col-span-12 mt-6 flex justify-center sm:ml-6 md:col-span-2 md:mt-6">
                                                    <div className="aspect-w-1 aspect-h-1 sm:aspect-none h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg lg:h-40 lg:w-40">
                                                        <DisplayImageProduct
                                                            width={128}
                                                            height={128}
                                                            alt="Principal Product Image"
                                                            imgSrc={
                                                                BASE_PRODUCTS_URL +
                                                                decodeURIComponent(
                                                                    item
                                                                        .product_packs
                                                                        .img_url,
                                                                )
                                                            }
                                                            class={
                                                                'h-full w-full rounded-2xl object-contain hover:cursor-pointer'
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                {/* Product Information  */}
                                                <div className="col-span-12 mt-6 md:col-span-4 md:mt-6">
                                                    <h3 className="text-base font-medium text-gray-900 hover:text-beer-draft">
                                                        <Link
                                                            href={`/products/${item.product_packs.product_id}`}
                                                            locale={locale}
                                                        >
                                                            {
                                                                item
                                                                    .product_packs
                                                                    .name
                                                            }
                                                        </Link>
                                                    </h3>
                                                    <p className="mt-2 text-sm font-medium text-gray-900">
                                                        {t('price')} -{' '}
                                                        {formatCurrency(
                                                            item.product_packs
                                                                .price,
                                                        )}
                                                    </p>
                                                    <p className="mt-2 text-sm font-medium text-gray-900">
                                                        {t('quantity')} -
                                                    </p>
                                                    {/* <p className="mt-3 text-sm text-gray-500">
                          {t("description")} - {item.product_pack_id.description}
                        </p> */}
                                                </div>
                                            </div>
                                        )}

                                        {/* TODO: VENIR AQUI Y MANEJAR ESTADOS DEL PEDIDO  */}
                                        <div className="border-t border-gray-200">
                                            <h4 className="sr-only">Status</h4>
                                            <p className="flex justify-between text-sm font-medium text-gray-900">
                                                {t('status')}:{' '}
                                                {t('user_cancelled')}
                                                <time dateTime="2021-03-24">
                                                    {formatDateString(
                                                        eventOrder.created_at.toString(),
                                                    )}
                                                </time>
                                            </p>
                                            <div
                                                className="mt-6"
                                                aria-hidden="true"
                                            >
                                                <div className="overflow-hidden rounded-full bg-gray-200">
                                                    <div className="h-2 rounded-full bg-red-400"></div>
                                                </div>
                                                <div className="mt-6 hidden grid-cols-4 text-sm font-medium text-gray-600 sm:grid">
                                                    <div className="text-beer-draft">
                                                        {t('user_cancelled')}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                            {/* <!-- More products... --> */}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
