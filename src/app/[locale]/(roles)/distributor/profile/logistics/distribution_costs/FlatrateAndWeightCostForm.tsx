'use client';

import Error from 'next/error';
import Button from '../../../../../components/common/Button';
import React, { useEffect, useState } from 'react';
import { z, ZodType } from 'zod';
import { useMutation } from 'react-query';
import { useTranslations } from 'next-intl';
import { useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMessage } from '../../../../../components/message/useMessage';
import {
    FlatrateAndWeightCostFormData,
    IFlatrateAndWeightCost,
} from '../../../../../../../lib/types/types';
import FlatrateAndWeightCostTable from './FlatrateAndWeightCostTable';
import FlatrateAndWeightCostFormRow from './FlatrateAndWeightCostFormRow';
import {
    calculateFlatrateAndWeightShippingCost,
    updateFlatrateAndWeightShippingCost,
} from '../../../actions';
import { DisplayInputError } from '../../../../../components/common/DisplayInputError';

const rangeObjectSchema = z
    .object({
        weight_from: z
            .number()
            .min(0, { message: 'errors.input_number_min_0' }),
        weight_to: z.number().min(0, { message: 'errors.input_number_min_0' }),
        base_cost: z.number().min(0, { message: 'errors.input_number_min_0' }),
        extra_cost_per_kg: z
            .number()
            .min(0, { message: 'errors.input_number_min_0' }),
    })
    .refine((data) => data.weight_from < data.weight_to, {
        message: 'errors.lower_greater_than_upper',
        path: ['weight_from'],
    });

const schema: ZodType<FlatrateAndWeightCostFormData> = z.object({
    distribution_costs_id: z.string().uuid(),
    weight_range_cost: z
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

export type WeightRangeCostFormValidationSchema = z.infer<typeof schema>;

interface Props {
    flatrateAndWeightCost?: IFlatrateAndWeightCost[];
    distributionCostId: string;
}

/* Tarifa de envío por rango de coste del pedido */
const FlatrateAndWeightCostForm = ({
    flatrateAndWeightCost,
    distributionCostId,
}: Props) => {
    const t = useTranslations();
    const { handleMessage } = useMessage();

    const [costRanges, setCostRanges] = useState(flatrateAndWeightCost ?? []);
    const [sortedFields, setSortedFields] = useState<IFlatrateAndWeightCost[]>(
        [],
    );

    const submitSuccessMessage = t('messages.updated_successfully');
    const submitErrorMessage = t('messages.submit_error');

    const form = useForm<WeightRangeCostFormValidationSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(schema),
        defaultValues: {
            distribution_costs_id: distributionCostId,
            weight_range_cost: flatrateAndWeightCost,
        },
    });

    const {
        handleSubmit,
        control,
        trigger,
        formState: { errors },
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

    useEffect(() => {
        calculateFlatrateAndWeightShippingCost(distributionCostId, 30);
    }, []);

    const handleUpdateFlatrateCostAndWeight = async (
        form: WeightRangeCostFormValidationSchema,
    ) => {
        trigger();

        const res = await updateFlatrateAndWeightShippingCost(
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

    const onSubmit: SubmitHandler<WeightRangeCostFormValidationSchema> = (
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

    const handleInputExtraCostPerKgChange = (
        index: number,
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const newRanges = [...costRanges];
        newRanges[index].extra_cost_per_kg = Number(event.target.value);
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
            extra_cost_per_kg: 0,
        };

        append(weightPriceRange);

        setCostRanges([...costRanges, weightPriceRange]);
    };

    const removeWeightPriceRange = (index: number) => {
        remove(index);
        setCostRanges(costRanges.filter((_, i) => i !== index));
    };

    return (
        <section className="flex flex-col items-start space-y-4 rounded-xl border border-beer-softBlondeBubble border-b-gray-200 bg-beer-foam p-4 ">
            {/* Tabla informativa  */}
            <FlatrateAndWeightCostTable flatrateRanges={costRanges} />

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full space-y-4"
            >
                <div className="flex space-x-4">
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
                                handleInputExtraCostPerKgChange={
                                    handleInputExtraCostPerKgChange
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

export default FlatrateAndWeightCostForm;