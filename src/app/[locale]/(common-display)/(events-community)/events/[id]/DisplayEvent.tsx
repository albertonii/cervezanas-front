'use client';

import Title from '@/app/[locale]/components/ui/Title';
import Label from '@/app/[locale]/components/ui/Label';
import useEventCartStore from '@/app/store/eventCartStore';
import Button from '@/app/[locale]/components/ui/buttons/Button';
import React, { useEffect } from 'react';
import { ROUTE_EVENTS } from '@/config';
import { useRouter } from 'next/navigation';
import { IEvent } from '@/lib/types/eventOrders';
import { IEventExperience } from '@/lib/types/types';
import { formatDateString } from '@/utils/formatDate';
import { useLocale, useTranslations } from 'next-intl';
import { IBMExperienceParticipants } from '@/lib/types/quiz';
import ConsumptionPointsTable from './ConsumptionPointsTable';
import { IConsumptionPointEvent } from '@/lib/types/consumptionPoints';
import GoogleMapLocationForEvent from '@/app/[locale]/components/common/GoogleMapLocationForEvent';
import { ChipCard } from '@/app/[locale]/components/ui/ChipCard';

interface Props {
    event: IEvent;
    cpsEvents: IConsumptionPointEvent[];
    eventExperiences: IEventExperience[];
    experienceParticipant: IBMExperienceParticipants[];
}

