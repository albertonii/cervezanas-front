import React from 'react';
import { DistributionOption } from '@/lib//enums';
import HorizontalSections from '@/app/[locale]/components/ui/HorizontalSections';

type Props = {
    setMenuOption: (opt: string) => void;
};

export default function HorizontalMenuLogistics({ setMenuOption }: Props) {
    const handleMenuClick = (opt: string): void => {
        setMenuOption(opt);
    };

    return (
        <>
            <HorizontalSections
                handleMenuClick={handleMenuClick}
                tabs={[
                    DistributionOption.DESTINATION,
                    DistributionOption.COST,
                    DistributionOption.ORIGIN_INFORMATION,
                ]}
            />
        </>
    );
}
