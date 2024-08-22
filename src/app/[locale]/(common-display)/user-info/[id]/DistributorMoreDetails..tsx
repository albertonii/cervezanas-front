import { IDistributorUser } from '@/lib/types/types';
import { useTranslations } from 'next-intl';
import React from 'react';

interface Props {
    distributor: IDistributorUser;
}

const DistributorMoreDetails = ({ distributor }: Props) => {
    const t = useTranslations();

    const { company_description } = distributor;

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
                {t('distributor_information')}
            </h2>

            <div className="border-l-4 border-beer-blonde pl-4">
                {company_description && (
                    <div className="grid grid-cols-2">
                        <h2 className="font-semibold">
                            {t(
                                'public_user_information.distributor_description',
                            )}
                        </h2>

                        <span className="">{company_description}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DistributorMoreDetails;
