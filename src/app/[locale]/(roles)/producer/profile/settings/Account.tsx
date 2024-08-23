'use client';

import UserRoles from './UserRoles';
import { RRSSForm } from './RRSSForm';
import { useTranslations } from 'next-intl';
import { BasicDataForm } from './BasicDataForm';
import { SecretDataForm } from './SecretDataForm';
import { IProducerUser } from '@/lib//types/types';
import { ProducerBasicDataForm } from './ProducerBasicDataForm';

interface Props {
    profile: IProducerUser;
}

export function Account({ profile }: Props) {
    if (!profile) return <></>;

    const t = useTranslations();

    return (
        <section className="px-4 py-6" id="account">
            <p className="flex justify-between py-4" id="header">
                <h2
                    id="title"
                    className="text-5xl uppercase font-semibold text-white"
                >
                    {t('profile_title_my_data')}
                </h2>
            </p>

            <BasicDataForm profile={profile} />
            <SecretDataForm />
            <RRSSForm profile={profile} />
            <ProducerBasicDataForm profile={profile} />
            <UserRoles />
            {/* <LocationForm profile_location={profile.profile_location} /> */}
        </section>
    );
}
