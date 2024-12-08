// EventCard.tsx

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import { ROUTE_EVENTS } from '@/config';
import { ChevronRight } from 'lucide-react';
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

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
            {/* Imagen del Evento */}
            <div className="relative h-48">
                <Image
                    src={event.logo_url || '/assets/default_event.jpg'}
                    alt={event.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 transform hover:scale-105"
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

                {/* Redes Sociales */}
                {/* <div className="flex space-x-3">
                    {event.social_links.facebook && (
                        <a
                            href={event.social_links.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 transition-colors duration-200"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.325 24h11.495v-9.294H9.691V11.08h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.764v2.312h3.588l-.467 3.626h-3.121V24h6.116C23.403 24 24 23.403 24 22.674V1.326C24 .597 23.403 0 22.675 0z" />
                            </svg>
                        </a>
                    )}
                    {event.social_links.twitter && (
                        <a
                            href={event.social_links.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Twitter"
                            className="text-blue-400 dark:text-blue-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.38 4.482A13.944 13.944 0 011.671 3.149a4.916 4.916 0 001.523 6.573A4.897 4.897 0 01.964 9.1v.06a4.916 4.916 0 003.946 4.814 4.902 4.902 0 01-2.224.084 4.918 4.918 0 004.588 3.417A9.867 9.867 0 010 19.54a13.94 13.94 0 007.548 2.212c9.056 0 14-7.496 14-13.986 0-.213-.005-.425-.014-.636A10.012 10.012 0 0024 4.557z" />
                            </svg>
                        </a>
                    )}
                    {event.social_links.instagram && (
                        <a
                            href={event.social_links.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="text-pink-500 dark:text-pink-400 hover:text-pink-600 dark:hover:text-pink-500 transition-colors duration-200"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M7.75 2h8.5C19.193 2 22 4.807 22 8.25v7.5C22 19.193 19.193 22 15.25 22h-8.5C4.807 22 2 19.193 2 15.75v-7.5C2 4.807 4.807 2 7.75 2zm0 2C5.679 4 4 5.679 4 7.75v7.5C4 18.321 5.679 20 7.75 20h8.5C18.321 20 20 18.321 20 16.25v-7.5C20 5.679 18.321 4 16.25 4h-8.5z" />
                                <path d="M12 7a3 3 0 100-6 3 3 0 000 6zM12 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                            </svg>
                        </a>
                    )}
                </div> */}
            </div>
        </div>
    );
};

export default EventCard;
