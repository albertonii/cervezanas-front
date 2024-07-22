import MinimizedCart from './MinimizedCart';
import MaxifiedCart from './MaxifiedCart';
import useEventCartStore from '@/app/store//eventCartStore';
import React, { useEffect, useState } from 'react';
import { IProductPackEventCartItem } from '@/lib/types/types';

interface Props {
    eventId: string;
}

export default function EventCart({ eventId }: Props) {
    const { eventCarts, existEventCart, createNewCart, isOpen } =
        useEventCartStore();

    const [items, setItems] = useState<IProductPackEventCartItem[]>([]);

    useEffect(() => {
        if (!existEventCart(eventId)) {
            createNewCart(eventId);
        }

        setItems(eventCarts[eventId]);
    }, [eventCarts]);

    return (
        <section
            className={`fixed bottom-0 right-0  z-40 rounded-lg border-2 border-beer-softBlonde bg-beer-softFoam px-2 py-2 shadow-md  sm:w-auto bg-opacity-90 mt-32`}
            aria-modal="true"
            role="dialog"
            tabIndex={-1}
        >
            {isOpen ? (
                <MinimizedCart eventId={eventId} />
            ) : (
                <MaxifiedCart items={items} eventId={eventId} />
            )}
        </section>
    );
}
