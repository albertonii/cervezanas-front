import Image from 'next/image';
import Draggable from 'react-draggable';
import MaxifiedCart from './MaxifiedCart';
import Title from '@/app/[locale]/components/ui/Title';
import useEventCartStore from '@/app/store/eventCartStore';
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
        x: typeof window !== 'undefined' ? window.innerWidth / 2 - 150 : 0, // Centrar horizontalmente (ajusta 150 si el ancho es 300)
        y: 0, // Mantener Y en 0
    });

    useEffect(() => {
        if (!existEventCart(eventId)) {
            createNewCart(eventId);
        }
        setItems(eventCarts[eventId] || []);
    }, [eventCarts, eventId, existEventCart, createNewCart]);

    useEffect(() => {
        if (isOpen) {
            const adjustedPosition = adjustPositionWithinBounds(position.x);
            setPosition({ x: adjustedPosition, y: 0 });
        }
    }, [isOpen]);

    const onDragStop = (_e: any, data: any) => {
        const adjustedX = adjustPositionWithinBounds(data.x);
        setPosition({ x: adjustedX, y: 0 }); // Forzar Y a 0
    };

    const adjustPositionWithinBounds = (x: number) => {
        const { innerWidth } = window;

        const cartWidth = window.innerWidth < 640 ? innerWidth * 0.9 : 300; // 90% en móviles
        const adjustedX = Math.max(0, Math.min(x, innerWidth - cartWidth));

        return adjustedX;
    };

    return (
        <Draggable
            handle=".drag-handle"
            bounds={{
                left: 0,
                right:
                    typeof window !== 'undefined'
                        ? window.innerWidth < 640
                            ? window.innerWidth * 0.1 // Para 90% de ancho
                            : window.innerWidth - 300
                        : 0,
            }}
            position={position}
            onStop={onDragStop}
            axis="x" // Restringir a solo eje X
        >
            <section
                className="fixed z-40 rounded-lg border border-beer-softBlonde bg-white dark:bg-gray-800 dark:border-gray-700 shadow-lg  transition-colors duration-300"
                aria-modal="true"
                role="dialog"
                tabIndex={-1}
                style={{ top: 0 }} // Asegurar que esté alineado en Y=0
            >
                {/* Barra Arrastrable */}
                <div className="drag-handle flex items-center justify-between p-2 bg-beer-blonde dark:bg-gray-900 text-white font-semibold rounded-t-lg cursor-grab hover:cursor-grabbing">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-white dark:bg-gray-700 rounded-full shadow-md">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                className="w-4 h-4 sm:w-5 sm:h-5 text-beer-draft dark:text-gray-300"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 10h16M4 14h16"
                                />
                            </svg>
                        </div>
                        <Title size="large" color="beer-blonde">
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
                            className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                className="w-4 h-4 sm:w-5 sm:h-5 text-beer-draft dark:text-gray-300"
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
