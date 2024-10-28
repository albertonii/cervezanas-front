'use client';

import HorizontalSections from '@/app/[locale]/components/ui/HorizontalSections';
import React, { useState } from 'react';
import { Products } from './Products';

interface Props {
    counter: number;
}

export function ConfigureProducts({ counter }: Props) {
    const [menuOption, setMenuOption] = useState<string>('products');

    const renderSwitch = () => {
        switch (menuOption) {
            case 'products':
                return <Products counter={counter} />;
        }
    };

    const handleMenuClick = (opt: string): void => {
        setMenuOption(opt);
    };

    return (
        <>
            <HorizontalSections
                handleMenuClick={handleMenuClick}
                tabs={['products']}
            />
            {renderSwitch()}
        </>
    );
}
