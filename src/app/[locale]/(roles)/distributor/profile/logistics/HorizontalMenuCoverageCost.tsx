import React from 'react';
import { DistributionCostType } from '@/lib//enums';
import HorizontalSections from '@/app/[locale]/components/ui/HorizontalSections';

type Props = {
    setMenuOption: (opt: string) => void;
};

export default function HorizontalMenuCoverageCost({ setMenuOption }: Props) {
    const handleMenuClick = (opt: string): void => {
        setMenuOption(opt);
    };

    return (
        <>
            <HorizontalSections
                handleMenuClick={handleMenuClick}
                tabs={[
                    DistributionCostType.AREA_AND_WEIGHT,
                    DistributionCostType.FLATRATE_AND_WEIGHT,
                    // DistributionCostType.FLATRATE,
                    // DistributionCostType.PRICE_RANGE,
                    // DistributionCostType.VOLUME_AND_WEIGHT,
                    // DistributionCostType.DISTANCE,
                ]}
            />
        </>
    );
}
