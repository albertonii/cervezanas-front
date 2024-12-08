import React from 'react';

interface Props {
    children: React.ReactNode;
    class_?: string;
}

const TBody = ({ children, class_ }: Props) => {
    return (
        <tbody
            className={`bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700 ${class_}`}
        >
            {children}
        </tbody>
    );
};

export default TBody;
