import Link from 'next/link';
import EventProduct from './EventProduct';
import Label from '@/app/[locale]/components/ui/Label';
import React, { useEffect, useState } from 'react';
import EventEmptyCart from '@/app/[locale]/(common-display)/cart/shopping_basket/EvemtEmptyCart';
import { ROUTE_EVENTS } from '@/config';
import { useLocale, useTranslations } from 'next-intl';
import { formatCurrency } from '@/utils/formatCurrency';
import { IProductPackEventCartItem } from '@/lib/types/types';

interface Props {
    items: IProductPackEventCartItem[];
    eventId: string;
}

export default function MaxifiedCart({ items, eventId }: Props) {
    const t = useTranslations();
    const locale = useLocale();
    const [subTotal, setSubTotal] = useState(0);

    useEffect(() => {
        const total = items.reduce(
            (acc, item) =>
                acc +
                item.packs.reduce(
                    (packTotal, pack) => packTotal + pack.price * pack.quantity,
                    0,
                ),
            0,
        );
        setSubTotal(total);
    }, [items]);

    return (
        <div className="relative flex flex-col items-center p-4 bg-white rounded-xl shadow-xl transition-transform">
            {/* Content */}
            <section className="w-full space-y-4">
                {items?.length === 0 ? (
                    <EventEmptyCart />
                ) : (
                    items.map((item) => (
                        <EventProduct
                            key={item.product_id}
                            item={item}
                            eventId={eventId}
                        />
                    ))
                )}
            </section>

            {/* Footer */}
            {items?.length > 0 && (
                <footer className="w-full mt-4 border-t pt-4">
                    <div className="flex justify-between text-lg font-medium text-gray-900">
                        <Label size="medium" font="semibold" color="black">
                            {t('subtotal')}
                        </Label>
                        <Label size="large">{formatCurrency(subTotal)}</Label>
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
        </div>
    );
}
