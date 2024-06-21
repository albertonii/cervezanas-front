'use client';

import OriginInfo from './distribution_costs/OriginInfo/OriginInfo';
import CoverageAreas from './coverage_areas/CoverageAreas';
import HorizontalMenuLogistics from './HorizontalMenuLogistics';
import DistributionCost from './distribution_costs/DistributionCost';
import React, { useState } from 'react';
import { DistributionOption } from '../../../../../../lib/enums';
import { IDistributionCost } from '../../../../../../lib/types/types';

interface Props {
    // coverageArea: Database["public"]["Tables"]["coverage_areas"]["Row"];
    distributionCosts: IDistributionCost;
}

export default function CoverageLayout({ distributionCosts }: Props) {
    const [menuOption, setMenuOption] = useState<string>(
        DistributionOption.COST,
    );

    const renderSwitch = () => {
        switch (menuOption) {
            case DistributionOption.ORIGIN_INFORMATION:
                return <OriginInfo />;

            case DistributionOption.COST:
                return (
                    <DistributionCost distributionCosts={distributionCosts} />
                );

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
