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

                    <div className="">
                        <Link
                            href={{
                                pathname: `${ROUTE_EVENTS}/${eventId}/event_basket/`,
                                query: { items: JSON.stringify(items) },
                            }}
                            className="flex items-center justify-center rounded-lg bg-beer-blonde px-6 py-3 text-white font-semibold hover:bg-beer-dark transition-all"
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
