import InputLabel from '../../common/InputLabel';
import useBoxPackStore from '@/app/store//boxPackStore';
import DrawingSlotsFromBox from './DrawingSlotsFromBox';
import BoxProductSlotsSelection from './BoxProductSlotsSelection';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { IBoxPackItem, ModalUpdateBoxPackFormData } from '@/lib//types/product';
import { UpdateSearchCheckboxProductSlot } from './UpdateSearchCheckboxProductSlot';

interface Props {
    form: UseFormReturn<ModalUpdateBoxPackFormData, any>;
}

export default function UpdateBoxProductSlotsSection({ form }: Props) {
    const t = useTranslations();

    const { setError, clearErrors } = form;
    const { boxPack, onChangeSlotsPerBox } = useBoxPackStore();
    const { setValue } = form;

    const [boxWeight, setBoxWeight] = useState(form.getValues('weight'));
    const [maxSlotsPerBox, setMaxSlotsPerBox] = useState(6);

    const [actualSlotsPerBox, setActualSlotsPerBox] = useState(
        boxPack.boxPackItems.reduce(
            (acc, item) => acc + item.quantity * item.slots_per_product,
            0,
        ),
    );

    useEffect(() => {
        if (boxPack.is_box_pack_dirty) {
            setMaxSlotsPerBox(boxPack.slots_per_box);

            setActualSlotsPerBox(
                boxPack.boxPackItems.reduce(
                    (acc, item) => acc + item.quantity * item.slots_per_product,
                    0,
                ),
            );

            setBoxWeight(
                boxPack.boxPackItems.reduce(
                    (acc, item) => acc + item.quantity * item.products!.weight,
                    0,
                ),
            );
        }
    }, [boxPack.boxPackItems]);

    useEffect(() => {
        setValue('weight', boxWeight, { shouldDirty: true });
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
                message: 'errors.slots_per_box',
            });

            return;
        }

        clearErrors('slots_per_box');

        setMaxSlotsPerBox(e.target.valueAsNumber);

        onChangeSlotsPerBox(e.target.valueAsNumber);
    };

    const handleOnChangeWeightBox = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setBoxWeight(e.target.valueAsNumber);
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

            <DrawingSlotsFromBox
                slotsPerBox={maxSlotsPerBox}
                actualSlotsPerBox={actualSlotsPerBox}
            />

            <div className="col-span-2 flex gap-4">
                <InputLabel
                    label="weight"
                    form={form}
                    registerOptions={{
                        required: true,
                        valueAsNumber: true,
                        min: 0,
                    }}
                    inputType="number"
                    labelText={t('box_weight') + ' (gr)'}
                    onChange={(e) => handleOnChangeWeightBox(e)}
                    value={boxWeight}
                />

                <InputLabel
                    label="slots_per_box"
                    form={form}
                    registerOptions={{
                        required: true,
                        valueAsNumber: true,
                        min: 1,
                    }}
                    inputType="number"
                    labelText={t('max_slots_per_box')}
                    onChange={(e) => handleOnChangeSlotsPerBox(e)}
                    value={maxSlotsPerBox}
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
