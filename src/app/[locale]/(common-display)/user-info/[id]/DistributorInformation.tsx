import DistributorRRSS from './DistributorRRSS';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { IDistributorUser } from '@/lib/types/types';
import DistributorHistory from './DistributorHistory';
import DistributorContactInformation from './DistributorContactInformation';
import DistributorMoreDetails from './DistributorMoreDetails.';
import SubRegionTable from '@/app/[locale]/(roles)/distributor/profile/logistics/(sub_region)/SubRegionTable';
import DistributorCoverageAreas from './DistributorCoverageAreas';

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
        <section className="bg-white shadow-lg rounded-lg p-6 mx-auto space-y-4">
            <div className="relative flex items-center space-x-3 text-lg font-semibold text-gray-900 mb-4">
                <span className="text-beer-gold">
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

            <div className="bg-white shadow-lg rounded-lg p-6 mx-auto">
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
                <section className="grid grid-cols-2 gap-2">
                    {distributor.company_description && (
                        <section className="text-sm col-span-1">
                            <DistributorMoreDetails distributor={distributor} />
                        </section>
                    )}

                    <section className="col-span-1">
                        <DistributorContactInformation
                            distributor={distributor}
                        />
                    </section>

                    {distributor.company_vision ||
                        distributor.company_mission ||
                        distributor.company_values ||
                        distributor.company_history_year ||
                        (distributor.company_history_description && (
                            <section className="col-span-2">
                                <DistributorHistory distributor={distributor} />
                            </section>
                        ))}

                    <section className="col-span-2">
                        <DistributorCoverageAreas distributor={distributor} />
                    </section>
                </section>
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
        </section>
    );
};

export default DistributorInformation;
