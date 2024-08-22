import { IDistributorUser } from '@/lib/types/types';
import { useTranslations } from 'next-intl';
import React from 'react';

interface Props {
    distributor: IDistributorUser;
}

const DistributorContactInformation = ({ distributor }: Props) => {
    const t = useTranslations();

    const { company_phone, company_email } = distributor;

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
                {t('contact')}
            </h2>

            <div className="border-l-4 border-beer-blonde pl-4">
                {company_phone && (
                    <div className="grid grid-cols-2">
                        <h2 className="font-semibold">
                            {t('public_user_information.distributor_contact')}
                        </h2>

                        <span className="">{company_phone}</span>
                    </div>
                )}

                {company_email && (
                    <div className="grid grid-cols-2">
                        <h2 className="font-semibold">
                            {t('public_user_information.distributor_email')}
                        </h2>

                        <span className="overflow-x-auto ">
                            <a
                                className="text-beer-gold hover:text-beer-darkGold"
                                href={`mailto:${company_email}`}
                            >
                                {company_email}
                            </a>
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DistributorContactInformation;
