// components/CPInformation.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import CPDetails from './CPDetails';
import ProductList from './ProductList';
import EventExperiences from './EventExperiences';
import { IConsumptionPointEvent } from '@/lib/types/consumptionPoints';
import { IEventExperience } from '@/lib/types/types';

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
        <section className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-6 mb-8">
            {/* Botón de Regreso */}
            <div className="flex justify-end">
                <Button
                    title={t('back_to_event')}
                    primary
                    small
                    onClick={handleBack}
                >
                    {t('back_to_event')}
                </Button>
            </div>

            {/* Experiencias del Evento */}
            {hasExperiences && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {t('experiences')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        {t('event_experience_participation_description', {
                            experiencesCounter: eventExperiences.length,
                        })}
                    </p>
                    <EventExperiences eventExperiences={eventExperiences} />
                </div>
            )}

            {/* Detalles del Punto de Consumo */}
            <div>
                <CPDetails cpEvent={cpEvent} />
            </div>

            {/* Lista de Productos */}
            <div>
                <ProductList cpEvent={cpEvent} eventId={eventId} />
            </div>
        </section>
    );
};

export default CPInformation;
