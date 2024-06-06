import React from 'react';
import { ModalAddProductFormData } from '../../../lib/types/types';
import StockInformation from './StockInformation';
import ProductPackInformation from './ProductPackInformation';
import { UseFormReturn } from 'react-hook-form';

interface Props {
    form: UseFormReturn<ModalAddProductFormData, any>;
}

export default function StockInformationDetailsAndPacksAdd({ form }: Props) {
    return (
        <section className="pt-8">
            <div className="flex w-full flex-col space-y-16">
                <StockInformation form={form} />

                {/* Packs */}
                <ProductPackInformation form={form} />
            </div>
        </section>
    );
}
