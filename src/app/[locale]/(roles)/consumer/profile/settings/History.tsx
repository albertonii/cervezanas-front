'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { User } from '@supabase/supabase-js';

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
                <div>{t('loading')} </div>
            ) : (
                <section className="px-4 py-6" id="history-container">
                    <div
                        className="flex flex-col justify-between py-4"
                        id="header"
                    >
                        <header
                            className="flex justify-between py-4"
                            id="header"
                        >
                            <h1
                                id="title"
                                className="text-4xl font-['NexaRust-script']"
                            >
                                {t('history_title')}
                            </h1>
                        </header>

                        <h3 id="rrss" className="text-lg">
                            {t('history_description_producer')}
                        </h3>
                    </div>

                    {/* <HistoryForm /> */}
                </section>
            )}
        </>
    );
}
