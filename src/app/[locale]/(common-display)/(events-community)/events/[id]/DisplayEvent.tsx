'use client';

import CPMobile from './CPMobile';
import CPFixed from './CPFixed';
import useEventCartStore from '@/app/store/eventCartStore';
import React, { useEffect } from 'react';
import { ROUTE_EVENTS } from '@/config';
import { useRouter } from 'next/navigation';
import { formatDateString } from '@/utils/formatDate';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from '../../../../(auth)/Context/useAuth';
import { ICPF_events, ICPM_events, IEvent } from '@/lib//types/types';
import { IBMExperienceParticipants, IEventExperience } from '@/lib//types/quiz';
import Button from '@/app/[locale]/components/ui/buttons/Button';

interface Props {
    event: IEvent;
    cpmEvents: ICPM_events[];
    cpfEvents: ICPF_events[];
    eventExperiences: IEventExperience[];
    experienceParticipant: IBMExperienceParticipants[];
}

export default function DisplayEvent({
    event,
    cpmEvents,
    cpfEvents,
    eventExperiences,
    experienceParticipant,
}: Props) {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();

    const { existEventCart, createNewCart } = useEventCartStore();
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        if (!existEventCart(event.id)) {
            createNewCart(event.id);
        }
    }, []);

    const BMExperiencesCount: number =
        eventExperiences?.filter(
            (eventExperiences) =>
                eventExperiences.experiences?.type === 'beer_master',
        ).length ?? 0;

    const BMExperienceParticipantCount: number =
        experienceParticipant?.filter(
            (experienceParticipant) =>
                experienceParticipant.is_paid &&
                experienceParticipant.is_finished,
        ).length ?? 0;

    const BMExperienceParticipantTotalScore: number =
        experienceParticipant?.reduce(
            (acc, experienceParticipant) =>
                experienceParticipant.is_paid &&
                experienceParticipant.is_finished
                    ? acc + experienceParticipant.score
                    : acc,
            0,
        );

    const handleOnClickEventComeBack = () => {
        return router.push(`/${locale}${ROUTE_EVENTS}`);
    };

    return (
        <section className="relative m-auto sm:mb-20 sm:mt-20 h-full w-full max-w-[500px] bg-white p-8 shadow-md sm:max-w-full md:mt-0 md:max-w-[700px] lg:max-w-[900px] bg-opacity-80 space-y-4">
            {/* <div className="absolute right-0 -top-4 sm:top-0 m-4 rounded-md bg-beer-gold px-4 py-2">
                <span
                    className={`text-lg font-medium text-white ${
                        event.status === 'active'
                            ? 'text-green-500'
                            : 'text-red-500'
                    }`}
                >
                    {event.status === 'active' ? 'Active' : 'Inactive'}
                </span>
            </div> */}

            <Button
                title={'come_back_events'}
                primary
                small
                onClick={handleOnClickEventComeBack}
            >
                Volver a la lista de eventos
            </Button>

            <div className=" rounded-md bg-white border-4 px-4 text-lg text-center space-y-4 py-4 shadow-xl mb-8">
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
            </div>

            {/* Display all the information inside the Mobile Consumption Point */}
            <h1 className="mb-2 text-4xl font-bold text-beer-draft py-6 px-4 bg-gradient-to-r from-beer-softFoam to-transparent border-b-4 border-beer-draft rounded-t-2xl">
                {event.name}
            </h1>
            <h2 className="mb-4 text-lg text-gray-500">{event.description}</h2>

            <div className="mb-4 flex flex-col sm:flex-row">
                {/* Start and End date */}
                <span className="text-sm sm:text-xl font-semibold italic text-black">
                    {t('start_date')}: {formatDateString(event.start_date)}
                </span>
                <span className="sm:ml-4 text-sm sm:text-xl font-semibold italic text-black">
                    {t('end_date')}: {formatDateString(event.end_date)}
                </span>
            </div>

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

            {/* Products linked to this Mobile Consumption Point */}
            <section className="mt-8">
                {cpmEvents.length > 0 ? (
                    <div className="overflow-x-auto">
                        <h3 className="mb-2 text-xl font-bold">
                            {t('cp_mobile')}
                        </h3>

                        <table className="w-full text-center text-sm text-gray-500 dark:text-gray-400">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th
                                        scope="col"
                                        className="hidden px-6 py-3 sm:block "
                                    >
                                        {t('logo_header')}
                                    </th>

                                    <th scope="col" className="px-2 py-3 ">
                                        {t('name_header')}
                                    </th>

                                    <th
                                        scope="col"
                                        className="hidden sm:block px-2 py-3 "
                                    >
                                        {t('date_header')}
                                    </th>

                                    <th scope="col" className="px-2 py-3 ">
                                        {t('status_header')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {cpmEvents.map((cpm) => (
                                    <>
                                        {cpm.cp_mobile && (
                                            <CPMobile
                                                key={cpm.event_id + cpm.cp_id}
                                                cp={cpm.cp_mobile}
                                                eventId={event.id}
                                            />
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <>
                        <h3 className="mb-2 text-xl font-bold">
                            {t('cp_mobile')}
                        </h3>
                        <p className="text-gray-500">{t('no_cp_mobile')}</p>
                    </>
                )}
            </section>

            {/* Products linked to this Fixed Consumption Point */}
            <section className="mt-8">
                {cpfEvents.length > 0 ? (
                    <div className="overflow-x-auto">
                        <h3 className="mb-2 text-xl font-bold">
                            {t('cp_fixed')}
                        </h3>

                        <table className="w-full text-center text-sm text-gray-500 dark:text-gray-400">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3 ">
                                        {t('logo_header')}
                                    </th>

                                    <th scope="col" className="px-6 py-3 ">
                                        {t('name_header')}
                                    </th>

                                    <th
                                        scope="col"
                                        className="hidden sm:block px-6 py-3 "
                                    >
                                        {t('date_header')}
                                    </th>

                                    <th scope="col" className="px-6 py-3 ">
                                        {t('status_header')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {cpfEvents.map((cpf) => (
                                    <>
                                        {cpf.cp_fixed && (
                                            <CPFixed
                                                key={cpf.event_id + cpf.cp_id}
                                                cp={cpf.cp_fixed}
                                                eventId={event.id}
                                            />
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <>
                        <h3 className="mb-2 text-xl font-bold">
                            {t('cp_fixed')}
                        </h3>
                        <p className="text-gray-500">{t('no_cp_fixed')}</p>
                    </>
                )}
            </section>
        </section>
    );
}
