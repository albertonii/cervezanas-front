import useEventCartStore from '@/app/store/eventCartStore';
import EmptyCart from '@/app/[locale]/(common-display)/cart/shopping_basket/EmptyCart';
import React from 'react';
import { useTranslations } from 'next-intl';
import { EventCheckoutItem } from './EventCheckoutItem';
import { formatCurrency } from '@/utils/formatCurrency';

interface Props {
    eventId: string;
    subtotal: number;
}

const EventBasketItems = ({ eventId, subtotal }: Props) => {
    const t = useTranslations();

    const { eventCarts } = useEventCartStore();

    return (
        <div className="border-product-softBlonde flex w-full flex-col items-start justify-start border bg-gray-50 px-4 py-4 dark:bg-gray-800 md:p-6 md:py-6 xl:p-8">
            <p className="text-lg font-semibold leading-6 text-gray-800 dark:text-white md:text-xl xl:leading-5">
                {t('customer_s_cart')}
            </p>

            {eventCarts[eventId]?.length > 0 ? (
                <div className="w-full">
                    {eventCarts[eventId].map((productPack) => {
                        return (
                            <div key={productPack.id}>
                                <EventCheckoutItem
                                    eventId={eventId}
                                    productPack={productPack}
                                />
                            </div>
                        );
                    })}

                    {/* Subtotal */}
                    <div className="mt-4 flex w-full flex-row items-center justify-between">
                        <div className="flex flex-col items-start justify-start space-y-2">
                            <div className="text-2xl text-gray-500">
                                {t('subtotal')}

                                <span className="ml-6 font-semibold text-gray-800">
                                    {formatCurrency(subtotal)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <EmptyCart />
                </>
            )}
        </div>
    );
};

export default EventBasketItems;
