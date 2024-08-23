'use client';

import UserRoles from '../../../producer/profile/settings/UserRoles';
import { RRSSForm } from './RRSSForm';
import { useTranslations } from 'next-intl';
import { BasicDataForm } from './BasicDataForm';
import { SecretDataForm } from './SecretDataForm';
import { IDistributorUser } from '@/lib//types/types';
import { CompanyHistoryForm } from './CompanyHistoryForm';
import { DistributorBasicDataForm } from './DistributorBasicDataForm';

interface Props {
    profile: IDistributorUser;
}

export function Account({ profile }: Props) {
    if (!profile) return <></>;

    const t = useTranslations();

    return (
        <section className="px-4 py-6" id="account-container">
            <p className="flex justify-between py-4" id="header">
                <h2
                    id="title"
                    className="text-5xl uppercase font-semibold text-white"
                >
                    {t('profile_title_my_data')}
                </h2>
            </p>

            <BasicDataForm profile={profile} />
            <DistributorBasicDataForm profile={profile} />
            <RRSSForm profile={profile} />
            <CompanyHistoryForm profile={profile} />
            <SecretDataForm />
            <UserRoles />

            {/* <LocationForm profile_location={profile.profile_location} /> */}
            {/* <CustomizeProfileForm profile={profile} /> */}
        </section>
    );
}
