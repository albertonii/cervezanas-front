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
    const [cpsAccumulated, setCpsAccumulated] = useState<IConsumptionPoints[]>(
        [],
    );

    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        cps_.map((cps: IConsumptionPoints) => {
            if (cps) {
                cps.cp?.map((consumptionPoint: IConsumptionPoint) => {
                    setCpsAccumulated((prev) => {
                        // Avoid cp that already exists in the array
                        const exists =
                            prev &&
                            prev.find((cp) => cp.id === consumptionPoint.id);

                        if (prev && !exists) {
                            return [...prev, { ...consumptionPoint, cps: [] }];
                        }
                        return prev;
                    });
                });
            }
        });

        setIsLoading(false);
    }, [cps]);

    const renderSwitch = () => {
        switch (menuOption) {
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
                tabs={['cp_management', 'cp_in_events']}
            />

            {renderSwitch()}
        </>
    );
}
