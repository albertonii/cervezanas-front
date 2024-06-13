import { useTranslations } from 'next-intl';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { DeleteButton } from '../../../../../components/common/DeleteButton';
import { DisplayInputError } from '../../../../../components/common/DisplayInputError';
import { WeightRangeCostFormValidationSchema } from './FlatrateAndWeightCostForm';

interface Props {
    index: number;
    removePriceRange: (index: number) => void;
    handleInputWeightFromChange: (
        index: number,
        event: React.ChangeEvent<HTMLInputElement>,
    ) => void;
    handleInputWeightToChange: (
        index: number,
        event: React.ChangeEvent<HTMLInputElement>,
    ) => void;
    handleInputBaseCostChange: (
        index: number,
        event: React.ChangeEvent<HTMLInputElement>,
    ) => void;
    handleInputExtraCostPerKgChange: (
        index: number,
        event: React.ChangeEvent<HTMLInputElement>,
    ) => void;
    form: UseFormReturn<WeightRangeCostFormValidationSchema, any>;
}

export default function FlatrateAndWeightCostFormRow({
    index,
    removePriceRange,
    handleInputWeightFromChange,
    handleInputWeightToChange,
    handleInputBaseCostChange,
    handleInputExtraCostPerKgChange,
    form: {
        register,
        formState: { errors },
    },
}: Props) {
    const t = useTranslations();

    return (
        <>
            <fieldset className="mr-2 flex flex-col gap-4 rounded-xl border p-2 sm:flex-row">
                <legend className=" text-gray-600">
                    Franja de Precio {index + 1}
                </legend>

                <label className="">
                    {t('weight_from') + ' (€)'}

                    <input
                        type="number"
                        {...register(`weight_range_cost.${index}.weight_from`, {
                            required: true,
                            valueAsNumber: true,
                        })}
                        onChange={(event) =>
                            handleInputWeightFromChange(index, event)
                        }
                        placeholder="0"
                        className={`
                ${
                    errors.weight_range_cost &&
                    errors.weight_range_cost[index]?.weight_from &&
                    'border-red-500 focus:border-red-500'
                }
                relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 
                focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm`}
                        min={0}
                    />
                </label>

                <label className="">
                    {t('weight_to') + ' (€)'}
                    <input
                        type="number"
                        {...register(`weight_range_cost.${index}.weight_to`, {
                            required: true,
                            valueAsNumber: true,
                        })}
                        onChange={(event) =>
                            handleInputWeightToChange(index, event)
                        }
                        placeholder="50"
                        className={`
                ${
                    errors.weight_range_cost &&
                    errors.weight_range_cost[index]?.weight_to &&
                    'border-red-500 focus:border-red-500'
                }
                relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 
                focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm`}
                        min={0}
                    />
                </label>

                <label className="">
                    {t('base_cost') + ' (€)'}
                    <input
                        type="number"
                        {...register(`weight_range_cost.${index}.base_cost`, {
                            required: true,
                            valueAsNumber: true,
                        })}
                        onChange={(event) =>
                            handleInputBaseCostChange(index, event)
                        }
                        placeholder="30"
                        className={`
                ${
                    errors.weight_range_cost &&
                    errors.weight_range_cost[index]?.base_cost &&
                    'border-red-500 focus:border-red-500'
                }
                relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 
                focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm`}
                        min={0}
                    />
                </label>

                <label className="">
                    {t('extra_cost_per_kg') + ' (€)'}
                    <input
                        type="number"
                        {...register(
                            `weight_range_cost.${index}.extra_cost_per_kg`,
                            {
                                required: true,
                                valueAsNumber: true,
                            },
                        )}
                        onChange={(event) =>
                            handleInputExtraCostPerKgChange(index, event)
                        }
                        placeholder="30"
                        className={`
                ${
                    errors.weight_range_cost &&
                    errors.weight_range_cost[index]?.extra_cost_per_kg &&
                    'border-red-500 focus:border-red-500'
                }
                relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 
                focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm`}
                        min={0}
                    />
                </label>

                <div className="align-end flex items-end">
                    <DeleteButton onClick={() => removePriceRange(index)} />
                </div>
            </fieldset>

            {/* Display all the errors messages at once */}
            {errors.weight_range_cost && errors.weight_range_cost[index] && (
                <div className="flex flex-col gap-2">
                    {errors.weight_range_cost[index]?.weight_from && (
                        <DisplayInputError
                            message={
                                errors.weight_range_cost[index]?.weight_from
                                    ?.message
                            }
                        />
                    )}

                    {errors.weight_range_cost[index]?.weight_to && (
                        <DisplayInputError
                            message={
                                errors.weight_range_cost[index]?.weight_to
                                    ?.message
                            }
                        />
                    )}

                    {errors.weight_range_cost[index]?.base_cost && (
                        <DisplayInputError
                            message={
                                errors.weight_range_cost[index]?.base_cost
                                    ?.message
                            }
                        />
                    )}

                    {errors.weight_range_cost &&
                        errors.weight_range_cost[index]?.extra_cost_per_kg && (
                            <DisplayInputError
                                message={
                                    errors.weight_range_cost[index]
                                        ?.extra_cost_per_kg?.message
                                }
                            />
                        )}
                </div>
            )}
        </>
    );
}
