import MinimizedCart from './MinimizedCart';
import MaxifiedCart from './MaxifiedCart';
import useEventCartStore from '../../../../../../store/eventCartStore';
import React, { useEffect, useState } from 'react';
import { IProductPackEventCartItem } from '../../../../../../../lib/types/types';

interface Props {
    eventId: string;
}

export default function EventCart({ eventId }: Props) {
    const [isMinimized, setIsMinimized] = React.useState<boolean>(false);

    const { eventCarts, existEventCart, createNewCart } = useEventCartStore();

    const [items, setItems] = useState<IProductPackEventCartItem[]>([]);

    useEffect(() => {
        if (!existEventCart(eventId)) {
            createNewCart(eventId);
        }

        setItems(eventCarts[eventId]);
    }, [eventCarts]);

    return (
        <section
            className={`fixed bottom-0 right-0  z-40 rounded-lg border-2 border-beer-softBlonde bg-beer-softFoam px-2 py-2 shadow-md  sm:w-auto bg-opacity-90`}
            aria-modal="true"
            role="dialog"
            tabIndex={-1}
        >
            {isMinimized ? (
                <MinimizedCart
                    eventId={eventId}
                    setIsMinimized={setIsMinimized}
                />
            ) : (
                <MaxifiedCart
                    setIsMinimized={setIsMinimized}
                    items={items}
                    eventId={eventId}
                />
            )}
        </section>
    );
}
