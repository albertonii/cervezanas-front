import React from 'react';

interface TDProps {
    children: React.ReactNode;
    class_?: string;
    colSpan?: number;
}

const TD = ({ children, class_, colSpan }: TDProps) => {
    return (
        <td
            className={`px-4 py-2 font-medium text-gray-700 dark:text-gray-300 ${class_}`}
            colSpan={colSpan}
        >
            {children}
        </td>
    );
};

export default TD;
