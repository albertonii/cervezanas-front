import React from 'react';

interface Props {
    children: React.ReactNode;
    scope?: 'col' | 'row';
    fontFamily?: string;
    size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';
    class_?: string;
    onClick?: () => void;
}

const TH = ({ children, scope, fontFamily, size, class_, onClick }: Props) => {
    const sizeClass = {
        xsmall: 'text-sm',
        small: 'text-md',
        medium: 'text-lg',
        large: 'text-2xl',
        xlarge: 'text-3xl',
        xxlarge: 'text-5xl',
    };

    return (
        <th
            className={`border-b-2 border-gray-300 px-6 py-3 text-center leading-4 tracking-wider text-beer-draft dark:text-gray-300 
                ${fontFamily} ${sizeClass[size ?? 'medium']}  ${class_}
            `}
            scope={scope}
            onClick={onClick}
        >
            {children}
        </th>
    );
};

export default TH;
