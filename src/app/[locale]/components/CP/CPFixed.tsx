'use client';

import AddCPFixedModal from './AddCPFixedModal';
import React from 'react';
import { useTranslations } from 'next-intl';
import { ListCPFixed } from './ListCPFixed';

interface Props {
    cpsId: string;
    counterCPFixed: number;
}

export function CPFixed({ cpsId, counterCPFixed }: Props) {
    const t = useTranslations();

    return (
        <section className="px-4 py-6" aria-label="Products">
            <header className="flex flex-col space-y-4">
                <div className="w-40">
                    <AddCPFixedModal cpsId={cpsId} />{' '}
                </div>
            </header>

            <ListCPFixed cpsId={cpsId} counterCPFixed={counterCPFixed} />
        </section>
    );
}
