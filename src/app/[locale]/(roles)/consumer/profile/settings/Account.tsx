'use client';

import { useTranslations } from 'next-intl';
import { IUserTable } from '@/lib//types/types';
import UserRoles from '../../../producer/profile/settings/UserRoles';
import { BasicDataForm } from './BasicDataForm';
import { CustomizeProfileForm } from './CustomizeProfileForm';
import { SecretDataForm } from './SecretDataForm';

interface Props {
    profile: IUserTable;
}

export function Account({ profile }: Props) {
    if (!profile) return <></>;

    const t = useTranslations();

    return (
        <section className="px-4 py-6" id="account-container">
            <p className="flex justify-between py-4" id="header">
                <span
                    id="title"
                    className="text-5xl lowercase font-semibold text-white font-['NexaRust-script'] text-5xl md:text-8xl -rotate-2 ml-10"
                >
                    {t('profile_title_my_data')}
                </span>
            </p>

            <BasicDataForm profile={profile} />
            <SecretDataForm />
            {/* <LocationForm profile_location={profile.profile_location} /> */}
            <CustomizeProfileForm profile={profile} />
            <UserRoles />
        </section>
    );
}
