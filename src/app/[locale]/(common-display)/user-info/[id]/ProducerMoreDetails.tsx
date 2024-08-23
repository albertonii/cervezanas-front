import React from 'react';
import { useTranslations } from 'next-intl';
import { IProducerUser } from '@/lib/types/types';

interface Props {
    producer: IProducerUser;
}

const ProducerMoreDetails = ({ producer }: Props) => {
    const t = useTranslations();

    const { company_description } = producer;

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 mx-auto">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
                {t('producer_information')}
            </h2>

            <div className="border-l-4 border-beer-blonde pl-4">
                {company_description && (
                    <div className="grid grid-cols-2">
                        <span className="col-span-2">
                            {company_description}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProducerMoreDetails;
