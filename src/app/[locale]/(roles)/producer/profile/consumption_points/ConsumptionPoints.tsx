'use client';

import Title from '@/app/[locale]/components/ui/Title';
import ProfileSectionHeader from '@/app/[locale]/components/ui/ProfileSectionHeader';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { IProfile } from '@/lib/types/types';
import { CPPending } from '../../../../components/CP/CPPending';
import { CPAccepted } from '../../../../components/CP/CPAccepted';
import { CPRejected } from '../../../../components/CP/CPRejected';
import { IConsumptionPoints } from '@/lib/types/consumptionPoints';
import { SubmitCPOrganizer } from '@/app/[locale]/components/modals/SubmitCPOrganizer';

interface Props {
    cps: IConsumptionPoints[];
    profile: IProfile;
    counterCPs: number;
}

export function ConsumptionPoints({
    cps,
    profile: { cp_organizer_status },
    counterCPs,
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
                    <Title size="large" color="white">
                        {t('consumption_points_organizer_title')}
                    </Title>

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
                                    counterCP={counterCPs}
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
