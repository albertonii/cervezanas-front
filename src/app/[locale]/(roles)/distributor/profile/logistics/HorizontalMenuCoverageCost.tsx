import React from 'react';
import { DistributionCostType } from '../../../../../../lib/enums';
import HorizontalSections from '../../../../components/common/HorizontalSections';

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
                    DistributionCostType.FLATRATE,
                    DistributionCostType.FLATRATE_AND_WEIGHT,
                    DistributionCostType.RANGE,
                    DistributionCostType.VOLUME_AND_WEIGHT,
                    DistributionCostType.DISTANCE,
                ]}
            />
        </>
    );
}
