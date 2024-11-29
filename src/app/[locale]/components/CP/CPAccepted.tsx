'use client';

import HorizontalSections from '@/app/[locale]/components/ui/HorizontalSections';
import React, { useState } from 'react';
import { CPFixed } from './CPFixed';
import { CPMobile } from './CPMobile';
import { IConsumptionPoints } from '@/lib/types/consumptionPoints';
import { CPManagement } from './CPManagement';
import { CPInEvents } from './CPInEvents';

interface Props {
    cps: IConsumptionPoints;
    counterCPMobile: number;
    counterCPFixed: number;
    counterCP: number;
}

// Consumption Point status is in pending for validation by the admin of the platform
export function CPAccepted({
    cps,
    counterCPMobile,
    counterCPFixed,
    counterCP,
}: Props) {
    const [menuOption, setMenuOption] = useState<string>('cp_management');

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
            case 'cp_management':
                return <CPManagement cpsId={cps.id} counterCP={counterCP} />;
            case 'cp_in_events':
                return <CPInEvents counterCP={counterCP} />;
        }
    };

    const handleMenuClick = (opt: string): void => {
        setMenuOption(opt);
    };

    return (
        <>
            <HorizontalSections
                handleMenuClick={handleMenuClick}
                tabs={[
                    'cp_mobile',
                    'cp_fixed',
                    'cp_management',
                    'cp_in_events',
                ]}
            />

            {renderSwitch()}
        </>
    );
}
