import Image from 'next/image';
import Draggable from 'react-draggable';
import MaxifiedCart from './MaxifiedCart';
import Title from '@/app/[locale]/components/ui/Title';
import useEventCartStore from '@/app/store//eventCartStore';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IProductPackEventCartItem } from '@/lib/types/types';

interface Props {
    eventId: string;
}

export default function EventCart({ eventId }: Props) {
    const t = useTranslations('event');
    const { getCartQuantity, handleOpen } = useEventCartStore();
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
        <Draggable handle=".drag-handle" bounds="parent">
            <section
                className="fixed z-40 rounded-lg border-2 border-beer-softBlonde bg-beer-softFoam shadow-lg sm:w-auto bg-opacity-90"
                aria-modal="true"
                role="dialog"
                tabIndex={-1}
            >
                {/* Barra Arrastrable */}
                <div className="md:min-w-[240px] drag-handle flex items-center justify-between p-2 bg-beer-blonde text-white font-semibold rounded-t-lg cursor-grab hover:cursor-grabbing">
                    <div className="flex items-center gap-2">
                        {/* Ícono de mover */}
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

                        {/* Título */}
                        <Title size="large" color="black">
                            {t('shopping_cart')}
                        </Title>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Icono del carrito con cantidad */}
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

                        {/* Botón de minimizar */}
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
                <div className="p-2 flex justify-center">
                    {isOpen && <MaxifiedCart items={items} eventId={eventId} />}
                </div>
            </section>
        </Draggable>
    );
}
