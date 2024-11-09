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
        xsmall: 'text-sm h-6',
        small: 'text-md h-6',
        medium: 'text-lg h-8',
        large: 'text-xl h-12 ',
        xlarge: 'text-3xl h-12',
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
            htmlFor={htmlFor}
            className={`${sizeClass[size]} ${colorClass[color]} ${fontClass[font]}  ${className} flex flex-col items-start space-y-2 dark:text-gray-300 justify-center`}
        >
            {children}
        </label>
    );
}
