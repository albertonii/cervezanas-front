import DistributorRRSS from './DistributorRRSS';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { IDistributorUser } from '@/lib/types/types';
import DistributorHistory from './DistributorHistory';

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
        <div className="bg-white shadow-lg rounded-lg p-6 mx-auto">
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
                <span className="tracking-wide">
                    {t('public_user_information.distributor_information_title')}
                </span>

                <DistributorRRSS distributor={distributor} />
            </div>

            <div className="grid gap-y-4 text-sm md:grid-cols-2 text-gray-700">
                {distributor.company_name && (
                    <div className="grid grid-cols-2">
                        <h2 className="font-semibold">
                            {t('public_user_information.distributor_company')}
                        </h2>

                        <span className="px-4 py-2">
                            {distributor.company_name}
                        </span>
                    </div>
                )}

                {distributor.company_phone && (
                    <div className="grid grid-cols-2">
                        <h2 className="font-semibold">
                            {t('public_user_information.distributor_phone')}
                        </h2>

                        <span className="px-4 py-2">
                            {distributor.company_phone}
                        </span>
                    </div>
                )}

                {distributor.company_email && (
                    <div className="grid grid-cols-2">
                        <h2 className="font-semibold">
                            {t('public_user_information.distributor_email')}
                        </h2>

                        <span className="px-4 py-2">
                            <a
                                className="text-beer-gold hover:text-beer-darkGold"
                                href={`mailto:${distributor.company_email}`}
                            >
                                {distributor.company_email}
                            </a>
                        </span>
                    </div>
                )}
            </div>

            {showDistributorFullInfo && (
                <>
                    <section className="text-sm">
                        {/* Description  */}
                        {distributor.company_description && (
                            <div className="grid grid-cols-2">
                                <h2 className="font-semibold">
                                    {t(
                                        'public_user_information.distributor_description',
                                    )}
                                </h2>

                                <span className="px-4 py-2">
                                    {distributor.company_description}
                                </span>
                            </div>
                        )}

                        {/* Contact Information  */}
                        {distributor.company_phone && (
                            <div className="grid grid-cols-2">
                                <h2 className="font-semibold">
                                    {t(
                                        'public_user_information.distributor_contact',
                                    )}
                                </h2>

                                <span className="px-4 py-2">
                                    {distributor.company_phone}
                                </span>
                            </div>
                        )}

                        {distributor.company_email && (
                            <div className="grid grid-cols-2">
                                <h2 className="font-semibold">
                                    {t(
                                        'public_user_information.distributor_email',
                                    )}
                                </h2>

                                <span className="px-4 py-2">
                                    <a
                                        className="text-beer-gold hover:text-beer-darkGold"
                                        href={`mailto:${distributor.company_email}`}
                                    >
                                        {distributor.company_email}
                                    </a>
                                </span>
                            </div>
                        )}
                    </section>

                    <section className="">
                        <DistributorHistory distributor={distributor} />
                    </section>
                </>
            )}

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
