'use client';

import UserRoles from './UserRoles';
import { useTranslations } from 'next-intl';
import { BasicDataForm } from './BasicDataForm';
import { SecretDataForm } from './SecretDataForm';
import { ProducerBasicDataForm } from './ProducerBasicDataForm';
import { IProducerUser } from '@/lib//types/types';

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
                    className="text-5xl lowercase font-semibold text-white font-['NexaRust-script'] text-5xl md:text-8xl -rotate-2 ml-10"
                >
                    {t('profile_title_my_data')}
                </h2>
            </p>

            <BasicDataForm profile={profile} />
            <SecretDataForm />
            <ProducerBasicDataForm profile={profile} />
            <UserRoles />
            {/* <LocationForm profile_location={profile.profile_location} /> */}
        </section>
    );
}
