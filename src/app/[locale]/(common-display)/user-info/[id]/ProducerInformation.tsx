import React, { useState } from 'react';
import { IProducerUser } from '@/lib/types/types';
import { useTranslations } from 'next-intl';

interface Props {
    producer: IProducerUser;
}

const ProducerInformation = ({ producer }: Props) => {
    const t = useTranslations();

    const [showProducerFullInfo, setShowProducerFullInfo] = useState(false);

    const handleShowProducerFullInfo = () => {
        setShowProducerFullInfo(!showProducerFullInfo);
    };

    return (
        <section className="bg-white shadow-lg rounded-lg p-6 mx-auto space-y-4">
            <div className="relative flex items-center space-x-3 text-lg font-semibold text-gray-900 mb-4">
                <span className=" text-beer-gold">
                    <svg
                        className="h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                    </svg>
                </span>
                <span className="tracking-wide">Producer Information</span>
            </div>
            <div className="text-gray-700">
                <div className="grid text-sm md:grid-cols-2">
                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">
                            {t('company')}
                        </div>
                        <div className="px-4 py-2">{producer.company_name}</div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">
                            {t('phone')}
                        </div>
                        <div className="px-4 py-2">665 668 994</div>
                    </div>

                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">
                            {t('address')}
                        </div>
                        <div className="px-4 py-2">prueba</div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="px-4 py-2 font-semibold">
                            {t('email')}
                        </div>
                        <div className="px-4 py-2">
                            {/* <a
                                className="text-beer-gold hover:text-beer-darkGold"
                                href={`mailto:${producer.company_email}`}
                            >
                                {producer.company_email}
                            </a> */}
                        </div>
                    </div>
                </div>
            </div>

            {showProducerFullInfo && <section></section>}

            <button
                className="focus:shadow-outline hover:shadow-xs my-4 block w-full rounded-lg p-3 text-sm font-semibold text-beer-gold hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                onClick={handleShowProducerFullInfo}
            >
                {showProducerFullInfo
                    ? `${t('hide_full_info')}`
                    : `${t('show_full_info')}`}
            </button>
        </section>
    );
};

export default ProducerInformation;
