'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../../../../(auth)/Context/useAuth';
import { useLocale, useTranslations } from 'next-intl';
import { SupabaseProps } from '@/constants';
import { IOrder, IOrderItem } from '@/lib/types/types';
import { formatDateString } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import DisplayImageProduct from '@/app/[locale]/components/ui/DisplayImageProduct';

interface Props {
    isError?: boolean;
    order: IOrder;
}

const BASE_PRODUCTS_URL = SupabaseProps.BASE_PRODUCTS_URL;

export default function ErrorCheckout({ order, isError }: Props) {
    const { business_orders } = order;
    if (!business_orders) return <></>;

    const { order_items: orderItems } = business_orders[0];

    const t = useTranslations();
    const locale = useLocale();
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
            <section className="container mx-auto sm:py-4 lg:py-6">
                <div className=" space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0">
                    <div className="flex flex-col">
                        <div className="flex sm:items-baseline sm:space-x-4">
                            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                                Order Error
                            </h1>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            {!loading && (
                <section className="container mx-auto sm:py-4 lg:py-6">
                    <div className=" space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0">
                        <div className="flex flex-col">
                            <div className="flex sm:items-baseline sm:space-x-4">
                                <h1 className="text-xl font-extrabold tracking-tight text-beer-dark sm:text-2xl">
                                    {t('order_number')} #{order.order_number}
                                </h1>
                            </div>

                            {/* Order Status  */}
                            <div className="right-0 col-span-12 pr-12 md:col-span-4 md:mt-2 ">
                                <span className="text-lg font-medium text-beer-dark sm:text-xl">
                                    {t('order_status')}:
                                    <span className="ml-2 text-beer-draft">
                                        {t(order.status)}{' '}
                                    </span>
                                </span>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600">
                            {t('status_order_placed')}{' '}
                            <time
                                dateTime="2021-03-22"
                                className="font-medium text-gray-900"
                            >
                                {formatDateString(order.issue_date.toString())}
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
                                orderItems.map((item: IOrderItem) => (
                                    <div
                                        key={item.product_pack_id}
                                        className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
                                    >
                                        {item.product_packs && (
                                            <div className="relative grid grid-cols-12 gap-x-8 p-8 px-4 py-6 sm:px-6 lg:grid-cols-12 lg:gap-x-8 lg:p-8">
                                                {/* Product Multimedia  */}
                                                <div className="col-span-12 mt-6 flex justify-center sm:ml-6 md:col-span-2 md:mt-6">
                                                    <figure className="aspect-w-1 aspect-h-1 sm:aspect-none h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg lg:h-40 lg:w-40">
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
                                                    </figure>
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
                                                    <p className="mt-3 text-sm text-gray-500">
                                                        {t('description')} -{' '}
                                                        {
                                                            item.product_packs
                                                                .products
                                                                ?.description
                                                        }
                                                    </p>
                                                </div>

                                                {/* Shipping Information  */}
                                                {order && (
                                                    <div className="col-span-12 mt-6 md:col-span-4 lg:col-span-5">
                                                        <dt className="font-medium text-gray-900">
                                                            {t(
                                                                'shipping_address',
                                                            )}
                                                        </dt>

                                                        <dd className="mt-3 text-gray-500">
                                                            <span className="block">
                                                                {
                                                                    order.shipping_name
                                                                }{' '}
                                                                {
                                                                    order.shipping_lastname
                                                                }
                                                            </span>
                                                            <span className="block">
                                                                {
                                                                    order.shipping_address
                                                                }
                                                                ,{' '}
                                                                {
                                                                    order.shipping_city
                                                                }
                                                                ,
                                                                {
                                                                    order.shipping_zipcode
                                                                }
                                                                ,
                                                                {
                                                                    order.shipping_region
                                                                }{' '}
                                                                -{' '}
                                                                {
                                                                    order.shipping_sub_region
                                                                }
                                                                ,{' '}
                                                                {
                                                                    order.shipping_country
                                                                }
                                                            </span>

                                                            {order.shipping_address_extra && (
                                                                <>
                                                                    <span className="block">
                                                                        {
                                                                            order.shipping_address_extra
                                                                        }
                                                                    </span>
                                                                </>
                                                            )}
                                                        </dd>
                                                    </div>
                                                )}
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
                                                        order.issue_date.toString(),
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

                    {/* <!-- Billing --> */}
                    <div className="mt-16">
                        <h2 className="sr-only">{t('billing_summary')}</h2>

                        <div className="bg-gray-100 px-4 py-6 sm:rounded-lg sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-8">
                            {order && (
                                <dl className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-2 md:gap-x-8 lg:col-span-7">
                                    <address>
                                        <dt className="font-medium text-gray-900">
                                            {t('billing_address')}
                                        </dt>
                                        <dd className="mt-3 text-gray-500">
                                            <span className="block">
                                                {order.billing_name}{' '}
                                                {order.billing_lastname}
                                            </span>
                                            <span className="block">
                                                {order.billing_address},{' '}
                                                {order.billing_city},
                                                {order.billing_zipcode},
                                                {order.billing_sub_region} -{' '}
                                                {order.billing_region},{' '}
                                                {order.billing_country}
                                            </span>
                                        </dd>
                                    </address>
                                </dl>
                            )}

                            <dl className="mt-8 divide-y divide-gray-200 text-sm lg:col-span-5 lg:mt-0">
                                <div className="flex items-center justify-between pb-4">
                                    <dt className="text-gray-600">
                                        {t('subtotal')}
                                    </dt>
                                    <dd className="font-medium text-gray-900">
                                        {formatCurrency(order.subtotal)}
                                    </dd>
                                </div>

                                {order.promo_code && order.discount && (
                                    <div className="flex items-center justify-between pb-4">
                                        <dt className="text-gray-600">
                                            {t('discount')}
                                        </dt>
                                        <dd className="font-medium text-gray-900">
                                            {t('promo_code')} {order.promo_code}{' '}
                                            {' - '}{' '}
                                            {formatCurrency(order.discount)}
                                        </dd>
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-4">
                                    <dt className="font-medium text-gray-900">
                                        {t('total')}
                                    </dt>
                                    <dd className="font-medium text-beer-draft">
                                        {formatCurrency(order.total)}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
