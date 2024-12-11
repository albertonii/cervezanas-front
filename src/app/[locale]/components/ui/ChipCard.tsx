import React, { ComponentProps } from 'react';
import { capitalizeFirstLetter } from '@/utils/formatWords';
import { useTranslations } from 'next-intl';

interface Props {
    content: string;
    handleRemove?: ComponentProps<any>;
}
export function ChipCard({ content, handleRemove }: Props) {
    const t = useTranslations();

    return (
        <div className="inline-flex items-center gap-2 my-1 px-3 py-1 bg-gradient-to-r from-yellow-300 to-yellow-500 dark:from-beer-draft dark:to-beer-dark text-yellow-900 dark:text-yellow-100 rounded-full shadow-lg border border-yellow-400 dark:border-yellow-600">
            <span className="text-md font-normal leading-none ">
                {capitalizeFirstLetter(t(content))}
            </span>

            {handleRemove && (
                <button
                    className="flex flex-auto flex-row-reverse"
                    onClick={() => handleRemove()}
                >
                    &times;
                </button>
            )}
        </div>
    );
}
