import React from 'react';

const TabButton = ({
    isActive,
    onClick,
    children,
}: {
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) => (
    <button
        type="button"
        onClick={onClick}
        className={`px-6 py-3 font-medium ${
            isActive
                ? 'text-amber-600 border-b-2 border-amber-500'
                : 'text-gray-500 hover:text-gray-700'
        }`}
    >
        {children}
    </button>
);

export default TabButton;
