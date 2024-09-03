'use client';

import UserRoles from './UserRoles';
import { RRSSForm } from './RRSSForm';
import { useTranslations } from 'next-intl';
import { BasicDataForm } from './BasicDataForm';
import { SecretDataForm } from './SecretDataForm';
import { IProducerUser } from '@/lib//types/types';
import { ProducerBasicDataForm } from './ProducerBasicDataForm';
import { CompanyHistoryForm } from './CompanyHistoryForm';
import ProfileSectionHeader from '@/app/[locale]/components/basic/ProfileSectionHeader';

interface Props {
    profile: IProducerUser;
}

export function Account({ profile }: Props) {
    if (!profile) return <></>;

    const t = useTranslations();

    return (
        <section className="px-4 py-6" id="account">
            <ProfileSectionHeader headerTitle="profile_title_my_data" />

            <BasicDataForm profile={profile} />
            <ProducerBasicDataForm profile={profile} />
            <RRSSForm profile={profile} />
            <CompanyHistoryForm profile={profile} />
            <SecretDataForm />
            <UserRoles />
            {/* <LocationForm profile_location={profile.profile_location} /> */}
        </section>
    );
}
