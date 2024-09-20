'use client';

import React, { useId } from 'react';
import { useTranslations } from 'next-intl';
import { FilterProps, useAppContext } from '@/app/context/AppContext';

export function Filters() {
    const t = useTranslations();

    const { filters, handleFilters } = useAppContext();

    const familyFilterId = useId();

    const handleChangeFamily = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === 'all') {
            const filtersProps: FilterProps = {
                ...filters,
                family: [],
            };

            handleFilters(filtersProps);

            return;
        }

        const filtersProps: FilterProps = {
            ...filters,
            family: [e.target.value],
        };

        handleFilters(filtersProps);
    };

    return (
        <section className="flex w-full items-center justify-between font-medium text-white container mx-auto bg-cerv-coal bg-[url('/assets/rec-graf6.png')] bg-contain sm:p-2 lg:p-3">
            <div className="flex items-center gap-4">
                <label htmlFor={familyFilterId}>{t('family')}</label>
                <select
                    id={familyFilterId}
                    value={filters.family}
                    onChange={handleChangeFamily}
                    className="bg-white text-black p-2 rounded-md"
                >
                    <option value="all">{t('all')}</option>
                    <option value="lager">{t('lager')}</option>
                    <option value="ale">{t('ale')}</option>
                    <option value="stout">{t('stout')}</option>
                    <option value="ipa">{t('ipa')}</option>
                    <option value="merchandising">{t('merchandising')}</option>
                </select>
            </div>
        </section>
    );
}
