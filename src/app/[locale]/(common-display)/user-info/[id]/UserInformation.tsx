'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { IUserTable } from '@/lib/types/types';
import DistributorInformation from './DistributorInformation';
import ProducerInformation from './ProducerInformation';
import SimilarProfiles from './SimilarProfiles';
import UserProfileCard from './UserProfileCard';
import UserAbout from './UserAbout';

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
                <UserAbout user={user} />

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
            </div>
        </section>
    );
}
