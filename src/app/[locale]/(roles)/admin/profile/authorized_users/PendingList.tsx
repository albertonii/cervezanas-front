'use client';

import React, { useState } from 'react';
import { IDistributorUser, IProducerUser } from '@/lib//types/types';
import ProducerList from './ProducerList';
import DistributorList from './DistributorList';
import HorizontalSections from '@/app/[locale]/components/common/HorizontalSections';

interface Props {
    producers: IProducerUser[];
    distributors: IDistributorUser[];
}

export default function ListPendingUsers({ producers, distributors }: Props) {
    const [menuOption, setMenuOption] = useState<string>('producers');

    const renderSwitch = () => {
        switch (menuOption) {
            case 'producers':
                return <ProducerList producers={producers} />;
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
