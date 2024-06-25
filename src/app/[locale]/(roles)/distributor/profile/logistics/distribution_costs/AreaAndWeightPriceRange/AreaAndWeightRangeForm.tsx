'use client';

import Error from 'next/error';
import Button from '../../../../../../components/common/Button';
import AreaAndWeightRangeFormRow from './AreaAndWeightRangeFormRow';
import React, { useState } from 'react';
import { z } from 'zod';
import { useMutation } from 'react-query';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { AreaAndWeightInformationSchema } from './AreaAndWeightCostForm';
import { updateFlatrateAndWeightShippingCost } from '../../../../actions';
import { useMessage } from '../../../../../../components/message/useMessage';
import { IAreaAndWeightCostRange } from '../../../../../../../../lib/types/types';
import { DisplayInputError } from '../../../../../../components/common/DisplayInputError';

const areaWeightCostRange = z
    .object({
        weight_from: z
            .number()
            .min(0, { message: 'errors.input_number_min_0' }),
        weight_to: z.number().min(0, { message: 'errors.input_number_min_0' }),
        base_cost: z.number().min(0, { message: 'errors.input_number_min_0' }),
    })
    .refine((data) => data.weight_from < data.weight_to, {
        message: 'errors.lower_greater_than_upper',
        path: ['weight_from'],
    });

const areaAndWeightInformationObjectSchema = z.object({
    name: z.string().nonempty({ message: 'errors.input_required' }),
    type: z.string().nonempty({ message: 'errors.input_required' }),
    area_weight_range: z
        .array(areaWeightCostRange)
        .refine(
            (ranges) => ranges.length === 0 || ranges[0].weight_from === 0,
            {
                message: 'errors.must_start_from_zero',
            },
        )
        .refine(
            (ranges) => {
                for (let i = 1; i < ranges.length; i++) {
                    if (ranges[i - 1].weight_to !== ranges[i].weight_from) {
                        return false;
                    }
                }
                return true;
            },
            {
                message: 'errors.ranges_not_continuous',
            },
        ),
});

interface Props {
    selectedArea: {
        id: string;
        name: string;
        type: string;
        area_and_weight_cost_id: string;
    };
    areaAndWeightCostRange?: IAreaAndWeightCostRange[];
    distributionCostId: string;
}

