import BoxProductSlotsSelection from './BoxProductSlotsSelection';
import React, { useEffect, useState } from 'react';
import InputLabel from '../../common/InputLabel';
import { UseFormReturn } from 'react-hook-form';
import { ModalAddBoxPackFormData } from '../../../../../lib/types/product';
import { SearchCheckboxProductSlot } from './SearchCheckboxProductSlot';
import useBoxPackStore from '../../../../store/boxPackStore';

interface Props {
    form: UseFormReturn<ModalAddBoxPackFormData, any>;
}

export default function BoxProductSlotsSection({ form }: Props) {
    const { onChangeSlotsPerBox } = useBoxPackStore();

    return (
        <section className="grid grid-cols-2 gap-4 pt-6 min-h-[45vh]">
            <div className="col-span-2">
                <InputLabel
                    label="slots_per_box"
                    form={form}
                    registerOptions={{
                        required: true,
                        valueAsNumber: true,
                        min: 1,
                    }}
                    inputType="number"
                    labelText="Slots per box"
                    defaultValue={6}
                    onChange={(e) =>
                        onChangeSlotsPerBox(e.target.valueAsNumber)
                    }
                />
            </div>

            <div className="col-span-1">
                <BoxProductSlotsSelection />
            </div>

            <div className="col-span-1">
                <SearchCheckboxProductSlot form={form} />
            </div>
        </section>
    );
}
