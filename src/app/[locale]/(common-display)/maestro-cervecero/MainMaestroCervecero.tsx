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
        <section className="h-full space-y-8 p-2 bg-white bg-[url('/assets/maestro/mestro-fondo.webp')] bg-cover bg-no-repeat px-8 sm:px-32 pb-16">
            {/*  bloque 2 */}
            <figure className="relative top-0 m-auto w-full max-w-screen-2xl">
                <Image
                    className="m-auto"
                    style={{ aspectRatio: '433/234' }}
                    src="/assets/maestro/maestro-titulo.webp"
                    width={866}
                    height={468}
                    alt="Banner"
                />
            </figure>
            <header>
                <h1 className="font-bold text-4xl text-center sm:text-5xl mb-6 text-beer-draft">
                    Experiencia Maestro Cervecero en el Barcelona Beer Festival
                    2024
                </h1>
                <p className="text-xl text-center m-auto">
                    ¡Prepárate para convertirte en un Maestro Cervecero!
                    Participa en nuestra exclusiva experiencia durante el
                    Barcelona Beer Festival 2024 y descubre los secretos de las
                    mejores cervezas artesanales.
                </p>
            </header>

            <section className="border-4 shadow-lg border-beer-gold bg-white p-4  rounded-sm text-lg sm:p-20 text-center m-auto">
                <p className="m-auto mt-5">
                    Durante el Barcelona Beer Festival 2024, podrás participar
                    en la experiencia Maestro Cervecero. Descubre los secretos
                    de las mejores cervezas artesanales y conviértete en un
                    experto cervecero.
                </p>

                <p className="m-auto mt-5">
                    Busca entre los diferentes estands de la feria aquellos con
                    el distitivo de Cervezanas. Podrás participar escaneando el
                    código QR que encontrarás en cada uno de ellos.
                </p>
                <p className="m-auto mt-5 mb-2">
                    Si consigues completar todos los puntos conseguirás un 5% de
                    descuento en tu próximo pedido en cervezanas.beer. Además,
                    participarás en el sorteo de 10 camisetas con el logo de
                    Cervezanas, 10 packs de 6 cervezas de nuestro catátlogo y...
                </p>
                <p className="m-auto mb-5 text-cerv-banana text-3xl font-bold">
                    2 entradas para el concierto de AC/DC en Sevilla el 1 de
                    junio!!!
                </p>
            </section>
            <section className="m-auto bg-cerv-coal bg-opacity-50 p-8 text-white">
                <p className="text-center text-xl mb-3 font-bold max-w-full">
                    CONDICIONES DEL SORTEO
                </p>
                <p className="text-base text-justify max-w-full">
                    El sorteo se celebrará entre todas las personas que hayan
                    completado <b>al menos 4 puntos de consumo</b> en el Barcelona Beer
                    Festival 2024 del 22 al 24 de marzo, seleccionando para
                    ello a las 100 personas que hayan conseguido mayor puntuación
                    en la prueba. Se realizará el mismo domingo 24 de marzo o
                    cualquier otro día posterior que decida la empresa
                    organizadora (Cervezanas M&M S.L.) utilizando un sistema al
                    azar para la selección de los premiados y de los suplentes.
                    Cuando un participante haya sido premiado será excluido del
                    sorteo de los sucesivos premios que falten por sortear. Una
                    vez elegidos los ganadores se les comunicará por correo
                    electrónico su premio. Si en el plazo de 15 días desde el
                    envío del correo no hemos recibido respuesta el premio
                    pasará al primer suplente disponible en la lista.
                </p>
            </section>

            <section className="border-2 shadow-lg border-beer-draft bg-beer-softBlonde p-4 rounded-sm">
                <h2 className="text-xl">Puntos de Consumo Participantes</h2>

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
