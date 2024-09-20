import React from 'react';
import { DistributionDestinationType } from '@/lib//enums';
import HorizontalSections from '@/app/[locale]/components/ui/HorizontalSections';

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
