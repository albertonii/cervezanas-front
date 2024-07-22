'use client';

import Error from 'next/error';
import Button from '@/app/[locale]/components/common/Button';
import Spinner from '@/app/[locale]/components/common/Spinner';
import AreaAndWeightRangeFormRow from './AreaAndWeightRangeFormRow';
import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { useMutation } from 'react-query';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { AreaAndWeightInformationSchema } from './AreaAndWeightCostForm';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import {
    IAreaAndWeightCostRange,
    IAreaAndWeightInformation,
} from '@/lib/types/types';
import { DisplayInputError } from '@/app/[locale]/components/common/DisplayInputError';
import { updateAreaAndWeightRangeByAreaAndWeightInformationId } from '../../../../actions';

const areaWeightCostRange = z
    .object({
        weight_from: z
            .number()
            .min(0, { message: 'errors.input_number_min_0' }),
        weight_to: z.number().min(0, { message: 'errors.input_number_min_0' }),
        base_cost: z.number().min(0, { message: 'errors.input_number_min_0' }),
        area_and_weight_information_id: z.string().uuid(),
    })
    .refine((data) => data.weight_from < data.weight_to, {
        message: 'errors.lower_greater_than_upper',
        path: ['weight_from'],
    });

const areaAndWeightInformationObjectSchema = z.object({
    area_weight_range: z
        .array(areaWeightCostRange)
        .refine(
            (ranges) =>
                ranges.length === 0 ||
                ranges.some((range) => range.weight_from === 0),
            {
                message: 'errors.must_start_from_zero',
            },
        )
        .refine(
            (ranges) => {
                if (ranges.length === 0) return true;

                // Ordenar los rangos por `weight_from` para facilitar la verificación
                ranges.sort((a, b) => a.weight_from - b.weight_from);

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
    selectedArea: IAreaAndWeightInformation;
}

/* Tarifa de envío por rango de coste del pedido */
const AreaAndWeightRangeForm = ({ selectedArea }: Props) => {
    const t = useTranslations();
    const { handleMessage } = useMessage();
    console.log(selectedArea);
    const [isLoading, setIsLoading] = useState(false);

    const [costRanges, setCostRanges] = useState<IAreaAndWeightCostRange[]>(
        selectedArea.area_weight_cost_range ?? [],
    );

    const submitSuccessMessage = t('messages.updated_successfully');
    const submitErrorMessage = t('messages.submit_error');

    const form = useForm<AreaAndWeightInformationSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(areaAndWeightInformationObjectSchema),
        defaultValues: {
            area_weight_range: selectedArea.area_weight_cost_range?.map(
                (range) => {
                    return {
                        weight_from: range.weight_from,
                        weight_to: range.weight_to,
                        base_cost: range.base_cost,
                        area_and_weight_information_id: selectedArea.id,
                    };
                },
            ),
        },
    });

    const {
        handleSubmit,
        control,
        formState: { errors, dirtyFields },
        setValue,
    } = form;

    useEffect(() => {
        if (
            selectedArea.area_weight_cost_range &&
            selectedArea.coverage_areas?.administrative_division
        ) {
            const sortedRanges = [...selectedArea.area_weight_cost_range].sort(
                (a, b) => a.weight_from - b.weight_from,
            );

            setCostRanges(sortedRanges);
            setValue('area_weight_range', sortedRanges);
        }
    }, [selectedArea.area_weight_cost_range]);

    useEffect(() => {
        console.log('errors', errors);
        console.log('dirtyFields', dirtyFields);
    }, [errors, dirtyFields]);

    const { append, remove } = useFieldArray({
        name: 'area_weight_range',
        control,
    });

    const handleUpdateAreaWeightRange = async (
        form: AreaAndWeightInformationSchema,
    ) => {
        if (dirtyFields.area_weight_range) {
            setIsLoading(true);

            const { area_weight_range } = form;

            const res =
                await updateAreaAndWeightRangeByAreaAndWeightInformationId(
                    area_weight_range,
                );

            if (res.status !== 200) {
                handleMessage({
                    message: submitErrorMessage,
                    type: 'error',
                });

                setIsLoading(false);
                return;
            }

            setTimeout(() => {
                setIsLoading(false);
                handleMessage({
                    message: submitSuccessMessage,
                    type: 'success',
                });
            }, 1000);
        }
    };

    const handleUpdateAreaAndWeightCostMutation = useMutation({
        mutationKey: 'updateAreaWeightRangeCost',
        mutationFn: handleUpdateAreaWeightRange,
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

        // Ordenar los rangos por `weight_from` para facilitar la verificación
        const sortedRanges = newRanges.sort(
            (a, b) => a.weight_from - b.weight_from,
        );

        // Update the form field and mark it as dirty
        setValue(
            `area_weight_range.${index}.weight_from`,
            Number(event.target.value),
            {
                shouldDirty: true,
            },
        );

        setCostRanges(sortedRanges);
    };

    const handleInputWeightToChange = (
        index: number,
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const newRanges = [...costRanges];
        newRanges[index].weight_to = Number(event.target.value);
        const sortedRanges = newRanges.sort(
            (a, b) => a.weight_from - b.weight_from,
        );

        // Update the form field and mark it as dirty
        setValue(
            `area_weight_range.${index}.weight_to`,
            Number(event.target.value),
            {
                shouldDirty: true,
            },
        );

        setCostRanges(sortedRanges);
    };

    const handleInputBaseCostChange = (
        index: number,
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const newRanges = [...costRanges];
        newRanges[index].base_cost = Number(event.target.value);
        const sortedRanges = newRanges.sort(
            (a, b) => a.weight_from - b.weight_from,
        );

        // Update the form field and mark it as dirty
        setValue(
            `area_weight_range.${index}.base_cost`,
            Number(event.target.value),
            {
                shouldDirty: true,
            },
        );

        setCostRanges(sortedRanges);
    };

    const addWeightPriceRange = () => {
        const lastRange = costRanges[costRanges.length - 1] || {
            weight_to: 0,
        };

        const weightPriceRange: IAreaAndWeightCostRange = {
            weight_from: lastRange.weight_to,
            weight_to: lastRange.weight_to + 10,
            base_cost: 0,
            area_and_weight_information_id: selectedArea.id,
        };

        append(weightPriceRange);

        const newRanges = [...costRanges, weightPriceRange];
        const sortedRanges = newRanges.sort(
            (a, b) => a.weight_from - b.weight_from,
        );

        setCostRanges(sortedRanges);
    };

    const removeWeightPriceRange = (index: number) => {
        const newRanges = costRanges.filter((_, i) => i !== index);
        const sortedRanges = newRanges.sort(
            (a, b) => a.weight_from - b.weight_from,
        );

        remove(index);
        setCostRanges(sortedRanges);
    };

    return (
        <section
            className={`flex flex-col items-start space-y-4 
                ${isLoading ? 'opacity-50 pointer-events-none' : ''}
            `}
        >
            {isLoading && (
                <Spinner
                    size={'large'}
                    color={'beer-blonde'}
                    absolutePosition="center"
                    absolute
                />
            )}

            {/* Información del área seleccionada  */}
            <div className="flex gap-4">
                {selectedArea.coverage_areas?.region && (
                    <span className="">
                        <strong>{t('region')}:</strong>{' '}
                        {selectedArea.coverage_areas?.region}
                    </span>
                )}

                {selectedArea.coverage_areas?.sub_region && (
                    <span className="">
                        <strong>{t('sub_region')}:</strong>{' '}
                        {selectedArea.coverage_areas?.sub_region}
                    </span>
                )}

                {selectedArea.coverage_areas?.city && (
                    <span className="">
                        <strong>{t('city')}:</strong>{' '}
                        {selectedArea.coverage_areas?.city}
                    </span>
                )}
            </div>

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
                        primary
                        medium
                    >
                        {t('save')}
                    </Button>

                    <Button
                        onClick={addWeightPriceRange}
                        btnType={'button'}
                        accent
                        medium
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

                    {costRanges.map((field, index) => (
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
