import React, { ComponentProps } from 'react';
import { capitalizeFirstLetter } from '@/utils/formatWords';

interface Props {
    content: string;
    handleRemove: ComponentProps<any>;
}
export function ChipCard({ content, handleRemove }: Props) {
    return (
        <div className="m-1 flex items-center justify-center rounded-full border border-beer-blonde bg-beer-draft px-3 py-2 font-medium text-beer-foam ">
            <span className="text-md max-w-full flex-initial font-normal leading-none ">
                {capitalizeFirstLetter(content)}
            </span>

            <div
                className="flex flex-auto flex-row-reverse"
                onClick={() => handleRemove()}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height="100%"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-x ml-2 h-4 w-4 cursor-pointer rounded-full hover:text-beer-blonde"
                >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </div>
        </div>
    );
}
