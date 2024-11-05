import React from 'react';

interface Props {
    size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
    color?: 'black' | 'white' | 'beer-draft' | 'beer-blonde';
    font?: 'semibold' | 'bold' | 'normal';
    htmlFor?: string;
    children: React.ReactNode;
    className?: string;
}

export default function Label({
    children,
    size = 'medium',
    color = 'black',
    font = 'normal',
    htmlFor,
    className,
}: Props) {
    const sizeClass = {
        xsmall: 'text-sm',
        small: 'text-md',
        medium: 'text-lg',
        large: 'text-xl',
        xlarge: 'text-3xl',
    };

    const colorClass = {
        black: 'text-black-800',
        white: 'text-white',
        'beer-draft': 'text-beer-draft',
        'beer-blonde': 'text-beer-blonde',
    };

    const fontClass = {
        semibold: 'font-semibold',
        bold: 'font-bold',
        normal: 'font-normal',
    };

    return (
        <label
            className={`${sizeClass[size]} ${colorClass[color]} ${fontClass[font]} ${htmlFor} ${className} flex h-12 flex-col items-start space-y-2 dark:text-gray-300`}
        >
            {children}
        </label>
    );
}
