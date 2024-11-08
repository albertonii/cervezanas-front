import React from 'react';

interface Props {
    children: React.ReactNode;
}

const THead = ({ children }: Props) => {
    return (
        <thead className="bg-beer-softBlonde text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            {children}
        </thead>
    );
};

export default THead;
