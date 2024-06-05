import InputLabel from '../../common/InputLabel';
import useBoxPackStore from '../../../../store/boxPackStore';
import BoxProductSlotsSelection from './BoxProductSlotsSelection';
import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
    IBoxPackItem,
    ModalUpdateBoxPackFormData,
} from '../../../../../lib/types/product';
import { useTranslations } from 'next-intl';
import { UpdateSearchCheckboxProductSlot } from './UpdateSearchCheckboxProductSlot';

interface Props {
    form: UseFormReturn<ModalUpdateBoxPackFormData, any>;
}

export default function UpdateBoxProductSlotsSection({ form }: Props) {
    const t = useTranslations();

    const { setError, clearErrors } = form;
    const { boxPack, onChangeSlotsPerBox } = useBoxPackStore();
    const { setValue } = form;

    const [boxWeight, setBoxWeight] = useState(0);
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
                6,
            ),
        );

        setBoxWeight(
            boxPack.boxPackItems.reduce(
                (acc, item) => acc + item.quantity * item.products!.weight,
                0,
            ),
        );
    }, [boxPack.boxPackItems]);

    useEffect(() => {
        setValue('weight', boxWeight);
    }, [boxWeight]);

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
                    {t('actual_slots_occupied')}: {actualSlotsPerBox}
                </h1>

                <h2 className="text-xl">
                    {t('box_weight')}: {boxWeight} gr
                </h2>
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
                    onChange={(e) => handleOnChangeSlotsPerBox(e)}
                    value={slotsPerBox}
                />
            </div>

            <div className="col-span-1">
                <BoxProductSlotsSelection />
            </div>

            <div className="col-span-1">
                <UpdateSearchCheckboxProductSlot form={form} />
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
