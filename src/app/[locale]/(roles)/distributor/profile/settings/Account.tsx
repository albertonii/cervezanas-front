'use client';

import { useTranslations } from 'next-intl';
import { IDistributorUser } from '@/lib//types/types';
import { SecretDataForm } from './SecretDataForm';
import { CustomizeProfileForm } from './CustomizeProfileForm';
import { BasicDataForm } from './BasicDataForm';
import { DistributorBasicDataForm } from './DistributorBasicDataForm';
import UserRoles from '../../../producer/profile/settings/UserRoles';

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
                    className="lowercase font-semibold text-white font-['NexaRust-script'] text-5xl md:text-8xl -rotate-2 ml-10"
                >
                    {t('profile_title_my_data')}
                </h2>
            </p>

            <BasicDataForm profile={profile} />
            <DistributorBasicDataForm profile={profile} />
            <SecretDataForm />
            <UserRoles />

            {/* <LocationForm profile_location={profile.profile_location} /> */}
            {/* <CustomizeProfileForm profile={profile} /> */}
        </section>
    );
}
