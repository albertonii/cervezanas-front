'use client';

import HorizontalSections from '@/app/[locale]/components/ui/HorizontalSections';
import React, { useEffect, useState } from 'react';
import {
    IConsumptionPoint,
    IConsumptionPoints,
} from '@/lib/types/consumptionPoints';
import { CPManagement } from '@/app/[locale]/components/CP/CPManagement';
import { CPInEvents } from '@/app/[locale]/components/CP/CPInEvents';

interface Props {
    cps_: IConsumptionPoints[];
    counterCP: number;
}

// Consumption Point status is in pending for validation by the admin of the platform
export function ConsumptionPoints({ cps_, counterCP }: Props) {
    const [menuOption, setMenuOption] = useState<string>('cp_management');
    const [cpsAccumulated, setCpsAccumulated] = useState<IConsumptionPoint[]>(
        [],
    );
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const accumulated: IConsumptionPoint[] = [];

        cps_.forEach((cps: IConsumptionPoints) => {
            cps.cp?.forEach((consumptionPoint: IConsumptionPoint) => {
                // Evitar duplicados
                const exists = accumulated.find(
                    (cp) => cp.id === consumptionPoint.id,
                );
                if (!exists) {
                    accumulated.push(consumptionPoint);
                }
            });
        });

        setCpsAccumulated(accumulated);
        setIsLoading(false);
    }, [cps_]);

    const renderSwitch = () => {
        switch (menuOption) {
            case 'cp_management':
                return (
                    <CPManagement cpsId={cps_[0]?.id} counterCP={counterCP} />
                );
            case 'cp_in_events':
                return <CPInEvents counterCP={counterCP} />;
            default:
                return null;
        }
    };

    const handleMenuClick = (opt: string): void => {
        setMenuOption(opt);
    };

    return (
        <>
            <HorizontalSections
                handleMenuClick={handleMenuClick}
                tabs={['cp_management', 'cp_in_events']}
            />
            {renderSwitch()}
        </>
    );
}
