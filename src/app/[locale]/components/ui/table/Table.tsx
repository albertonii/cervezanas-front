import React from 'react';

interface Props {
    children: React.ReactNode;
    class_?: string;
}

const Table = ({ children, class_ }: Props) => {
    return (
        <table
            className={`min-w-full divide-y divide-gray-200 dark:divide-gray-700' ${class_}`}
        >
            {children}
        </table>
    );
};

export default Table;
