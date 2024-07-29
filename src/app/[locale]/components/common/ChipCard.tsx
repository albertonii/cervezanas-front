import React, { ComponentProps } from 'react';
import { capitalizeFirstLetter } from '@/utils/formatWords';

interface Props {
    content: string;
    handleRemove: ComponentProps<any>;
}
export function ChipCard({ content, handleRemove }: Props) {
    return (
        <div className="gap-2 my-1 flex items-center justify-center rounded-full px-2.5 py-0.5 shadow-md border border-beer-blonde bg-beer-draft  font-medium text-beer-foam ">
            <span className="text-md max-w-full flex-initial font-normal leading-none ">
                {content}
            </span>

            <button
                className="flex flex-auto flex-row-reverse"
                onClick={() => handleRemove()}
            >
                &times;
            </button>
        </div>
    );
}
