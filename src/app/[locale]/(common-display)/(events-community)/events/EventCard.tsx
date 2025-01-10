'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ROUTE_EVENTS } from '@/config';
import { IEvent } from '@/lib/types/eventOrders';
import { formatDateString } from '@/utils/formatDate';
import { useLocale, useTranslations } from 'next-intl';
import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@/app/[locale]/components/ui/buttons/IconButton';

interface EventCardProps {
    event: IEvent;
}

const EventCard = ({ event }: EventCardProps) => {
    const t = useTranslations('event');
    const locale = useLocale();

    // 1. Verificamos si la fecha de hoy está entre start_date y end_date
    const now = new Date();
    const start = new Date(event.start_date);
    const end = new Date(event.end_date);

    const isActive = now >= start && now <= end;

    return (
        <div
            className={`
                bg-white dark:bg-gray-800 
                rounded-lg shadow-md 
                hover:shadow-lg transition-shadow duration-300 
                flex flex-col
                // 2. Aplicamos estilos condicionales si está inactivo
                ${!isActive ? 'opacity-60 pointer-events-none' : ''}
            `}
        >
            {/* Imagen del Evento */}
            <div className="relative h-48">
                <Image
                    src={event.logo_url || '/assets/mentalpie.jpg'}
                    alt={event.name}
                    fill
                    className="object-cover transition-transform duration-300 transform hover:scale-105"
                />
                <div className="absolute inset-0 bg-black opacity-25"></div>
                <div className="absolute bottom-0 left-0 p-2">
                    <span className="bg-yellow-500 dark:bg-yellow-800 text-white text-sm px-2 py-1 rounded">
                        {t(event.category)}
                    </span>
                </div>
            </div>

            {/* Detalles del Evento */}
            <div className="p-4 flex flex-col flex-1">
                {/* Nombre del Evento */}
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    <Link href={`${ROUTE_EVENTS}/${event.id}`} locale={locale}>
                        {event.name}
                    </Link>
                </h3>

                {/* Fechas y Ubicación */}
                <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm mb-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    <span>
                        {formatDateString(event.start_date)} -{' '}
                        {formatDateString(event.end_date)}
                    </span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 12.414a2 2 0 00-2.828 0L6.343 16.657a2 2 0 002.828 2.828L12 15.414l3.829 3.829a2 2 0 002.828-2.828z"
                        />
                    </svg>
                    <span>{event.address}</span>
                </div>

                {/* Descripción del Evento */}
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                    {event.description}
                </p>

                {/* Botón de Más Información */}
                <div className="mt-auto flex justify-end">
                    <Link href={`${ROUTE_EVENTS}/${event.id}`} locale={locale}>
                        <IconButton
                            primary
                            icon={faChevronCircleRight}
                            title={'more_info'}
                        >
                            {t('more_info')}
                        </IconButton>
                    </Link>
                </div>
            </div>

            {/* Footer con Reseñas y Redes Sociales */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                {/* Reseñas */}
                <div className="flex items-center text-yellow-500 dark:text-yellow-300">
                    {[...Array(5)].map((_, index) => (
                        <svg
                            key={index}
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                </div>

                {/* (Opcional) Indicador de evento inactivo o finalizado */}
                {!isActive && (
                    <span className="text-red-500 text-sm font-medium">
                        {t('event_inactive')}
                    </span>
                )}

                {/* Si quieres tus redes sociales, descomenta el bloque de abajo */}
                {/* <div className="flex space-x-3">...</div> */}
            </div>
        </div>
    );
};

export default EventCard;
