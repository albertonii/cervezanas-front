import React from 'react';
import HorizontalSections from '../../../../components/common/HorizontalSections';
import { DistributionDestinationType } from '../../../../../../lib/enums';

type Props = {
    setMenuOption: (opt: string) => void;
};

export default function HorizontalMenuCoverageDestination({
    setMenuOption,
}: Props) {
    const handleMenuClick = (opt: string): void => {
        setMenuOption(opt);
    };

    return (
        <>
            <HorizontalSections
                handleMenuClick={handleMenuClick}
                tabs={[
                    // DistributionDestinationType.LOCAL,
                    // DistributionDestinationType.CITY,
                    DistributionDestinationType.SUB_REGION,
                    DistributionDestinationType.REGION,
                    // DistributionDestinationType.EUROPE,
                    // DistributionDestinationType.INTERNATIONAL,
                ]}
            />
        </>
    );
}
