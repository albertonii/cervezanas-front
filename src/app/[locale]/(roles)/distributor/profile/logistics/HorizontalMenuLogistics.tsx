import React from 'react';
import HorizontalSections from '@/app/[locale]/components/common/HorizontalSections';
import { DistributionOption } from '@/lib//enums';

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
                    DistributionOption.COST,
                    DistributionOption.DESTINATION,
                    DistributionOption.ORIGIN_INFORMATION,
                ]}
            />
        </>
    );
}
