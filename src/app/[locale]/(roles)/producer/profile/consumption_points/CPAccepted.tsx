'use client';

import React, { useState } from 'react';
import { CPFixed } from './CPFixed';
import { CPMobile } from './CPMobile';
import { IConsumptionPoints } from '@/lib//types/types';
import HorizontalSections from '@/app/[locale]/components/ui/HorizontalSections';

interface Props {
    cps: IConsumptionPoints;
    counterCPMobile: number;
    counterCPFixed: number;
}

// Consumption Point status is in pending for validation by the admin of the platform
export function CPAccepted({ cps, counterCPMobile, counterCPFixed }: Props) {
    const [menuOption, setMenuOption] = useState<string>('cp_mobile');

    const renderSwitch = () => {
        switch (menuOption) {
            case 'cp_fixed':
                return (
                    <CPFixed cpsId={cps.id} counterCPFixed={counterCPFixed} />
                );
            case 'cp_mobile':
                return (
                    <CPMobile
                        cpsId={cps.id}
                        counterCPMobile={counterCPMobile}
                    />
                );
        }
    };

    const handleMenuClick = (opt: string): void => {
        setMenuOption(opt);
    };

    return (
        <>
            {/* <h2 className="text-3xl">¡Petición aceptada!</h2>

            <p>
                <h3 className="max-w-3xl text-lg">
                    El equipo de cervezanas ha recibido tu solicitud para
                    participar como punto de consumo certificado y has sido
                    admitido. Ahora podrás usar los paneles de control para
                    gestionar tu punto de consumo.
                </h3>
            </p> */}

            <HorizontalSections
                handleMenuClick={handleMenuClick}
                tabs={['cp_mobile', 'cp_fixed']}
            />

            {renderSwitch()}
        </>
    );
}
