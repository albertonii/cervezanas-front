'use client';

import { useTranslations } from 'next-intl';
import { IConsumptionPointUser } from '@/lib//types/types';
import { BasicDataForm } from './BasicDataForm';
import { ConsumptionPointBasicDataForm } from './ConsumptionPointBasicDataForm';
import { SecretDataForm } from './SecretDataForm';
import ProfileSectionHeader from '@/app/[locale]/components/ui/ProfileSectionHeader';

interface Props {
    profile: IConsumptionPointUser;
}

export function Account({ profile }: Props) {
    if (!profile) return <></>;

    const t = useTranslations();

    return (
        <section className="px-4 py-6" id="account">
            <ProfileSectionHeader headerTitle="profile_title_my_data" />

            <BasicDataForm profile={profile} />
            <ConsumptionPointBasicDataForm profile={profile} />
            <SecretDataForm />
            {/* <LocationForm profile_location={profile.profile_location} /> */}
        </section>
    );
}
