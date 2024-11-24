'use client';

import CoverageAreas from './coverage_areas/CoverageAreas';
import HorizontalMenuLogistics from './HorizontalMenuLogistics';
import OriginInfo from './distribution_costs/OriginInfo/OriginInfo';
import DistributionCost from './distribution_costs/DistributionCost';
import React, { useState } from 'react';
import { DistributionOption } from '@/lib//enums';
import { useAuth } from '@/app/[locale]/(auth)/Context/useAuth';
import { IDistributionCost } from '@/lib/types/types';

interface Props {
    distributionCosts: IDistributionCost;
}

export default function CoverageLayout({ distributionCosts }: Props) {
    const [menuOption, setMenuOption] = useState<string>(
        DistributionOption.DESTINATION,
    );

    const { user } = useAuth();

    if (!user) return null;

    const renderSwitch = () => {
        switch (menuOption) {
            case DistributionOption.ORIGIN_INFORMATION:
                return <OriginInfo />;

            case DistributionOption.COST:
                return (
                    <DistributionCost
                        userId={user.id}
                        distributionCosts={distributionCosts}
                    />
                );

            case DistributionOption.DESTINATION:
                return <CoverageAreas />;

            default:
                return <></>;
        }
    };

    return (
        <section className="space-y-4 px-0 py-1 lg:container sm:px-6 sm:py-4">
            <HorizontalMenuLogistics setMenuOption={setMenuOption} />

            <div className="min-h-screen">{renderSwitch()}</div>
        </section>
    );
}
