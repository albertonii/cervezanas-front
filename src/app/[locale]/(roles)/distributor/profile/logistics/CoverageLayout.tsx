'use client';

import CoverageAreas from './coverage_areas/CoverageAreas';
import HorizontalMenuLogistics from './HorizontalMenuLogistics';
import OriginInfo from './distribution_costs/OriginInfo/OriginInfo';
import DistributionCost from './distribution_costs/DistributionCost';
import React, { useState } from 'react';
import { DistributionOption } from '@/lib//enums';
import { useAuth } from '@/app/[locale]/(auth)/Context/useAuth';

export default function CoverageLayout() {
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
                return <DistributionCost userId={user.id} />;

            case DistributionOption.DESTINATION:
                return <CoverageAreas />;

            default:
                return <></>;
        }
    };

    return (
        <section className="space-y-4 px-1 py-1 lg:container sm:px-6 sm:py-4">
            <HorizontalMenuLogistics setMenuOption={setMenuOption} />

            <div className="min-h-screen">{renderSwitch()}</div>
        </section>
    );
}
