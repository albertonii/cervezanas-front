import React from 'react';
import { DistributionDestinationType } from '@/lib/enums';
import HorizontalSections from '@/app/[locale]/components/ui/HorizontalSections';

type Props = {
    setMenuOption: (opt: string) => void;
};

export default function HorizontalMenuCostByDistributionType({
    setMenuOption,
}: Props) {
    const handleMenuClick = (opt: string): void => {
        setMenuOption(opt);
    };

    return (
        <HorizontalSections
            handleMenuClick={handleMenuClick}
            tabs={[
                DistributionDestinationType.CITY,
                DistributionDestinationType.SUB_REGION,
                DistributionDestinationType.REGION,
                DistributionDestinationType.EUROPE,
                DistributionDestinationType.INTERNATIONAL,
            ]}
        />
    );
}
