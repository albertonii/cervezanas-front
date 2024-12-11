import EventOrderItems from './EventOrderItems';
import Title from '@/app/[locale]/components/ui/Title';
import useEventCartStore from '@/app/store/eventCartStore';
import EventEmptyCart from '@/app/[locale]/(common-display)/cart/shopping_basket/EvemtEmptyCart';
import React from 'react';
import { useTranslations } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

interface Props {
    eventId: string;
    subtotal: number;
}

const EventBasketItems = ({ eventId, subtotal }: Props) => {
    const t = useTranslations();

    const { eventCarts } = useEventCartStore();

    return (
        <section className="relative w-full  pt-6 bg-white dark:bg-gray-800 rounded-lg shadow space-y-6">
            <FontAwesomeIcon
                icon={faShoppingCart}
                title={'Shipping Info Icon'}
                className="text-beer-blonde absolute top-4 left-4 lg:-top-1 lg:-left-1 bg-white p-2 rounded-full shadow-lg"
                size="2xl"
            />

            <Title size="large" color="black">
                {t('customer_s_cart')}
            </Title>

            {eventCarts[eventId]?.length > 0 ? (
                <EventOrderItems eventId={eventId} subtotal={subtotal} />
            ) : (
                <>
                    <EventEmptyCart />
                </>
            )}
        </section>
    );
};

export default EventBasketItems;
