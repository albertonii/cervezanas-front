import React from 'react';

type Props = {
    children: React.ReactNode;
};

export default function Label({ children }: Props) {
    return (
        <label className="flex text-gray-800 h-12 flex-col items-start space-y-2">
            {children}
        </label>
    );
}
