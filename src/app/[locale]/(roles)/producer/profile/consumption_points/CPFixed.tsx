'use client';

import React from 'react';
import AddCPFixedModal from './AddCPFixedModal';
import { useTranslations } from 'next-intl';
import { ListCPFixed } from './ListCPFixed';

interface Props {
    cpsId: string;
}

export function CPFixed({ cpsId }: Props) {
    const t = useTranslations();

    return (
        <section className="px-4 py-6" aria-label="Products">
            <header className="flex flex-col space-y-4">
                {/* <p className="flex justify-between py-4" id="header">
          <span
            id="title"
            className="text-5xl uppercase font-semibold text-white"
          >
            {t('cp_fixed_list')}
          </span>
        </p> */}

                <div className="w-40">
                    <AddCPFixedModal cpsId={cpsId} />{' '}
                </div>
            </header>

            <ListCPFixed cpsId={cpsId} />
        </section>
    );
}
