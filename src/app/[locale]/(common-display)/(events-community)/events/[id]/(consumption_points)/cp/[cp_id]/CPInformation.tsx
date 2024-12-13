'use client';

import ProductList from './ProductList';
import EventExperiences from './EventExperiences';
import CPDetailsHeader from './CPDetailsHeader';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import React from 'react';
import { useRouter } from 'next/navigation';
import { IEventExperience } from '@/lib/types/types';
import { useLocale, useTranslations } from 'next-intl';
import { IConsumptionPointEvent } from '@/lib/types/consumptionPoints';

interface Props {
    cpEvent: IConsumptionPointEvent;
    eventId: string;
    eventExperiences: IEventExperience[];
}

const CPInformation: React.FC<Props> = ({
    cpEvent,
    eventExperiences,
    eventId,
}) => {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();

    const hasExperiences = eventExperiences.length > 0;

    const handleBack = () => {
        router.push(`/${locale}/events/${eventId}`);
    };

    return (
        <section className="relative w-full max-w-7xl lg:max-w-none mx-auto px-2 sm:px-6 lg:px-8 py-8">
            {/* Contenedor Principal con Sombras Mejoradas */}
            <div className="shadow-2xl relative w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl transition-shadow duration-500">
                {/* Botón de Regreso */}
                <div className="flex justify-end p-6">
                    <Button
                        title={t('back_to_event')}
                        primary
                        small
                        onClick={handleBack}
                    >
                        {t('back_to_event')}
                    </Button>
                </div>

                {/* Contenido Principal */}
                <div className="space-y-6 p-2 sm:p-6">
                    {/* Experiencias del Evento */}
                    {hasExperiences && (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl shadow-lg p-2 sm:p-6">
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                                {t('experiences')}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                {t(
                                    'event_experience_participation_description',
                                    {
                                        experiencesCounter:
                                            eventExperiences.length,
                                    },
                                )}
                            </p>
                            <EventExperiences
                                eventExperiences={eventExperiences}
                            />
                        </div>
                    )}

                    {/* Detalles del Punto de Consumo */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl shadow-lg p-2 sm:p-6">
                        <CPDetailsHeader cpEvent={cpEvent} />
                    </div>

                    {/* Lista de Productos */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl shadow-lg p-2 sm:p-6">
                        <ProductList cpEvent={cpEvent} eventId={eventId} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CPInformation;
