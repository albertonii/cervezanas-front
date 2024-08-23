import React from 'react';
import { useTranslations } from 'next-intl';
import { IProducerUser } from '@/lib/types/types';

interface Props {
    producer: IProducerUser;
}

const ProducerContactInformation = ({ producer }: Props) => {
    const t = useTranslations();

    const { company_phone, company_email } = producer;

    return (
        <div className="bg-white shadow-lg rounded-lg p-6  mx-auto">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
                {t('contact')}
            </h2>

            <div className="border-l-4 border-beer-blonde pl-4">
                {company_phone && (
                    <div className="grid grid-cols-2">
                        <h2 className="font-semibold">
                            {t('public_user_information.producer_contact')}
                        </h2>

                        <span className="">{company_phone}</span>
                    </div>
                )}

                {company_email && (
                    <div className="grid grid-cols-2">
                        <h2 className="font-semibold">
                            {t('public_user_information.producer_email')}
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

export default ProducerContactInformation;
