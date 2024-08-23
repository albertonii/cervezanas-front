import { IProducerUser } from '@/lib/types/types';
import { useTranslations } from 'next-intl';
import React from 'react';

interface Props {
    producer: IProducerUser;
}

const ProducerHistory = ({ producer }: Props) => {
    const t = useTranslations();

    const {
        company_history_description,
        company_history_year,
        company_vision,
        company_mission,
        company_values,
    } = producer;

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 mx-auto">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
                {t('our_company_history')}
            </h2>

            <div className="flex justify-between gap-2">
                {company_vision && (
                    <div className="mb-6 w-full">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">
                            {t('public_user_information.our_company_vision')}
                        </h3>
                        <p className="text-base text-gray-600">
                            {company_vision}
                        </p>
                    </div>
                )}

                {company_mission && (
                    <div className="mb-6 w-full">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">
                            {t('public_user_information.our_company_mission')}
                        </h3>
                        <p className="text-base text-gray-600">
                            {company_mission}
                        </p>
                    </div>
                )}

                {company_values && (
                    <div className="mb-6 w-full">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">
                            {t('public_user_information.our_company_values')}
                        </h3>
                        <ul className="list-disc list-inside text-base text-gray-600">
                            {company_values.split(',').map((value, index) => (
                                <li key={index}>{value.trim()}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="border-l-4 border-beer-blonde pl-4">
                {company_history_year && (
                    <div className="mb-2">
                        <p className="text-xl font-semibold text-gray-700">
                            {company_history_year}
                        </p>
                    </div>
                )}

                {company_history_description && (
                    <div className="mt-2">
                        <p className="text-base text-gray-600">
                            {company_history_description}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProducerHistory;
