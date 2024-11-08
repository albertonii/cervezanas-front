import React from 'react';

interface TDProps {
    children: React.ReactNode;
    class_?: string;
}

const TDActions = ({ children, class_ }: TDProps) => {
    return (
        <td
            className={`flex items-center px-6 py-4 font-semibold text-beer-blonde hover:text-beer-draft dark:text-beer-softBlonde ${class_}`}
        >
            {children}
        </td>
    );
};

export default TDActions;
