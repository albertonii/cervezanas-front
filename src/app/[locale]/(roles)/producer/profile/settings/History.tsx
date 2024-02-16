'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { User } from '@supabase/supabase-js';
import { HistoryForm } from './HistoryForm';

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
        <section className="px-4 py-6" id="account-container">
          <div className="flex flex-col justify-between py-4" id="header">
            <p className="flex justify-between py-4" id="header">
              <span
                id="title"
                className="text-5xl uppercase font-semibold text-white"
              >
                {t('history_title')}
              </span>
            </p>

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
