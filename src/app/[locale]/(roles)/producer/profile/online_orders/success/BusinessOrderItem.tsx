import Link from 'next/link';
import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { SupabaseProps } from '../../../../../../../constants';
import {
    IBusinessOrder,
    IOrderItem,
} from '../../../../../../../lib/types/types';
import DisplayImageProduct from '../../../../../components/common/DisplayImageProduct';
import { formatCurrency } from '../../../../../../../utils/formatCurrency';
import { StatusTimeline } from '../../../../../components/StatusTimeline';
import DisplayImageProfile from '../../../../../components/common/DisplayImageProfile';

const BASE_PRODUCTS_URL = SupabaseProps.BASE_PRODUCTS_URL;

interface Props {
    bOrder: IBusinessOrder;
    setPackStatusArray: React.Dispatch<React.SetStateAction<string[]>>;
    index: number;
}

export default function BusinessOrderItem({ bOrder }: Props) {
    const t = useTranslations();
    const locale = useLocale();

    const orderItems = bOrder.order_items;

    console.log(orderItems);

    if (!orderItems || orderItems.length === 0) return <></>;

    return (
        <section className="relative border-separate space-y-8 rounded-lg border p-2">
            <StatusTimeline
                status={bOrder.status}
                orderType={'distributor_online'}
            />

            <section className="grid grid-cols-1 gap-x-2 space-y-4 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-2 lg:gap-x-4">
                {/* Display the product information for this pack  */}
                {orderItems && (
                    <div className="col-span-2">
                        <h3 className="text-xl font-medium text-gray-900 hover:text-beer-draft">
                            <Link
                                href={`/products/${orderItems?.[0].product_packs?.products?.id}`}
                                locale={locale}
                            >
                                {t('name')}:{' '}
                                {orderItems?.[0].product_packs?.products?.name}
                            </Link>
                        </h3>

                        <span className="space-y-1">
                            <p className="text-sm text-gray-500">
                                {t('description')}
                            </p>
                            <p className="truncate">
                                {
                                    orderItems[0].product_packs?.products
                                        ?.description
                                }
                            </p>
                        </span>
                    </div>
                )}

                {orderItems?.map((orderItem: IOrderItem) => {
                    if (!orderItem.product_packs) return <></>;

                    return (
                        <fieldset
                            className="grid grid-cols-1 justify-between gap-2 rounded-lg border border-gray-200 sm:space-x-4 sm:p-4 lg:grid-cols-4 lg:space-x-2 lg:p-6"
                            key={
                                orderItem.business_order_id +
                                '-' +
                                orderItem.product_pack_id
                            }
                        >
                            <legend className="text-lg">
                                {orderItem.product_packs.name}
                            </legend>

                            <figure className="aspect-w-1 aspect-h-1 sm:aspect-none col-span-2 h-20 w-auto flex-shrink-0 justify-center overflow-hidden rounded-lg md:col-span-1 lg:h-32 ">
                                <DisplayImageProduct
                                    width={120}
                                    height={120}
                                    alt={''}
                                    imgSrc={`${
                                        BASE_PRODUCTS_URL +
                                        decodeURIComponent(
                                            orderItem.product_packs.img_url,
                                        )
                                    }`}
                                    class="h-full w-full object-cover object-center"
                                />
                            </figure>

                            <section className="col-span-2 flex flex-row gap-2 md:col-span-3">
                                <div className="w-full">
                                    <span className="space-y-1">
                                        <p className="text-sm text-gray-500">
                                            {t('product_price')}
                                        </p>
                                        <p className="text-medium truncate font-medium text-gray-900 hover:text-beer-draft">
                                            {formatCurrency(
                                                orderItem.product_packs.price,
                                            )}
                                        </p>
                                    </span>

                                    <span className="space-y-1">
                                        <p className="text-sm text-gray-500">
                                            {t('quantity_in_pack')}
                                        </p>
                                        <p className="truncate">
                                            {orderItem.product_packs.quantity}{' '}
                                            {t('units')}
                                        </p>
                                    </span>

                                    <span className="space-y-1">
                                        <p className="text-sm text-gray-500">
                                            {t('quantity_bought')}
                                        </p>
                                        <p className="truncate">
                                            {orderItem.quantity} {t('packs')}
                                        </p>
                                    </span>
                                </div>

                                <div className="w-full self-center">
                                    <span className="space-y-1 text-center">
                                        <p className="text-base text-gray-500 md:text-xl">
                                            {t('total')}
                                        </p>
                                        <p className="truncate text-base font-semibold md:text-2xl">
                                            {formatCurrency(
                                                orderItem.quantity *
                                                    orderItem.product_packs
                                                        .price,
                                            )}
                                        </p>
                                    </span>
                                </div>
                            </section>
                        </fieldset>
                    );
                })}

                {/* Distributor information data  */}
                {bOrder.distributor_user && (
                    <fieldset className="grid grid-cols-1 justify-between gap-2 rounded-lg border border-gray-200 sm:space-x-4 sm:p-4 lg:grid-cols-2 lg:space-x-2 lg:p-6">
                        <legend className="text-lg">
                            {t('distributor_information')}
                        </legend>

                        <section className="flex space-x-4">
                            <figure className="aspect-w-1  aspect-h-1 sm:aspect-none col-span-2 h-20 w-auto flex-shrink-0 justify-center overflow-hidden rounded-lg md:col-span-1 lg:h-32 ">
                                <DisplayImageProfile
                                    width={100}
                                    height={100}
                                    imgSrc={
                                        bOrder.distributor_user.users
                                            ?.avatar_url ?? ''
                                    }
                                    class={''}
                                />
                            </figure>

                            <div className="col-span-2 flex flex-col md:col-span-1">
                                <span className="space-y-1">
                                    <p className="text-sm text-gray-500">
                                        {t('username')}
                                    </p>
                                    <p className="text-medium truncate font-medium text-gray-900 hover:text-beer-draft">
                                        <Link
                                            href={`/d-info/${bOrder.distributor_id}`}
                                            locale={locale}
                                            target={'_blank'}
                                        >
                                            {
                                                bOrder.distributor_user?.users
                                                    ?.username
                                            }
                                        </Link>
                                    </p>
                                </span>

                                <span className="space-y-1">
                                    <p className="text-sm text-gray-500">
                                        {t('fullname')}
                                    </p>
                                    <p className="truncate">
                                        {bOrder.distributor_user?.users?.name}
                                    </p>
                                    <p className="truncate ">
                                        {
                                            bOrder.distributor_user?.users
                                                ?.lastname
                                        }
                                    </p>
                                </span>

                                <span className="space-y-1">
                                    <p className="text-sm text-gray-500">
                                        {t('email')}
                                    </p>
                                    <p className="truncate">
                                        {bOrder.distributor_user?.users?.email}
                                    </p>
                                </span>
                            </div>
                        </section>
                    </fieldset>
                )}
            </section>
        </section>
    );
}
