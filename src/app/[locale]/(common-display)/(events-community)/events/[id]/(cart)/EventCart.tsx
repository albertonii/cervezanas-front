import Image from 'next/image';
import Draggable from 'react-draggable';
import MaxifiedCart from './MaxifiedCart';
import Title from '@/app/[locale]/components/ui/Title';
import useEventCartStore from '@/app/store//eventCartStore';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IProductPackEventCartItem } from '@/lib/types/types';

interface Props {
    eventId: string;
}

export default function EventCart({ eventId }: Props) {
    const t = useTranslations('event');
    const { getCartQuantity, handleOpen, isOpen } = useEventCartStore();
    const { eventCarts, existEventCart, createNewCart } = useEventCartStore();

    const [items, setItems] = useState<IProductPackEventCartItem[]>([]);
    const [position, setPosition] = useState<{ x: number; y: number }>({
        x: innerWidth / 2,
        y: -200,
    });

    useEffect(() => {
        if (!existEventCart(eventId)) {
            createNewCart(eventId);
        }
        setItems(eventCarts[eventId]);
    }, [eventCarts]);

    const adjustPositionWithinBounds = (x: number, y: number) => {
        const { innerWidth, innerHeight } = window;

        const adjustedX = Math.max(0, Math.min(x, innerWidth - 300)); // 300px es el ancho del carrito
        const adjustedY = Math.max(
            0,
            Math.min(y, innerHeight - (isOpen ? 400 : 50)),
        ); // Altura: 400px abierto, 50px minimizado

        return { x: adjustedX, y: adjustedY };
    };

    const onDragStop = (_e: any, data: any) => {
        const adjustedPosition = adjustPositionWithinBounds(data.x, data.y);
        setPosition(adjustedPosition);
    };

    useEffect(() => {
        if (isOpen) {
            const adjustedPosition = adjustPositionWithinBounds(
                position.x,
                position.y,
            );
            setPosition(adjustedPosition);
        }
    }, [isOpen]);

    return (
        <Draggable
            handle=".drag-handle"
            bounds="parent"
            position={position}
            onStop={onDragStop}
        >
            <section
                className="fixed z-40 rounded-lg border-2 border-beer-softBlonde bg-white shadow-lg sm:w-auto"
                aria-modal="true"
                role="dialog"
                tabIndex={-1}
            >
                {/* Barra Arrastrable */}
                <div className="drag-handle flex items-center justify-between p-2 bg-beer-blonde text-white font-semibold rounded-t-lg cursor-grab hover:cursor-grabbing">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-white rounded-full shadow-md">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                className="w-4 h-4 sm:w-5 sm:h-5 text-beer-draft"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 10h16M4 14h16"
                                />
                            </svg>
                        </div>
                        <Title size="large" color="black">
                            {t('shopping_cart')}
                        </Title>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Image
                                src={'/icons/shopping-cart.svg'}
                                loader={() => '/icons/shopping-cart.svg'}
                                alt={'Shopping Cart'}
                                className="rounded-full w-9 h-9 sm:w-12 sm:h-12"
                                width={48}
                                height={48}
                            />
                            <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold shadow-md">
                                {getCartQuantity(eventId)}
                            </span>
                        </div>
                        <button
                            onClick={() => handleOpen(!isOpen)}
                            className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-100 hover:bg-gray-300 transition-all"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                className="w-4 h-4 sm:w-5 sm:h-5 text-beer-draft"
                            >
                                {isOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 12H5"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 4v16m8-8H4"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Contenido del carrito */}
                {isOpen && <MaxifiedCart items={items} eventId={eventId} />}
            </section>
        </Draggable>
    );
}