/* Tarifa de envío por rango de coste del pedido */
const AreaAndWeightRangeForm = ({
    selectedArea,
    areaAndWeightCostRange,
    distributionCostId,
}: Props) => {
    const t = useTranslations();
    const { handleMessage } = useMessage();

    const [costRanges, setCostRanges] = useState(areaAndWeightCostRange ?? []);
    const [sortedFields, setSortedFields] = useState<IAreaAndWeightCostRange[]>(
        [],
    );

    const submitSuccessMessage = t('messages.updated_successfully');
    const submitErrorMessage = t('messages.submit_error');

    const form = useForm<AreaAndWeightInformationSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(areaAndWeightInformationObjectSchema),
        defaultValues: {
            name: selectedArea.name,
            type: selectedArea.type,
        },
    });

    const {
        handleSubmit,
        control,
        trigger,
        formState: { errors },
    } = form;

    const { append, remove } = useFieldArray({
        name: 'area_weight_range',
        control,
    });

    const handleUpdateFlatrateCostAndWeight = async (
        form: AreaAndWeightInformationSchema,
    ) => {
        trigger();

        // const { cost_extra_per_kg } = form;

        // const res = await updateFlatrateAndWeightShippingCost(
        //     cost_extra_per_kg,
        //     distributionCostId,
        //     costRanges,
        // );

        // if (res.status !== 200) {
        //     handleMessage({
        //         message: submitErrorMessage,
        //         type: 'error',
        //     });
        //     return;
        // }

        handleMessage({
            message: submitSuccessMessage,
            type: 'success',
        });
    };

    const handleUpdateAreaAndWeightCostMutation = useMutation({
        mutationKey: 'updateFlatrateCost',
        mutationFn: handleUpdateFlatrateCostAndWeight,
        onSuccess: () => {
            console.info('Area and weight cost updated successfully');
        },
        onError: (error: Error) => {
            console.error(error);
        },
    });

    const onSubmit: SubmitHandler<AreaAndWeightInformationSchema> = (
        formValues: AreaAndWeightInformationSchema,
    ) => {
        try {
            handleUpdateAreaAndWeightCostMutation.mutate(formValues);
        } catch (error) {
            console.error(error);
        }
    };

    const handleInputWeightFromChange = (
        index: number,
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const newRanges = [...costRanges];
        newRanges[index].weight_from = Number(event.target.value);
        setCostRanges(newRanges);
    };

    const handleInputWeightToChange = (
        index: number,
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const newRanges = [...costRanges];
        newRanges[index].weight_to = Number(event.target.value);
        setCostRanges(newRanges);
    };

    const handleInputBaseCostChange = (
        index: number,
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const newRanges = [...costRanges];
        newRanges[index].base_cost = Number(event.target.value);
        setCostRanges(newRanges);
    };

    const addWeightPriceRange = () => {
        const lastRange = costRanges[costRanges.length - 1] || {
            weight_to: 0,
        };

        const weightPriceRange: IAreaAndWeightCostRange = {
            weight_from: lastRange.weight_to,
            weight_to: lastRange.weight_to + 10,
            base_cost: 0,
            area_and_weight_information_id:
                selectedArea.area_and_weight_cost_id,
        };

        console.log(weightPriceRange);
        append(weightPriceRange);

        setCostRanges([...costRanges, weightPriceRange]);
    };

    const removeWeightPriceRange = (index: number) => {
        remove(index);
        setCostRanges(costRanges.filter((_, i) => i !== index));
    };

    return (
        <section className="flex flex-col items-start space-y-4 rounded-xl border border-beer-softBlondeBubble border-b-gray-200 bg-beer-foam p-4">
            <span className="pb-4">
                <strong>Tarifa con área y peso:</strong> configura los costes de
                envío para cada área y rango de peso.
            </span>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full space-y-4 border border-beer-softBlondeBubble p-2 rounded-xl flex flex-col"
            >
                <div className="flex space-x-4 mt-4">
                    <Button
                        btnType="submit"
                        onClick={handleSubmit(onSubmit)}
                        class="col-span-2 w-24"
                        primary
                        medium
                    >
                        {t('save')}
                    </Button>

                    <Button
                        onClick={addWeightPriceRange}
                        btnType={'button'}
                        accent
                        small
                    >
                        {t('add_weight_price_range')}
                    </Button>
                </div>

                {/* <label className="">
                    {t('cost_extra_per_kg') + ' (€)'}
                    <input
                        type="number"
                        {...register(`cost_extra_per_kg`, {
                            required: true,
                            valueAsNumber: true,
                        })}
                        placeholder="5"
                        className={`
                        ${
                            errors.cost_extra_per_kg &&
                            'border-red-500 focus:border-red-500'
                        }
                        relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 
                        focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm`}
                        min={0}
                    />

                    {errors.cost_extra_per_kg && (
                        <DisplayInputError
                            message={errors.cost_extra_per_kg?.message}
                        />
                    )}
                </label> */}

                <div className="space-y-4">
                    {errors.area_weight_range &&
                        errors.area_weight_range.root && (
                            <DisplayInputError
                                message={errors.area_weight_range.root?.message}
                            />
                        )}

                    {sortedFields.map((field, index) => (
                        <div
                            key={field.id}
                            className="flex items-center space-x-4"
                        >
                            <AreaAndWeightRangeFormRow
                                index={index}
                                handleInputWeightFromChange={
                                    handleInputWeightFromChange
                                }
                                handleInputWeightToChange={
                                    handleInputWeightToChange
                                }
                                handleInputBaseCostChange={
                                    handleInputBaseCostChange
                                }
                                removePriceRange={removeWeightPriceRange}
                                form={form}
                            />
                        </div>
                    ))}
                </div>
            </form>
        </section>
    );
};

export default AreaAndWeightRangeForm;
