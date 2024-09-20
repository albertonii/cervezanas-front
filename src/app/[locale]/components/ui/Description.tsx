import React from 'react';

interface Props {
    size: 'small' | 'medium' | 'large';
    color: 'black' | 'white' | 'gray' | 'beer-draft' | 'beer-blonde';
    children: React.ReactNode;
}

const Description = ({ children, size, color }: Props) => {
    const sizeClass = {
        small: 'text-lg',
        medium: 'text-xl',
        large: 'text-2xl',
    };

    const colorClass = {
        black: 'text-black-800',
        white: 'text-white',
        gray: 'text-gray-500',
        'beer-draft': 'text-beer-draft',
        'beer-blonde': 'text-beer-blonde',
    };

    return (
        <p
            className={`${sizeClass[size]} ${colorClass[color]} font-['NexaRust-script']`}
        >
            {children}
        </p>
    );
};

export default Description;
