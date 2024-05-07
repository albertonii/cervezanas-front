import BoxProductSlotsSelection from './BoxProductSlotsSelection';
import React, { useEffect, useState } from 'react';
import InputLabel from '../../common/InputLabel';
import { UseFormReturn } from 'react-hook-form';
import {
    IBoxPackItem,
    ModalAddBoxPackFormData,
} from '../../../../../lib/types/product';
import { SearchCheckboxProductSlot } from './SearchCheckboxProductSlot';
import useBoxPackStore from '../../../../store/boxPackStore';

interface Props {
    form: UseFormReturn<ModalAddBoxPackFormData, any>;
}

export default function BoxProductSlotsSection({ form }: Props) {
    const { setError, clearErrors } = form;
    const { boxPack, onChangeSlotsPerBox } = useBoxPackStore();

    const [slotsPerBox, setSlotsPerBox] = useState(6);

    const [actualSlotsPerBox, setActualSlotsPerBox] = useState(
        boxPack.boxPackItems.reduce(
            (acc, item) => acc + item.quantity * item.slots_per_product,
            0,
        ),
    );

    useEffect(() => {
        setActualSlotsPerBox(
            boxPack.boxPackItems.reduce(
                (acc, item) => acc + item.quantity * item.slots_per_product,
                0,
            ),
        );
    }, [boxPack.boxPackItems]);

    const handleOnChangeSlotsPerBox = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const isValid = isValidInputSlots(
            boxPack?.boxPackItems || [],
            e.target.valueAsNumber,
        );

        if (!isValid) {
            setError('slots_per_box', {
                type: 'custom',
                message: 'error_slots_per_box',
            });

            return;
        }

        clearErrors('slots_per_box');

        setSlotsPerBox(e.target.valueAsNumber);

        onChangeSlotsPerBox(e.target.valueAsNumber);
    };

    return (
        <section className="grid grid-cols-2 gap-4 pt-6 min-h-[45vh]">
            <div className="col-span-2">
                <h1 className="text-xl">
                    Actual Slots Occupied: {actualSlotsPerBox}
                </h1>
            </div>

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
                    labelText="Max Slots per box"
                    defaultValue={6}
                    onChange={(e) => handleOnChangeSlotsPerBox(e)}
                    value={slotsPerBox}
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

const isValidInputSlots = (
    boxPackItems: IBoxPackItem[],
    maxSlotsPerBox: number,
) => {
    const totalQuantity = boxPackItems.reduce(
        (acc, item) => acc + item.quantity * item.slots_per_product,
        0,
    );

    if (totalQuantity > maxSlotsPerBox) {
        return false;
    }

    return true;
};
