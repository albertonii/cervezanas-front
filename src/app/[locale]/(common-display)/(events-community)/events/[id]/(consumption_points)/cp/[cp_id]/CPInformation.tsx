// components/CPInformation.tsx
'use client';

import CPDetails from './CPDetails';
import ProductList from './ProductList';
import EventExperiences from './EventExperiences';
import React from 'react';
import { ROUTE_EVENTS } from '@/config';
import { useRouter } from 'next/navigation';
import { IEventExperience } from '@/lib/types/types';
import { useLocale, useTranslations } from 'next-intl';
import { IConsumptionPointEvent } from '@/lib/types/consumptionPoints';
import Title from '@/app/[locale]/components/ui/Title';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import Label from '@/app/[locale]/components/ui/Label';

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

    const experiencesCounter = eventExperiences.length;

    const handleOnClickEventComeBack = () => {
        router.push(`/${locale}${ROUTE_EVENTS}/${eventId}`);
    };

    return (
        <section
            className="relative w-full rounded-lg bg-white p-8 shadow-md bg-cover bg-center bg-no-repeat mb-8"
            style={{ backgroundImage: "url('/assets/rec-graf2b.png')" }}
        >
            {/* Botón de Regreso */}
            <div className="flex justify-end">
                <Button
                    title={'come_back_event'}
                    primary
                    small
                    onClick={handleOnClickEventComeBack}
                >
                    {t('back_to_event')}
                </Button>
            </div>

            {/* Experiencias del Evento */}
            {experiencesCounter > 0 && (
                <section className="mt-6">
                    <Title size="xlarge">{t('experiences')}</Title>
                    <Label size="medium" color="gray">
                        {t('event_experience_participation_description', {
                            experiencesCounter: experiencesCounter,
                        })}
                    </Label>
                    <EventExperiences eventExperiences={eventExperiences} />
                </section>
            )}

            {/* Detalles del Punto de Consumo */}
            <section className="mt-8">
                <CPDetails cpEvent={cpEvent} />
            </section>

            {/* Lista de Productos */}
            <section className="mt-6">
                <ProductList cpEvent={cpEvent} eventId={eventId} />
            </section>
        </section>
    );
};

export default CPInformation;
