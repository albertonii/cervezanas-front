'use client';

import Error from 'next/error';
import Button from '@/app/[locale]/components/common/Button';
import Spinner from '@/app/[locale]/components/common/Spinner';
import React, { useEffect, useState } from 'react';
import { z, ZodType } from 'zod';
import { useMutation } from 'react-query';
import { useTranslations } from 'next-intl';
import { useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import {
    FlatrateAndWeightCostFormData,
    IFlatrateAndWeightCost,
} from '@/lib/types/types';
import FlatrateAndWeightCostTable from './FlatrateAndWeightCostTable';
import FlatrateAndWeightCostFormRow from './FlatrateAndWeightCostFormRow';
import { updateFlatrateAndWeightShippingCost } from '../../../../actions';
import { DisplayInputError } from '@/app/[locale]/components/common/DisplayInputError';
import SelectDistributionCost from '../SelectDistributionCost';
import { DistributionCostType } from '@/lib/enums';

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

const schema: ZodType<FlatrateAndWeightCostFormData> = z.object({
    distribution_costs_id: z.string().uuid(),
    cost_extra_per_kg: z
        .number()
        .min(0, { message: 'errors.input_number_min_0' }),
    weight_range_cost: z
        .array(rangeObjectSchema)
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

export type FlatrateAndWeightCostFormValidationSchema = z.infer<typeof schema>;

interface Props {
    extraCostPerKG: number;
    flatrateAndWeightCost?: IFlatrateAndWeightCost[];
    distributionCostId: string;
    fromDBDistributionType: string;
}

/* Tarifa de envío por rango de coste del pedido */
export default function FlatrateAndWeightCostForm({
    extraCostPerKG,
    flatrateAndWeightCost,
    distributionCostId,
    fromDBDistributionType,
}: Props) {
    const t = useTranslations();
    const { handleMessage } = useMessage();

    const [isLoading, setIsLoading] = useState(false);

    const [costRanges, setCostRanges] = useState(flatrateAndWeightCost ?? []);
    const [sortedFields, setSortedFields] = useState<IFlatrateAndWeightCost[]>(
        [],
    );

    const submitSuccessMessage = t('messages.updated_successfully');
    const submitErrorMessage = t('messages.submit_error');

    const form = useForm<FlatrateAndWeightCostFormValidationSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(schema),
        defaultValues: {
            distribution_costs_id: distributionCostId,
            cost_extra_per_kg: extraCostPerKG,
            weight_range_cost: flatrateAndWeightCost,
        },
    });

    const {
        handleSubmit,
        control,
        trigger,
        formState: { errors },
        register,
    } = form;

    const { fields, append, remove } = useFieldArray({
        name: 'weight_range_cost',
        control,
    });

    useEffect(() => {
        setSortedFields(
            costRanges.sort((a, b) => a.weight_from - b.weight_from),
        );
    }, [fields]);

    const handleUpdateFlatrateCostAndWeight = async (
        form: FlatrateAndWeightCostFormValidationSchema,
    ) => {
        setIsLoading(true);

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
    };

    const handleUpdateFlatrateCostMutation = useMutation({
        mutationKey: 'updateFlatrateCost',
        mutationFn: handleUpdateFlatrateCostAndWeight,
        onSuccess: () => {
            console.info('Flatrate cost updated successfully');
        },
        onError: (error: Error) => {
            console.error(error);
        },
    });

    const onSubmit: SubmitHandler<FlatrateAndWeightCostFormValidationSchema> = (
        formValues: FlatrateAndWeightCostFormData,
    ) => {
        try {
            handleUpdateFlatrateCostMutation.mutate(formValues);
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

        const weightPriceRange: IFlatrateAndWeightCost = {
            weight_from: lastRange.weight_to,
            weight_to: lastRange.weight_to + 10,
            base_cost: 0,
        };

        append(weightPriceRange);

        setCostRanges([...costRanges, weightPriceRange]);
    };

    const removeWeightPriceRange = (index: number) => {
        remove(index);
        setCostRanges(costRanges.filter((_, i) => i !== index));
    };

    return (
        <section
            className={`flex flex-col items-start space-y-4 rounded-xl border 
            border-beer-softBlondeBubble border-b-gray-200 bg-beer-foam p-4
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

            <SelectDistributionCost
                distributionCostsId={distributionCostId}
                fromDBDistributionType={fromDBDistributionType}
                distributionType={DistributionCostType.FLATRATE_AND_WEIGHT}
            />

            <span className="pb-4">
                <strong>Tarifa Plana y Peso:</strong> Configura un rango de
                pesos con un coste específico para cada uno de ellos. Incluye un
                coste adicional si el peso excede el máximo del rango.
            </span>

            {/* Tabla informativa  */}
            <FlatrateAndWeightCostTable flatrateRanges={costRanges} />

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
                    {t('extra_cost_per_kg') + ' (€)'}
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
                    {errors.weight_range_cost &&
                        errors.weight_range_cost.root && (
                            <DisplayInputError
                                message={errors.weight_range_cost.root?.message}
                            />
                        )}

                    {sortedFields.map((field, index) => (
                        <div
                            key={field.id}
                            className="flex items-center space-x-4"
                        >
                            <FlatrateAndWeightCostFormRow
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
}
