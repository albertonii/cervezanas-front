'use client';

import React, { useState } from 'react';
import HorizontalSections from '@/app/[locale]/components/common/HorizontalSections';
import { Lots } from './Lots';
import { Archive } from './Archive';
import { Products } from './Products';
import { CustomizeSettings } from './CustomizeSettings';

interface Props {
    counter: number;
}

export function ConfigureProducts({ counter }: Props) {
    const [menuOption, setMenuOption] = useState<string>('products');

    const renderSwitch = () => {
        switch (menuOption) {
            case 'products':
                return <Products counter={counter} />;
            case 'lots':
                return <Lots />;
            case 'archive':
                return <Archive />;
            case 'customizeSettings':
                return <CustomizeSettings />;
        }
    };

    const handleMenuClick = (opt: string): void => {
        setMenuOption(opt);
    };

    return (
        <>
            <HorizontalSections
                handleMenuClick={handleMenuClick}
                tabs={['products', 'lots', 'archive', 'customizeSettings']}
            />
            {renderSwitch()}
        </>
    );
}
