'use client';

import React from 'react';
import AddCPFixedModal from './AddCPFixedModal';
import { useTranslations } from 'next-intl';
import { ListCPFixed } from './ListCPFixed';
import { ICPFixed } from '@/lib//types/types';

interface Props {
    cpsFixed: ICPFixed[];
}

export function CPFixed({ cpsFixed }: Props) {
    const t = useTranslations();

    return (
        <section className="px-4 py-6" aria-label="Products">
            <header className="flex flex-col space-y-4">
                <p className="flex justify-between py-4" id="header">
                    <span
                        id="title"
                        className="text-5xl uppercase font-semibold text-white"
                    >
                        {t('cp_fixed_list')}
                    </span>
                </p>
            </header>

            <ListCPFixed cpsFixed={cpsFixed} />
        </section>
    );
}
