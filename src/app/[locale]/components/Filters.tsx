'use client';

import React, { useId } from 'react';
import { useTranslations } from 'next-intl';
import { FilterProps, useAppContext } from '../../context/AppContext';
import { formatCurrency } from '../../../utils/formatCurrency';

export function Filters() {
    const t = useTranslations();

    const { filters, setFilters } = useAppContext();

    const minPriceFilterId = useId();
    const categoryFilterId = useId();

    const handleChangeMinPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        const filtersProps: FilterProps = {
            ...filters,
            minPrice: parseInt(e.target.value),
        };

        setFilters(filtersProps);
    };

    const handleChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const filtersProps: FilterProps = {
            ...filters,
            category: e.target.value,
        };

        setFilters(filtersProps);
    };

    return (
        <section className="flex w-full items-center justify-between font-medium text-white container mx-auto bg-cerv-coal bg-[url('/assets/rec-graf6.png')] bg-contain sm:p-2 lg:p-3">
            <div className="flex items-center gap-4">
                <label htmlFor={minPriceFilterId}>{t('price_starts_at')}</label>
                <input
                    type="range"
                    id={minPriceFilterId}
                    name="price"
                    min="0"
                    max="1000"
                    value={filters.minPrice}
                    onChange={handleChangeMinPrice}
                    className="accent-beer-gold"
                />
                <span>{formatCurrency(filters.minPrice)}</span>
            </div>

            <div className="flex items-center gap-4">
                <label htmlFor={categoryFilterId}>{t('category')}</label>
                <select
                    id={categoryFilterId}
                    value={filters.category}
                    onChange={handleChangeCategory}
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
