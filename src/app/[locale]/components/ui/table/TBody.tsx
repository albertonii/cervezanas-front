import React from 'react';

interface Props {
    children: React.ReactNode;
    class_?: string;
}

const TBody = ({ children, class_ }: Props) => {
    return (
        <tbody
            className={`bg-white text-beer-dark divide-y divide-gray-200 dark:divide-gray-500 dark:bg-gray-400 dark:text-gray-100 ${class_}`}
        >
            {children}
        </tbody>
    );
};

export default TBody;
