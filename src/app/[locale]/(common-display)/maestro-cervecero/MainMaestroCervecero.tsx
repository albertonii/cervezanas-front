'use client';

import { useLocale } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useAuth } from '../../(auth)/Context/useAuth';
import {
    ROUTE_CP_FIXED,
    ROUTE_CP_MOBILE,
    ROUTE_EVENTS,
} from '../../../../config';
import { IEventExperience } from '../../../../lib/types/quiz';
import Button from '../../components/common/Button';

interface Props {
    eventExperiences: IEventExperience[];
}

export default function MaestroCervecero({ eventExperiences }: Props) {
    const { initial } = useAuth();
    const router = useRouter();
    const locale = useLocale();

    if (initial) {
        return <div className="card h-72">Loading...</div>;
    }

    const handleExperienceCPMobileOnClick = (
        eventId: string,
        cpMobileId: string,
    ) => {
        router.push(
            `/${locale}${ROUTE_EVENTS}/${eventId}${ROUTE_CP_MOBILE}/${cpMobileId}`,
        );
    };

    const handleExperienceCPFixedOnClick = (
        eventId: string,
        cpFixedId: string,
    ) => {
        router.push(
            `/${locale}${ROUTE_EVENTS}/${eventId}${ROUTE_CP_FIXED}/${cpFixedId}`,
        );
    };

    return (
        <section className="h-full space-y-8 p-2">
            {/*  bloque 2 */}
            <figure className="relative top-0 m-auto w-full max-w-screen-2xl">
                <Image
                    style={{ aspectRatio: '845/235' }}
                    src="/assets/home/home-banner-mc.webp"
                    width={1925}
                    height={536}
                    alt="Banner"
                />
            </figure>

            <header>
                <h1 className="font-semibold text-lg">
                    Experiencia Maestro Cervecero en el Barcelona Beer Festival
                    2024
                </h1>
                <p>
                    ¡Prepárate para convertirte en un Maestro Cervecero!
                    Participa en nuestra exclusiva experiencia durante el
                    Barcelona Beer Festival 2024 y descubre los secretos de las
                    mejores cervezas artesanales.
                </p>
            </header>

            <section className="border-2 shadow-lg border-beer-draft bg-beer-softBlonde p-4  rounded-sm">
                <p>
                    Durante el Barcelona Beer Festival 2024, podrás participar
                    en la experiencia Maestro Cervecero. Descubre los secretos
                    de las mejores cervezas artesanales y conviértete en un
                    experto cervecero.
                </p>

                <p>
                    Busca entre los diferentes estands de la feria aquellos con
                    el distitivo de Cervezanas. Podrás participar escaneando el
                    código QR que encontrarás en cada uno de ellos.
                </p>
            </section>

            <section className="border-2 shadow-lg border-beer-draft bg-beer-softBlonde p-4 rounded-sm">
                <h2>Puntos de Consumo Participantes</h2>

                <div className="space-y-2 space-x-2 flex flex-col items-center justify-center">
                    {eventExperiences.map((eventExperience) => {
                        if (eventExperience.cp_mobile) {
                            const cpMobile = eventExperience.cp_mobile;

                            return (
                                <div
                                    className="border-2 shadow-xl rounded-2xl border-bear-dark bg-beer-softFoam p-4 w-full max-w-[300px] space-y-2 text-center"
                                    key={cpMobile.id}
                                >
                                    <h3 className="text-xl font-semibold">
                                        {cpMobile?.cp_name}
                                    </h3>

                                    <p className="text-sm truncate">
                                        {cpMobile?.cp_description}
                                    </p>

                                    <Button
                                        primary
                                        small
                                        onClick={() =>
                                            handleExperienceCPMobileOnClick(
                                                eventExperience.event_id,
                                                cpMobile.id,
                                            )
                                        }
                                    >
                                        Visitar Estand
                                    </Button>
                                </div>
                            );
                        } else if (eventExperience.cp_fixed) {
                            const cpFixed = eventExperience.cp_fixed;
                            return (
                                <div
                                    className="border-2 shadow-xl rounded-2xl border-bear-dark bg-beer-softBlondeBubble p-4 w-full max-w-[300px] space-y-2"
                                    key={cpFixed.id}
                                >
                                    <h3>
                                        Nombre del Estand: {cpFixed?.cp_name}
                                    </h3>

                                    <p>{cpFixed?.cp_description}</p>

                                    <Button
                                        primary
                                        small
                                        onClick={() =>
                                            handleExperienceCPFixedOnClick(
                                                eventExperience.event_id,
                                                cpFixed.id,
                                            )
                                        }
                                    >
                                        Visitar Estand
                                    </Button>
                                </div>
                            );
                        }
                    })}
                </div>
            </section>
        </section>
    );
}
