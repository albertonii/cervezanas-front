import { IDistributorUser } from '@/lib/types/types';
import { useTranslations } from 'next-intl';
import React from 'react';

interface Props {
    distributor: IDistributorUser;
}

const DistributorHistory = ({ distributor }: Props) => {
    const t = useTranslations();

    const { company_history_description, company_history_year } = distributor;

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
                {t('our_company_history')}
            </h2>

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

export default DistributorHistory;
