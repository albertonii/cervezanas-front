import React from 'react';
import { useTranslations } from 'next-intl';

interface Props {
    size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
    color?: 'black' | 'white' | 'beer-draft' | 'beer-blonde' | 'gray';
    font?: 'medium' | 'semibold' | 'bold';
    fontFamily?: 'NexaRust-script' | 'NexaRust-sans';
    children: React.ReactNode;
}

const Title = ({
    children,
    size = 'large',
    color = 'black',
    font = 'bold',
    fontFamily = 'NexaRust-script',
}: Props) => {
    const t = useTranslations();

    const sizeClass = {
        xsmall: 'text-sm',
        small: 'text-md sm:text-xl',
        medium: 'text-lg sm:text-3xl',
        large: 'text-2xl sm:text-4xl',
        xlarge: 'text-3xl sm:text-5xl',
    };

    const colorClass = {
        gray: 'text-gray-700 dark:text-white',
        black: 'text-black-800 dark:text-white',
        white: 'text-white dark:text-black-800',
        'beer-draft': 'text-beer-draft',
        'beer-blonde': 'text-beer-blonde',
    };

    return (
        <header
            className="flex flex-col justify-between items-start rounded-lg space-y-1 pb-2"
            id="header"
        >
            <h1
                className={`${sizeClass[size]} ${colorClass[color]} ${font} font-['${fontFamily}']`}
            >
                {children}
            </h1>
        </header>
    );
};

export default Title;
