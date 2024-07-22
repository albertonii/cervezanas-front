import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { DeleteButton } from '@/app/[locale]/components/common/DeleteButton';
import { DisplayInputError } from '@/app/[locale]/components/common/DisplayInputError';
import { PriceRangeCostFormValidationSchema } from '../PrinceRange/PriceRangeCostForm';

interface Props {
    index: number;
    removePriceRange: (index: number) => void;
    handleInputLowerChange: (
        index: number,
        event: React.ChangeEvent<HTMLInputElement>,
    ) => void;
    handleInputUpperChange: (
        index: number,
        event: React.ChangeEvent<HTMLInputElement>,
    ) => void;
    handleInputCostChange: (
        index: number,
        event: React.ChangeEvent<HTMLInputElement>,
    ) => void;
    form: UseFormReturn<PriceRangeCostFormValidationSchema, any>;
}

export default function PriceRangeRow({
    index,
    removePriceRange,
    handleInputLowerChange,
    handleInputUpperChange,
    handleInputCostChange,
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
                    {t('lower_limit') + ' (€)'}

                    <input
                        type="number"
                        {...register(`distribution_range_cost.${index}.lower`, {
                            required: true,
                            valueAsNumber: true,
                        })}
                        onChange={(event) =>
                            handleInputLowerChange(index, event)
                        }
                        placeholder="0"
                        className={`
                ${
                    errors.distribution_range_cost &&
                    errors.distribution_range_cost[index]?.lower &&
                    'border-red-500 focus:border-red-500'
                }
                relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 
                focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm`}
                        min={0}
                    />
                </label>

                <label className="">
                    {t('upper_limit') + ' (€)'}
                    <input
                        type="number"
                        {...register(`distribution_range_cost.${index}.upper`, {
                            required: true,
                            valueAsNumber: true,
                        })}
                        onChange={(event) =>
                            handleInputUpperChange(index, event)
                        }
                        placeholder="50"
                        className={`
                ${
                    errors.distribution_range_cost &&
                    errors.distribution_range_cost[index]?.upper &&
                    'border-red-500 focus:border-red-500'
                }
                relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 
                focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm`}
                        min={0}
                    />
                </label>

                <label className="">
                    {t('shipping_cost') + ' (€)'}
                    <input
                        type="number"
                        {...register(
                            `distribution_range_cost.${index}.shippingCost`,
                            {
                                required: true,
                                valueAsNumber: true,
                            },
                        )}
                        onChange={(event) =>
                            handleInputCostChange(index, event)
                        }
                        placeholder="30"
                        className={`
                ${
                    errors.distribution_range_cost &&
                    errors.distribution_range_cost[index]?.shippingCost &&
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
            {errors.distribution_range_cost &&
                errors.distribution_range_cost[index] && (
                    <div className="flex flex-col gap-2">
                        {errors.distribution_range_cost[index]?.lower && (
                            <DisplayInputError
                                message={
                                    errors.distribution_range_cost[index]?.lower
                                        ?.message
                                }
                            />
                        )}

                        {errors.distribution_range_cost[index]?.upper && (
                            <DisplayInputError
                                message={
                                    errors.distribution_range_cost[index]?.upper
                                        ?.message
                                }
                            />
                        )}

                        {errors.distribution_range_cost[index]
                            ?.shippingCost && (
                            <DisplayInputError
                                message={
                                    errors.distribution_range_cost[index]
                                        ?.shippingCost?.message
                                }
                            />
                        )}

                        {errors.distribution_range_cost &&
                            errors.distribution_range_cost[index]?.lower && (
                                <DisplayInputError
                                    message={'errors.lower_greater_than_upper'}
                                />
                            )}
                    </div>
                )}
        </>
    );
}
