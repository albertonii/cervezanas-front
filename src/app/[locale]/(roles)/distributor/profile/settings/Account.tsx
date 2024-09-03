'use client';

import UserRoles from '../../../producer/profile/settings/UserRoles';
import { RRSSForm } from './RRSSForm';
import { useTranslations } from 'next-intl';
import { BasicDataForm } from './BasicDataForm';
import { SecretDataForm } from './SecretDataForm';
import { IDistributorUser } from '@/lib//types/types';
import { CompanyHistoryForm } from './CompanyHistoryForm';
import { DistributorBasicDataForm } from './DistributorBasicDataForm';
import ProfileSectionHeader from '@/app/[locale]/components/basic/ProfileSectionHeader';

interface Props {
    profile: IDistributorUser;
}

export function Account({ profile }: Props) {
    if (!profile) return <></>;

    const t = useTranslations();

    return (
        <section className="px-4 py-6" id="account-container">
            <ProfileSectionHeader headerTitle="profile_title_my_data" />

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
