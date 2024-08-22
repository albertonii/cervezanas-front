import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { IDistributorUser } from '@/lib/types/types';
import DistributorRRSS from './DistributorRRSS';

interface Props {
    distributor: IDistributorUser;
}

const DistributorInformation = ({ distributor }: Props) => {
    const t = useTranslations();

    const [showDistributorFullInfo, setShowDistributorFullInfo] =
        useState(false);

    const handleShowDistributorFullInfo = () => {
        setShowDistributorFullInfo(!showDistributorFullInfo);
    };

    return (
        <div className="rounded-sm bg-white p-3 shadow-sm">
            <div className="relative flex items-center space-x-2 font-semibold leading-8 text-gray-900">
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
                <span className="tracking-wide">
                    {t('public_user_information.distributor_information_title')}
                </span>

                <DistributorRRSS distributor={distributor} />
            </div>

            <div className="text-gray-700">
                <div className="grid text-sm md:grid-cols-2">
                    {distributor.company_name && (
                        <div className="grid grid-cols-2">
                            <div className="px-4 py-2 font-semibold">
                                {t(
                                    'public_user_information.distributor_company',
                                )}
                            </div>
                            <div className="px-4 py-2">
                                {distributor.company_name}
                            </div>
                        </div>
                    )}

                    {distributor.company_phone && (
                        <div className="grid grid-cols-2">
                            <div className="px-4 py-2 font-semibold">
                                {t('public_user_information.distributor_phone')}
                            </div>
                            <div className="px-4 py-2">
                                {distributor.company_phone}
                            </div>
                        </div>
                    )}

                    {distributor.company_email && (
                        <div className="grid grid-cols-2">
                            <div className="px-4 py-2 font-semibold">
                                {t('public_user_information.distributor_email')}
                            </div>
                            <div className="px-4 py-2">
                                <a
                                    className="text-beer-gold hover:text-beer-darkGold"
                                    href={`mailto:${distributor.company_email}`}
                                >
                                    {distributor.company_email}
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showDistributorFullInfo && <section></section>}

            <button
                className="focus:shadow-outline hover:shadow-xs my-4 block w-full rounded-lg p-3 text-sm font-semibold text-beer-gold hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                onClick={handleShowDistributorFullInfo}
            >
                {showDistributorFullInfo
                    ? `${t('hide_full_info')}`
                    : `${t('show_full_info')}`}
            </button>

            {/*  End of distributor information  */}
        </div>
    );
};

export default DistributorInformation;
