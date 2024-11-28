'use client';

import ProducerList from './ProducerList';
import DistributorList from './DistributorList';
import HorizontalSections from '@/app/[locale]/components/ui/HorizontalSections';
import React, { useState } from 'react';
import { IDistributorUser, IProducerUser } from '@/lib/types/types';

interface Props {
    producers: IProducerUser[];
    distributors: IDistributorUser[];
    producersCounter: number;
    distributorsCounter: number;
}

export default function ModuleList({
    producers,
    distributors,
    producersCounter,
    distributorsCounter,
}: Props) {
    const [menuOption, setMenuOption] = useState<string>('producers');

    const renderSwitch = () => {
        switch (menuOption) {
            case 'producers':
                return (
                    <ProducerList
                        producers={producers}
                        counter={producersCounter}
                    />
                );
            case 'distributors':
                return <DistributorList distributors={distributors} />;
        }
    };

    const handleMenuClick = (opt: string): void => {
        setMenuOption(opt);
    };

    return (
        <>
            <HorizontalSections
                handleMenuClick={handleMenuClick}
                tabs={['producers', 'distributors']}
            />
            {renderSwitch()}
        </>
    );
}
