import BreweryRRSS from './BreweryRRSS';
import BreweryInfo from './BreweryInfo';
import BreweryLocation from './BreweryLocation';
import BreweryExtraDetails from './BreweryExtraDetails';
import React from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { ModalAddBreweryFormData } from '@/lib/types/types';

interface Props {
    form: UseFormReturn<ModalAddBreweryFormData, any>;
}

const BrewerySection = ({ form }: Props) => {
    const t = useTranslations();

    return (
        <section className="relative border-2 rounded-lg border-gray-200 p-6 bg-white shadow-md space-y-8 mt-8">
            <BreweryInfo form={form} />

            <BreweryExtraDetails form={form} />

            <BreweryLocation form={form} />

            <BreweryRRSS form={form} />
        </section>
    );
};

export default BrewerySection;
