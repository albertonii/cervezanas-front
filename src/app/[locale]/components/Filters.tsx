'use client';

import React, { useId } from 'react';
import { useTranslations } from 'next-intl';
import { FilterProps, useAppContext } from '@/app/context/AppContext';
import { formatCurrency } from '@/utils/formatCurrency';

export function Filters() {
    const t = useTranslations();



    const minPriceFilterId = useId();
    const categoryFilterId = useId();

    const handleChangeMinPrice = (e: React.ChangeEvent<HTMLInputElement>) => {


        
    };

    const handleChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
       
    };


}
