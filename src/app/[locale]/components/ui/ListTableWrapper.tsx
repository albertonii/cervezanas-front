import { useTranslations } from 'next-intl';
import React from 'react';
import Spinner from './Spinner';

interface Props {
    isError: boolean;
    isLoading: boolean;
    errorMessage?: string;
    children: React.ReactNode;
}

const ListTableWrapper = ({
    isError,
    isLoading,
    errorMessage,
    children,
}: Props) => {
    const t = useTranslations();

    return (
        <section className="bg-beer-foam relative mt-2 rounded-md border-2 border-beer-blonde px-2 py-4 shadow-xl dark:bg-gray-600">
            {isError && (
                <p className="flex items-center justify-center">
                    <h2 className="text-gray-500 dark:text-gray-400">
                        {errorMessage ? t(errorMessage) : t('error_message')}
                    </h2>
                </p>
            )}

            {isLoading && (
                <Spinner
                    color="beer-blonde"
                    size="xLarge"
                    absolute
                    flexCenter
                />
            )}

            {children}
        </section>
    );
};

export default ListTableWrapper;
