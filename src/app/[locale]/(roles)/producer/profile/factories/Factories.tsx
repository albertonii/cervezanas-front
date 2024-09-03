'use client';

import ProfileSectionHeader from '@/app/[locale]/components/basic/ProfileSectionHeader';
import { useTranslations } from 'next-intl';

export const Factories = () => {
    const t = useTranslations();

    return (
        <section
            className="px-4 py-6 flex flex-col space-y-4"
            aria-label="Factories"
        >
            <ProfileSectionHeader headerTitle="factories" />
        </section>
    );
};
