import React from 'react';

export type LabelColor =
    | 'black'
    | 'white'
    | 'gray'
    | 'yellow'
    | 'green'
    | 'red'
    | 'dark-gray'
    | 'beer-draft'
    | 'beer-gold'
    | 'beer-blonde';

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
        | 'beer-gold'
        | 'beer-blonde';
    font?:
        | 'semibold'
        | 'bold'
        | 'normal'
        | 'medium'
        | 'link'
        | 'italic'
        | 'bold-italic';
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
        xsmall: 'text-sm',
        small: 'text-md',
        medium: 'text-lg',
        large: 'text-xl',
        xlarge: 'text-3xl',
    };

    const colorClass = {
        black: 'text-black-800 dark:text-white',
        white: 'text-white dark:text-black-800',
        gray: 'text-gray-500 dark:text-gray-300',
        yellow: 'text-yellow-800 dark:text-yellow-300',
        green: 'text-green-800 dark:text-green-300',
        red: 'text-red-800 dark:text-red-300',
        'dark-gray': 'text-gray-700 dark:text-gray-400',
        'beer-draft': 'text-beer-draft dark:text-beer-softBlonde',
        'beer-blonde': 'text-beer-blonde dark:text-beer-softFoam',
        'beer-gold': 'text-beer-gold ',
    };

    const fontClass = {
        semibold: 'font-semibold',
        bold: 'font-bold',
        normal: 'font-normal',
        medium: 'font-medium',
        link: 'font-normal underline hover:text-beer-blonde hover:cursor-pointer',
        italic: 'italic',
        'bold-italic': 'font-bold italic',
    };

    return (
        <label
            onClick={onClick}
            htmlFor={htmlFor}
            className={`${sizeClass[size]} ${colorClass[color]} ${fontClass[font]} ${className} flex flex-row items-start space-y-2 justify-center`}
        >
            {children}
        </label>
    );
}
