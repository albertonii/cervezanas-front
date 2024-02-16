'use client';

import { useTranslations } from 'next-intl';

export const Factories = () => {
  const t = useTranslations();

  return (
    <section className="px-4 py-6 " aria-label="Factories">
      <div className="flex flex-col space-y-4">
        <p className="flex justify-between py-4" id="header">
          <span
            id="title"
            className="text-5xl uppercase font-semibold text-white"
          >
            {t('factories')}
          </span>
        </p>
      </div>
    </section>
  );
};
