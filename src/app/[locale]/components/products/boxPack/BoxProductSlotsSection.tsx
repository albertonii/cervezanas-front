import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ModalAddBoxPackFormData } from '../../../../../lib/types/product';
import { SearchCheckboxProductSlot } from './SearchCheckboxProductSlot';

interface Props {
    form: UseFormReturn<ModalAddBoxPackFormData, any>;
}

export default function BoxProductSlotsSection({ form }: Props) {
    return (
        <section className="relative flex-auto pt-6">
            <SearchCheckboxProductSlot form={form} />
        </section>
    );
}
