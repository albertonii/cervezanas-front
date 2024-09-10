'use client';

import UserRoles from '../../../../components/common/UserRoles';
import ProfileSectionHeader from '@/app/[locale]/components/basic/ProfileSectionHeader';
import { useTranslations } from 'next-intl';
import { IUserTable } from '@/lib//types/types';
import { BasicDataForm } from './BasicDataForm';
import { SecretDataForm } from './SecretDataForm';
import { CustomizeProfileForm } from './CustomizeProfileForm';

interface Props {
    profile: IUserTable;
}

export function Account({ profile }: Props) {
    if (!profile) return <></>;

    const t = useTranslations();

    return (
        <section className="px-4 py-6" id="account-container">
            <ProfileSectionHeader headerTitle="profile_title_my_data" />

            <BasicDataForm profile={profile} />
            <SecretDataForm />
            {/* <LocationForm profile_location={profile.profile_location} /> */}
            <CustomizeProfileForm profile={profile} />
            <UserRoles />
        </section>
    );
}
