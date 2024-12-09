import React from 'react';

interface Props {
    children: React.ReactNode;
    scope?: 'col' | 'row';
    fontFamily?: string;
    size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';
    class_?: string;
    onClick?: () => void;
    colSpan?: number;
}

const TH = ({
    children,
    scope,
    fontFamily,
    size = 'medium',
    class_,
    onClick,
    colSpan,
}: Props) => {
    const sizeClass = {
        xsmall: 'text-sm',
        small: 'text-md',
        medium: 'text-base',
        large: 'text-2xl',
        xlarge: 'text-3xl',
        xxlarge: 'text-5xl',
    };

    return (
        <th
            className={`border-b-2 border-gray-300 px-2 lg:px-4 py-2 text-center leading-4 tracking-wider text-beer-draft dark:text-gray-300 
                ${fontFamily} ${sizeClass[size]} ${class_}
            `}
            scope={scope}
            onClick={onClick}
            colSpan={colSpan}
        >
            {children}
        </th>
    );
};

export default TH;
