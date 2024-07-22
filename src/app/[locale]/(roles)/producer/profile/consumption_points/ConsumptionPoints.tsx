'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CPPending } from './CPPending';
import { CPAccepted } from './CPAccepted';
import { CPRejected } from './CPRejected';
import { IConsumptionPoints, IProfile } from '@/lib//types/types';
import { SubmitCPOrganizer } from '@/app/[locale]/components/modals/SubmitCPOrganizer';

interface Props {
    cps: IConsumptionPoints[];
    profile: IProfile;
}

export function ConsumptionPoints({
    cps,
    profile: { cp_organizer_status },
}: Props) {
    const t = useTranslations();

    // const [cpOrganizerStatus, setCPOrganizerStatus] =
    //     useState(cp_organizer_status);

    const [cpOrganizerStatus, setCPOrganizerStatus] = useState(1);

    const handleCPOrganizerStatus = (status: number) => {
        setCPOrganizerStatus(status);
    };

    return (
        <section className="px-6 py-4" aria-label="ConsumptionPoints">
            <div className="flex flex-col space-y-4">
                <p className="flex justify-between py-4" id="header">
                    <span
                        id="title"
                        className="text-5xl uppercase font-semibold text-white"
                    >
                        {t('consumption_points')}
                    </span>
                </p>

                {cpOrganizerStatus === -1 ? (
                    <div>
                        <h3 className="mt-4 bg-beer-foam p-2 text-lg text-beer-dark">
                            {t('consumption_points_description')}
                        </h3>

                        <div>
                            <p>
                                Date de alta a través de nuestro formulario para
                                obtener el título de organizador de puntos
                                cervezanas.
                            </p>
                            <p>
                                Con él tendrás la potestad de organizar eventos
                                y promociones usando la marca de Cervezanas como
                                respaldo. Podrás añadir tus propios puntos de
                                consumo a la plataforma haciéndolos públicos
                                para los demás cervezanos.
                            </p>
                        </div>

                        {/* Modal with form to register as a consumption point organizer  */}
                        <div className="pr-12 pt-6">
                            <SubmitCPOrganizer
                                handleCPOrganizerStatus={
                                    handleCPOrganizerStatus
                                }
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        {cpOrganizerStatus === 0 ? (
                            <CPPending />
                        ) : (
                            <>
                                {cpOrganizerStatus === 1 ? (
                                    <CPAccepted cps={cps[0]} />
                                ) : (
                                    <CPRejected />
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
