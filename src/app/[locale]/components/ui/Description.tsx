import React from 'react';

interface Props {
    size?: 'xsmall' | 'small' | 'medium' | 'large';
    color?: 'black' | 'white' | 'gray' | 'beer-draft' | 'beer-blonde';
    children: React.ReactNode;
}

const Description = ({ children, size = 'medium', color = 'black' }: Props) => {
    const sizeClass = {
        xsmall: 'text-sm',
        small: 'text-lg',
        medium: 'text-xl',
        large: 'text-2xl',
    };

    const colorClass = {
        black: 'text-black-800',
        white: 'text-white',
        gray: 'text-gray-600',
        'beer-draft': 'text-beer-draft',
        'beer-blonde': 'text-beer-blonde',
    };

    return (
        <p
            className={`${sizeClass[size]} ${colorClass[color]} font-['Ubuntu-light'] max-w-full text-justify my-1`}
        >
            {children}
        </p>
    );
};

export default Description;
