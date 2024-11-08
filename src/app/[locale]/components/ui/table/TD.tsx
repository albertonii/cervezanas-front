import React from 'react';

interface TDProps {
    children: React.ReactNode;
    class_?: string;
}

const TD = ({ children, class_ }: TDProps) => {
    return (
        <td
            className={`px-6 py-4 font-semibold text-beer-blonde bg-gray-50 dark:text-gray-300 dark:bg-beer-draft ${class_}`}
        >
            {children}
        </td>
    );
};

export default TD;
