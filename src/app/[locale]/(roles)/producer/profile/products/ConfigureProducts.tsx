'use client';

import React, { useState } from 'react';
import { Lots } from './Lots';
import { Archive } from './Archive';
import { Products } from './Products';
import { CustomizeSettings } from './CustomizeSettings';
import HorizontalSections from '@/app/[locale]/components/ui/HorizontalSections';

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
            case 'customize_settings':
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
                tabs={['products', 'lots', 'archive', 'customize_settings']}
            />
            {renderSwitch()}
        </>
    );
}
