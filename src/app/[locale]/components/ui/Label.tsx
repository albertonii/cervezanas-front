import React from 'react';

interface Props {
    size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
    color?:
        | 'black'
        | 'white'
        | 'gray'
        | 'yellow'
        | 'green'
        | 'red'
        | 'dark-gray'
        | 'beer-draft'
        | 'beer-blonde';
    font?: 'semibold' | 'bold' | 'normal' | 'medium' | 'link';
    htmlFor?: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export default function Label({
    children,
    size = 'medium',
    color = 'black',
    font = 'normal',
    htmlFor,
    className,
    onClick,
}: Props) {
    const sizeClass = {
        xsmall: 'text-sm h-4',
        small: 'text-md h-6',
        medium: 'text-lg h-8',
        large: 'text-xl h-12 ',
        xlarge: 'text-3xl h-12',
    };

    const colorClass = {
        black: 'text-black-800',
        white: 'text-white',
        gray: 'text-gray-500',
        yellow: 'text-yellow-800',
        green: 'text-green-800',
        red: 'text-red-800',
        'dark-gray': 'text-gray-700',
        'beer-draft': 'text-beer-draft',
        'beer-blonde': 'text-beer-blonde',
    };

    const fontClass = {
        semibold: 'font-semibold',
        bold: 'font-bold',
        normal: 'font-normal',
        medium: 'font-medium',
        link: 'font-normal underline hover:text-beer-blonde hover:cursor-pointer',
    };

    return (
        <label
            onClick={onClick}
            htmlFor={htmlFor}
            className={`${sizeClass[size]} ${colorClass[color]} ${fontClass[font]}  ${className} flex flex-row items-start space-y-2 dark:text-gray-300 justify-center`}
        >
            {children}
        </label>
    );
}
