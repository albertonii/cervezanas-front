'use client';

import { useTranslations } from 'next-intl';
import { IConsumptionPointUser } from '@/lib//types/types';
import { BasicDataForm } from './BasicDataForm';
import { ConsumptionPointBasicDataForm } from './ConsumptionPointBasicDataForm';
import { SecretDataForm } from './SecretDataForm';

interface Props {
    profile: IConsumptionPointUser;
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
            <ConsumptionPointBasicDataForm profile={profile} />
            <SecretDataForm />
            {/* <LocationForm profile_location={profile.profile_location} /> */}
        </section>
    );
}