export default function DisplayEvent({
    event,
    cpsEvents,
    eventExperiences,
    experienceParticipant,
}: Props) {
    const t = useTranslations('event');
    const locale = useLocale();
    const router = useRouter();

    const { existEventCart, createNewCart } = useEventCartStore();

    useEffect(() => {
        if (!existEventCart(event.id)) {
            createNewCart(event.id);
        }
    }, [existEventCart, createNewCart, event]);

    const BMExperiencesCount: number =
        eventExperiences?.filter(
            (exp) => exp.experiences?.type === 'beer_master',
        ).length ?? 0;

    const BMExperienceParticipantCount: number =
        experienceParticipant?.filter(
            (participant) => participant.is_paid && participant.is_finished,
        ).length ?? 0;

    const BMExperienceParticipantTotalScore: number =
        experienceParticipant?.reduce(
            (acc, participant) =>
                participant.is_paid && participant.is_finished
                    ? acc + participant.score
                    : acc,
            0,
        );

    const handleOnClickEventComeBack = () => {
        router.push(`/${locale}${ROUTE_EVENTS}`);
    };

    return (
        <section className="relative w-full max-w-7xl lg:max-w-none mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Contenedor Principal con Sombras Mejoradas */}
            <div className="shadow-2xl relative w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl transition-shadow duration-500">
                {/* Botón de Volver */}
                <div className="flex justify-end p-6">
                    <Button
                        title={t('come_back_events')}
                        primary
                        small
                        onClick={handleOnClickEventComeBack}
                    >
                        {t('come_back_events')}
                    </Button>
                </div>

                {/* Escondemos el código de las Experiencias en el BBF  */}
                {/* <div className=" rounded-md bg-white border-4 px-4 text-lg text-center space-y-4 py-4 shadow-xl mb-8">
                <h1 className="font-semibold text-2xl">
                    ¡Encuentra las {BMExperiencesCount} Experiencias de Maestro
                    Cervecero!
                </h1>

                {isLoggedIn ? (
                    <>
                        <p className="text-md">
                            Experiencias registradas:{' '}
                            <span className="font-semibold">
                                {BMExperienceParticipantCount}/
                                {BMExperiencesCount}
                            </span>
                        </p>

                        <p>
                            <span className="text-lg">
                                Puntos obtenidos:{' '}
                                <b className="font-semi">
                                    {BMExperienceParticipantTotalScore}
                                </b>
                            </span>
                        </p>

                        {BMExperienceParticipantCount >= 1 && (
                            <span>Recompensas: </span>
                        )}

                        <p className="flex flex-col text-md sm:text-lg space-y-4">
                            {BMExperienceParticipantCount >= 1 && (
                                <p className="py-2 bg-beer-softFoam border-2 border-bg-draft rounded-xl">
                                    <span className="font-semibold">
                                        Descuento de 5% en tu siguiente compra
                                        ONLINE en Cervezanas
                                    </span>
                                </p>
                            )}
                            {BMExperienceParticipantCount >= 4 && (
                                <p className="py-2 bg-beer-softFoam border-2 border-bg-draft rounded-xl">
                                    <h2 className="font-semibold">
                                        ¡ENHORABUENA!
                                    </h2>
                                    <span>
                                        Has entrado en el sorteo Cervezanas de 2
                                        entradas para el concierto de AC/DC ...
                                        y de muchos otros premios
                                    </span>
                                </p>
                            )}
                        </p>
                    </>
                ) : (
                    <div>
                        Accede con tu usuario para tener más información acerca
                        del evento
                    </div>
                )}
            </div> */}

                {/* Contenido Principal */}
                <div className="space-y-6 p-6">
                    {/* Información del Evento */}
                    <div className="grid grid-cols-2 bg-gradient-to-r from-beer-draft to-beer-gold dark:from-beer-draft dark:to-beer-gold rounded-lg p-6">
                        <div>
                            <Title size="xlarge" color="gray">
                                {event.name}
                            </Title>
                            <Label color="gray" className="mt-2">
                                {event.description}
                            </Label>

                            <div className="mt-4 flex flex-col sm:flex-row sm:space-x-6 text-gray-100 dark:text-gray-300">
                                <div>
                                    <Label color="gray" size="small">
                                        {t('start_date')}:
                                    </Label>
                                    <Label color="black" size="small">
                                        {formatDateString(event.start_date)}
                                    </Label>
                                </div>
                                <div className="mt-2 sm:mt-0">
                                    <Label color="gray" size="small">
                                        {t('end_date')}:
                                    </Label>
                                    <Label color="black" size="small">
                                        {formatDateString(event.end_date)}
                                    </Label>
                                </div>
                            </div>

                            {event.status && (
                                <div className="mt-4">
                                    <ChipCard content={event.status} />
                                </div>
                            )}
                        </div>

                        <div>
                            {/* Mapa de Puntos de Consumo */}
                            <GoogleMapLocationForEvent event={event} />
                        </div>

                        {/* Organizer information */}
                        {/* <div className="mb-4">
                    <span className="text-gray-500">
                        Organizer: {event.organizer_name}{' '}
                        {event.organizer_lastname}
                    </span>
                    <span className="ml-4 text-gray-500">
                        Email: {event.organizer_email}
                    </span>
                    <span className="ml-4 text-gray-500">
                        Phone: {event.organizer_phone}
                    </span>
                </div> */}
                    </div>

                    {/* Sección de Experiencias (Opcional) */}
                    {/* Descomentar si es necesario */}
                    {/* 
            <div className="bg-white dark:bg-gray-800 rounded-b-lg p-6 mt-4 shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                    {t('experiences')}
                </h2>
                {isLoggedIn ? (
                    <div className="mt-4 space-y-4">
                        <p className="text-gray-700 dark:text-gray-300">
                            {t('registered_experiences')}: <span className="font-bold">{BMExperienceParticipantCount}/{BMExperiencesCount}</span>
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                            {t('total_points')}: <span className="font-bold">{BMExperienceParticipantTotalScore}</span>
                        </p>
                        {BMExperienceParticipantCount >= 1 && (
                            <div className="mt-2 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                                <span className="text-yellow-800 dark:text-yellow-200 font-semibold">
                                    {t('reward_discount')}
                                </span>
                            </div>
                        )}
                        {BMExperienceParticipantCount >= 4 && (
                            <div className="mt-2 p-4 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                <h3 className="text-purple-800 dark:text-purple-200 font-semibold">
                                    {t('congratulations')}
                                </h3>
                                <p className="text-purple-700 dark:text-purple-300">
                                    {t('entered_draw')}
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="mt-4 text-gray-700 dark:text-gray-300">
                        {t('login_for_more_info')}
                    </div>
                )}
            </div>
            */}

                    {/* Tabla de Puntos de Consumo */}
                    {/* Organizer information */}
                    {/* <div className="mb-4">
                <span className="text-gray-500">
                Organizer: {event.organizer_name} {event.organizer_lastname}
                </span>
                <span className="ml-4 text-gray-500">
                Email: {event.organizer_email}
                </span>
                <span className="ml-4 text-gray-500">
                Phone: {event.organizer_phone}
                </span>
            </div> */}

                    {/* Products linked to this Consumption Point */}
                    <div className="mt-8">
                        {cpsEvents.length > 0 ? (
                            <div className="overflow-x-auto bg-gray-50 dark:bg-gray-700 rounded-xl shadow-lg p-6">
                                <Title size="xlarge" color="beer-blonde">
                                    {t('cp')}
                                </Title>

                                <ConsumptionPointsTable
                                    consumptionPoints={cpsEvents}
                                    eventId={event.id}
                                />
                            </div>
                        ) : (
                            <>
                                <Title size="xlarge" color="beer-blonde">
                                    {t('cp')}
                                </Title>
                                <Label>{t('no_cp')}</Label>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
