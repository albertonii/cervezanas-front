import { SupabaseProps } from '@/constants';
import { IOrderItem } from '@/lib/types/types';
import { formatCurrency } from '@/utils/formatCurrency';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';
import DisplayImageProduct from './common/DisplayImageProduct';

const BASE_PRODUCTS_URL = SupabaseProps.BASE_PRODUCTS_URL;

interface Props {
    orderItem: IOrderItem;
}

const OrderItemCard = ({ orderItem }: Props) => {
    const t = useTranslations();
    const locale = useLocale();

    const orderItemQuantity = orderItem.quantity;
    const productPackPrice = orderItem.product_packs?.price || 0;
    const productPackQuantity = orderItem.product_packs?.quantity;
    const total = orderItemQuantity * productPackPrice;

    return (
        <fieldset className="grid grid-cols-1 justify-between gap-2 rounded-lg border border-gray-200 sm:space-x-4 sm:p-4 lg:grid-cols-2 lg:space-x-2 lg:p-6 ">
            <legend className="text-lg">{t('product_information')}</legend>

            <section className="col-span-2 flex flex-row gap-2 md:col-span-3 grid grid-cols-2">
                <div className="w-full col-span-2 md:col-span-1 flex">
                    <figure className="aspect-w-1 aspect-h-1 sm:aspect-none col-span-2 h-20 w-auto flex-shrink-0 justify-center overflow-hidden rounded-lg md:col-span-1 lg:h-32 ">
                        <DisplayImageProduct
                            width={120}
                            height={120}
                            alt={''}
                            imgSrc={`${
                                BASE_PRODUCTS_URL +
                                decodeURIComponent(
                                    orderItem.product_packs?.img_url,
                                )
                            }`}
                            class="h-full w-full object-cover object-center"
                        />
                    </figure>

                    <div>
                        <span className="space-y-1">
                            <p className="text-sm text-gray-500">
                                {t('product_name')}
                            </p>

                            <p className="text-medium truncate font-bold text-gray-900 hover:text-beer-draft ">
                                <Link
                                    href={`/products/${orderItem.product_packs?.product_id}`}
                                    locale={locale}
                                    target={'_blank'}
                                >
                                    {orderItem.product_packs?.name}
                                </Link>
                            </p>
                        </span>

                        <span className="space-y-1">
                            <p className="text-sm text-gray-500">
                                {t('product_price')}
                            </p>
                            <p className="text-medium truncate font-medium text-gray-900 hover:text-beer-draft">
                                {formatCurrency(productPackPrice)}
                            </p>
                        </span>

                        <span className="space-y-1">
                            <p className="text-sm text-gray-500">
                                {t('quantity_in_pack')}
                            </p>
                            <p className="truncate">
                                {productPackQuantity} {t('units')}
                            </p>
                        </span>

                        <span className="space-y-1">
                            <p className="text-sm text-gray-500">
                                {t('quantity_bought')}
                            </p>
                            <p className="truncate">
                                {orderItemQuantity} {t('packs')}
                            </p>
                        </span>
                    </div>
                </div>

                <div className="w-full self-center col-span-2 md:col-span-1">
                    <span className="space-y-1 text-center">
                        <p className="text-base text-gray-500 md:text-xl">
                            {t('total')}
                        </p>
                        <p className="truncate text-base font-semibold md:text-2xl">
                            {formatCurrency(total)}
                        </p>
                    </span>
                </div>
            </section>
        </fieldset>
    );
};

export default OrderItemCard;
