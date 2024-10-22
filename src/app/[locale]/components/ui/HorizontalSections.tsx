'use client';

import React, { ComponentProps, useState } from 'react';
import { useTranslations } from 'next-intl';

interface Props {
    handleMenuClick: ComponentProps<any>;
    tabs: string[];
}

export default function HorizontalSections({ handleMenuClick, tabs }: Props) {
    const [activeTab, setActiveTab] = useState<string>(tabs[0]);

    const t = useTranslations();

    const handleClick = (tab: string) => {
        setActiveTab(tab);
        handleMenuClick(tab);
    };

    return (
        <>
            <ul className="mx-16 flex justify-center bg-white rounded-lg shadow-md overflow-hidden border-2 border-gray-300">
                {tabs.map((tab, index) => (
                    <li
                        key={index}
                        className={`
                            flex-1 
                            text-center 
                            px-4 
                            py-2
                            cursor-pointer 
                            font-semibold 
                            uppercase 
                            transition-colors 
                            duration-300
                            hover:text-beer-blonde
                        ${
                            activeTab === tab
                                ? 'bg-beer-draft text-white'
                                : 'bg-gradient-to-br from-white to-gray-200 text-gray-500 hover:bg-gray-100'
                        }
                        ${index === 0 ? 'rounded-l-lg' : ''}
                        ${index === tabs.length - 1 ? 'rounded-r-lg' : ''}
                        `}
                        onClick={() => handleClick(tab)}
                    >
                        {t(tab.toLowerCase())}
                    </li>
                ))}
            </ul>
        </>
    );
}
