'use client';

import Error from 'next/error';
import Button from '../../../../../../components/common/Button';
import React, { useState } from 'react';
import { z, ZodType } from 'zod';
import {
    AreaAndWeightCostFormData,
    IAreaAndWeightCostRange,
} from '../../../../../../../../lib/types/types';
import { useMutation } from 'react-query';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { updateFlatrateAndWeightShippingCost } from '../../../../actions';
import { useMessage } from '../../../../../../components/message/useMessage';
import { DisplayInputError } from '../../../../../../components/common/DisplayInputError';

const rangeObjectSchema = z
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

const areaAndWeightObjectSchema = z.object({
    distribution_costs_id: z.string().uuid(),
    cost_extra_per_kg: z
        .number()
        .min(0, { message: 'errors.input_number_min_0' }),
    area_weight_range_cost: z
        .array(rangeObjectSchema)
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

type ValidationSchema = z.infer<typeof areaAndWeightObjectSchema>;

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

    const form = useForm<ValidationSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(areaAndWeightObjectSchema),
        defaultValues: {
            distribution_costs_id: distributionCostId,
            cost_extra_per_kg: 0,
            area_weight_range_cost: costRanges,
        },
    });

    const {
        handleSubmit,
        control,
        trigger,
        formState: { errors, dirtyFields },
        register,
    } = form;

    const { fields, append, remove } = useFieldArray({
        name: 'area_weight_range_cost',
        control,
    });

    const handleUpdateFlatrateCostAndWeight = async (
        form: ValidationSchema,
    ) => {
        trigger();

        const { cost_extra_per_kg } = form;

        const res = await updateFlatrateAndWeightShippingCost(
            cost_extra_per_kg,
            distributionCostId,
            costRanges,
        );

        if (res.status !== 200) {
            handleMessage({
                message: submitErrorMessage,
                type: 'error',
            });
            return;
        }

        handleMessage({
            message: submitSuccessMessage,
            type: 'success',
        });
    };

    const handleUpdateAreaAndWeightCostMutation = useMutation({
        mutationKey: 'updateFlatrateCost',
        mutationFn: handleUpdateFlatrateCostAndWeight,
        onSuccess: () => {
            console.info('Flatrate cost updated successfully');
        },
        onError: (error: Error) => {
            console.error(error);
        },
    });

    const onSubmit: SubmitHandler<ValidationSchema> = (
        formValues: ValidationSchema,
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

        append(weightPriceRange);

        setCostRanges([...costRanges, weightPriceRange]);
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

                <label className="">
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
                </label>

                <div className="space-y-4">
                    {errors.area_weight_range_cost &&
                        errors.area_weight_range_cost.root && (
                            <DisplayInputError
                                message={
                                    errors.area_weight_range_cost.root?.message
                                }
                            />
                        )}

                    {sortedFields.map((field, index) => (
                        <div
                            key={field.id}
                            className="flex items-center space-x-4"
                        >
                            {/* <FlatrateAndWeightCostFormRow
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
                            /> */}
                        </div>
                    ))}
                </div>
            </form>
        </section>
    );
};

export default AreaAndWeightRangeForm;
