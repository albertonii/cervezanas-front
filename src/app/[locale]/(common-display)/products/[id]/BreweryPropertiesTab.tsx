import React from 'react';
import { useTranslations } from 'next-intl';
import { IBrewery } from '@/lib/types/types';
import Title from '@/app/[locale]/components/ui/Title';

interface Props {
    brewery: IBrewery;
}

const BreweryPropertiesTab = ({ brewery }: Props) => {
    const t = useTranslations();

    return (
        <div className="max-w-4xl mx-auto p-10 bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Título de la fábrica */}
            <Title size="xlarge" color="black">
                {brewery.name}
            </Title>

            {/* Información de la fábrica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-lg text-gray-700 space-y-3">
                    <p>
                        <span className="font-medium text-gray-600">
                            {t('brewery.foundation_year')}:{' '}
                        </span>
                        {brewery.foundation_year}
                    </p>
                    <p>
                        <span className="font-medium text-gray-600">
                            {t('country')}:{' '}
                        </span>
                        {brewery.country}, {brewery.city}
                    </p>
                    <p>
                        <span className="font-medium text-gray-600">
                            {t('address')}:{' '}
                        </span>
                        {brewery.address}
                    </p>
                </div>

                <div className="text-lg text-gray-700 space-y-3">
                    <p>
                        <span className="font-medium text-gray-600">
                            {t('website')}:{' '}
                        </span>
                        <a
                            href={brewery.website}
                            className="text-blue-500 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {brewery.website}
                        </a>
                    </p>
                    <p>
                        <span className="font-medium text-gray-600">
                            {t('brewery.guided_tours')}:{' '}
                        </span>
                        {brewery.guided_tours || t('not_available')}
                    </p>
                </div>
            </div>

            {/* Historia y descripción */}
            {brewery.history && (
                <div className="mt-10">
                    <h4 className="text-xl font-semibold text-gray-800 mb-3">
                        {t('brewery.history')}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                        {brewery.history}
                    </p>
                </div>
            )}

            {brewery.description && (
                <div className="mt-10">
                    <h4 className="text-xl font-semibold text-gray-800 mb-3">
                        {t('brewery.description')}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                        {brewery.description}
                    </p>
                </div>
            )}

            {/* Logo */}
            {brewery.logo && (
                <div className="mt-10 flex justify-center">
                    <img
                        src={brewery.logo}
                        alt={`${brewery.name} logo`}
                        className="w-32 h-32 object-contain rounded-full border border-gray-300"
                    />
                </div>
            )}
        </div>
    );
};

export default BreweryPropertiesTab;
