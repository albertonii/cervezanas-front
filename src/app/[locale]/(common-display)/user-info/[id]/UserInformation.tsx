'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { IUserTable } from '@/lib//types/types';
import DistributorInformation from './DistributorInformation';
import ProducerInformation from './ProducerInformation';
import SimilarProfiles from './SimilarProfiles';
import UserProfileCard from './UserProfileCard';

interface Props {
    user: IUserTable;
}

export default function UserInformation({ user }: Props) {
    const t = useTranslations();

    const [showBasicFullInfo, setShowBasicFullInfo] = useState(false);

    const handleShowBasicFullInfo = () => {
        setShowBasicFullInfo(!showBasicFullInfo);
    };

    return (
        <section className="container mx-auto my-5 p-5 no-wrap md:-mx-2 grid grid-cols-12 gap-4">
            {/*  Left Side  */}
            <div className="col-span-12 sm:col-span-3">
                <UserProfileCard user={user} />

                <div className="my-4"></div>

                <SimilarProfiles />
            </div>

            {/*  Right Side  */}
            <div className="col-span-12 sm:col-span-9 space-y-4">
                {/*  Profile tab -->
                 About Section  */}
                <div className="rounded-lg bg-white p-6 shadow-lg">
                    <div className="flex items-center space-x-2 font-semibold leading-8 text-gray-900">
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
                        <span className="tracking-wide">About</span>
                    </div>

                    <div className="mt-4 text-gray-700">
                        <div className="grid text-sm md:grid-cols-2">
                            <div className="grid grid-cols-2 py-2">
                                <div className="font-semibold">{t('name')}</div>
                                <div>{user.name}</div>
                            </div>
                            <div className="grid grid-cols-2 py-2">
                                <div className="font-semibold">
                                    {t('lastname')}
                                </div>
                                <div>{user.lastname}</div>
                            </div>

                            <div className="grid grid-cols-2 py-2">
                                <div className="font-semibold">
                                    {t('phone')}
                                </div>
                                <div>+11 998001001</div>
                            </div>

                            <address className="grid grid-cols-2 py-2">
                                <div className="font-semibold">
                                    {t('address')}
                                </div>
                                <div>
                                    {/* {user.profile_location[0].address_1 ??
                      "" + " " + user.profile_location[0].address_2 ??
                      ""}

                    <br />

                    {user.profile_location[0].postalcode ?? ""} */}
                                </div>
                            </address>
                            <div className="grid grid-cols-2 py-2">
                                <div className="font-semibold">
                                    Permanent Address
                                </div>
                                <div>Arlington Heights, IL, Illinois</div>
                            </div>

                            <div className="grid grid-cols-2 py-2">
                                <div className="font-semibold">
                                    {t('email')}
                                </div>
                                <div>
                                    <a
                                        className="text-beer-gold hover:text-beer-darkGold"
                                        href={`mailto:${user.email}`}
                                    >
                                        {user.email}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        className="focus:shadow-outline hover:shadow-xs my-4 block w-full rounded-lg p-3 text-sm font-semibold text-beer-gold hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                        onClick={handleShowBasicFullInfo}
                    >
                        {showBasicFullInfo
                            ? `${t('hide_full_info')}`
                            : `${t('show_full_info')}`}
                    </button>
                </div>
                {/*  End of about section  */}

                {/* Información del distribuidor  */}
                {user.distributor_user && (
                    <DistributorInformation
                        distributor={user.distributor_user}
                    />
                )}

                {/* Información si es productor  */}
                {user.producer_user && (
                    <ProducerInformation producer={user.producer_user} />
                )}

                {/*  End of profile tab  */}
            </div>
        </section>
    );
}
