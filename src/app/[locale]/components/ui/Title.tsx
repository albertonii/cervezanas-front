import React from 'react';
import { useTranslations } from 'next-intl';

interface Props {
    size: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
    color: 'black' | 'white' | 'beer-draft' | 'beer-blonde';
    children: React.ReactNode;
}

const Title = ({ children, size, color }: Props) => {
    const t = useTranslations();

    const sizeClass = {
        xsmall: 'text-sm',
        small: 'text-xl',
        medium: 'text-3xl',
        large: 'text-4xl',
        xlarge: 'text-5xl',
    };

    const colorClass = {
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
                className={`${sizeClass[size]} ${colorClass[color]} font-bold font-['NexaRust-script']`}
            >
                {children}
            </h1>
        </header>
    );
};

export default Title;
