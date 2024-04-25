import BoxProductSlotsSelection from './BoxProductSlotsSelection';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ModalAddBoxPackFormData } from '../../../../../lib/types/product';
import { SearchCheckboxProductSlot } from './SearchCheckboxProductSlot';

interface Props {
    form: UseFormReturn<ModalAddBoxPackFormData, any>;
}

export default function BoxProductSlotsSection({ form }: Props) {
    return (
        <section className="grid grid-cols-2 gap-4 pt-6 min-h-[45vh]">
            <div className="col-span-1">
                <BoxProductSlotsSelection />
            </div>

            <div className="col-span-1">
                <SearchCheckboxProductSlot form={form} />
            </div>
        </section>
    );
}
