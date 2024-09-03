'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { User } from '@supabase/supabase-js';
import { HistoryForm } from './HistoryForm';
import ProfileSectionHeader from '@/app/[locale]/components/basic/ProfileSectionHeader';

interface Props {
    user: User | null;
}

export function History(props: Props) {
    const { user } = props;
    const t = useTranslations();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user != null && user != undefined) {
            setLoading(false);
        }

        return () => {
            setLoading(true);
        };
    }, [user]);

    return (
        <>
            {loading ? (
                <span>{t('loading')} </span>
            ) : (
                <section
                    className="px-4 py-6 flex flex-col justify-between py-4"
                    id="account-container"
                >
                    <ProfileSectionHeader
                        headerTitle="history_title"
                        headerDescription={'history_description_producer'}
                    />

                    {/* <HistoryForm /> */}
                </section>
            )}
        </>
    );
}
