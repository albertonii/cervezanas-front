'use client';

import ProfileSectionHeader from '@/app/[locale]/components/ui/ProfileSectionHeader';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { IProfile } from '@/lib/types/types';
import { IConsumptionPoints } from '@/lib/types/consumptionPoints';
import { CPPending } from '@/app/[locale]/components/CP/CPPending';
import { CPAccepted } from '@/app/[locale]/components/CP/CPAccepted';
import { CPRejected } from '@/app/[locale]/components/CP/CPRejected';
import { SubmitCPOrganizer } from '@/app/[locale]/components/modals/SubmitCPOrganizer';

interface Props {
    cps: IConsumptionPoints[];
    profile: IProfile;
    counterCP: number;
}

export function ConsumptionPoints({
    cps,
    profile: { cp_organizer_status },
    counterCP,
}: Props) {
    const t = useTranslations();

    const [cpOrganizerStatus, setCPOrganizerStatus] = useState(1);

    const handleCPOrganizerStatus = (status: number) => {
        setCPOrganizerStatus(status);
    };

    return (
        <section
            className="px-6 py-4 flex flex-col space-y-4"
            aria-label="ConsumptionPoints"
        >
            <ProfileSectionHeader headerTitle="consumption_points" />

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
                            Con él tendrás la potestad de organizar eventos y
                            promociones usando la marca de Cervezanas como
                            respaldo. Podrás añadir tus propios puntos de
                            consumo a la plataforma haciéndolos públicos para
                            los demás cervezanos.
                        </p>
                    </div>

                    {/* Modal with form to register as a consumption point organizer  */}
                    <div className="pr-12 pt-6">
                        <SubmitCPOrganizer
                            handleCPOrganizerStatus={handleCPOrganizerStatus}
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
                                <CPAccepted
                                    cps={cps[0]}
                                    counterCP={counterCP}
                                />
                            ) : (
                                <CPRejected />
                            )}
                        </>
                    )}
                </>
            )}
        </section>
    );
}
