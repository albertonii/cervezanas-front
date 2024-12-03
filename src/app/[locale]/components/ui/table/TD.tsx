import React from 'react';

interface TDProps {
    children: React.ReactNode;
    class_?: string;
    colSpan?: number;
}

const TD = ({ children, class_, colSpan }: TDProps) => {
    return (
        <td
            className={`px-6 py-4 font-semibold text-bear-dark bg-gray-50 dark:text-gray-300 dark:bg-beer-draft ${class_}`}
            colSpan={colSpan}
        >
            {children}
        </td>
    );
};

export default TD;
