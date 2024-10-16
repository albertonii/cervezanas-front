import Link from 'next/link';
import EventProduct from './EventProduct';
import useEventCartStore from '@/app/store//eventCartStore';
import EmptyCart from '../../../../cart/shopping_basket/EmptyCart';
import React, { useEffect, useState } from 'react';
import { ROUTE_EVENTS } from '@/config';
import { useLocale, useTranslations } from 'next-intl';
import { formatCurrency } from '@/utils/formatCurrency';
import { IProductPackEventCartItem } from '@/lib/types/types';
import Button from '@/app/[locale]/components/ui/buttons/Button';

interface Props {
    items: IProductPackEventCartItem[];
    eventId: string;
}

export default function MaxifiedCart({ items, eventId }: Props) {
    const t = useTranslations();
    const locale = useLocale();

    const { handleOpen } = useEventCartStore();

    const [subTotal, setSubTotal] = useState(0);

    useEffect(() => {
        let total = 0;

        items.find((item) => {
            item.packs.map((pack) => {
                total += pack.price * pack.quantity;
            });
        });

        setSubTotal(total);
        () => {
            setSubTotal(0);
        };
    }, [items]);

    return (
        <div className={`relative flex flex-col items-center transition-all`}>
            <h1 className="text-xl font-medium text-gray-900">
                {t('shopping_cart')}
            </h1>

            <Button
                onClick={() => handleOpen(true)}
                class="absolute right-0 top-0"
            >
                <span className="sr-only">{t('close_cart')}</span>

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-6 w-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </Button>

            <section className="w-full space-y-6">
                <div className="space-y-4">
                    {items?.length === 0 ? (
                        <EmptyCart />
                    ) : (
                        <>
                            {items &&
                                items?.map((item) => (
                                    <>
                                        <div
                                            key={item.product_id}
                                            className="flex items-center gap-4"
                                        >
                                            <EventProduct
                                                item={item}
                                                eventId={eventId}
                                            />
                                        </div>
                                    </>
                                ))}
                        </>
                    )}
                </div>

                {items?.length > 0 && (
                    <footer className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                            <p>{t('subtotal')}</p>

                            <p className="text-xl">
                                {formatCurrency(subTotal)}
                            </p>
                        </div>

                        <p className="mt-0.5 text-sm text-gray-500">
                            {t('go_to_checkout_for_final_price')}
                        </p>

                        <div className="mt-2">
                            <Link
                                href={{
                                    pathname: `${ROUTE_EVENTS}/${eventId}/event_basket/`,
                                    query: { items: JSON.stringify(items) },
                                }}
                                className="flex items-center justify-center rounded-md border border-transparent bg-beer-blonde px-6 py-3 text-xl font-medium text-white shadow-sm transition-all hover:bg-beer-dark hover:text-beer-blonde"
                                locale={locale}
                            >
                                {t('checkout')}
                            </Link>
                        </div>
                    </footer>
                )}
            </section>
        </div>
    );
}
