import React from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { DeleteButton } from '@/app/[locale]/components/common/DeleteButton';
import { DisplayInputError } from '@/app/[locale]/components/common/DisplayInputError';
import { AreaAndWeightInformationFormData } from '@/lib/types/types';

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
    form: UseFormReturn<AreaAndWeightInformationFormData, any>;
}

export default function AreaAndWeightCostFormRow({
    index,
    removePriceRange,
    handleInputWeightFromChange,
    handleInputWeightToChange,
    handleInputBaseCostChange,
    form: {
        register,
        formState: { errors },
    },
}: Props) {
    const t = useTranslations();

    return (
        <>
            <fieldset className="mr-2 flex flex-col gap-4 rounded-xl border p-2  w-full ">
                {/* Display all the errors messages at once */}
                {errors.area_weight_range && (
                    <div className="flex flex-col gap-2">
                        {errors.area_weight_range[index] && (
                            <>
                                {errors.area_weight_range[index]
                                    ?.weight_from && (
                                    <DisplayInputError
                                        message={
                                            errors.area_weight_range[index]
                                                ?.weight_from?.message
                                        }
                                    />
                                )}

                                {errors.area_weight_range[index]?.weight_to && (
                                    <DisplayInputError
                                        message={
                                            errors.area_weight_range[index]
                                                ?.weight_to?.message
                                        }
                                    />
                                )}

                                {errors.area_weight_range[index]?.base_cost && (
                                    <DisplayInputError
                                        message={
                                            errors.area_weight_range[index]
                                                ?.base_cost?.message
                                        }
                                    />
                                )}
                            </>
                        )}
                    </div>
                )}

                <legend className=" text-gray-600">
                    Franja de Precio {index + 1}
                </legend>

                <div className="flex sm:flex-row flex-col justify-between gap-2">
                    <label className="">
                        {t('weight_from') + ' (Kg)'}

                        <input
                            type="number"
                            {...register(
                                `area_weight_range.${index}.weight_from`,
                                {
                                    required: true,
                                    valueAsNumber: true,
                                },
                            )}
                            onChange={(event) =>
                                handleInputWeightFromChange(index, event)
                            }
                            placeholder="0"
                            className={`
                            ${
                                errors.area_weight_range &&
                                errors.area_weight_range[index]?.weight_from &&
                                'border-red-500 focus:border-red-500'
                            }
                            relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 
                            focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm`}
                            min={0}
                        />
                    </label>

                    <label className="">
                        {t('weight_to') + ' (Kg)'}
                        <input
                            type="number"
                            {...register(
                                `area_weight_range.${index}.weight_to`,
                                {
                                    required: true,
                                    valueAsNumber: true,
                                },
                            )}
                            onChange={(event) =>
                                handleInputWeightToChange(index, event)
                            }
                            placeholder="50"
                            className={`
                            ${
                                errors.area_weight_range &&
                                errors.area_weight_range[index]?.weight_to &&
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
                            {...register(
                                `area_weight_range.${index}.base_cost`,
                                {
                                    required: true,
                                    valueAsNumber: true,
                                },
                            )}
                            onChange={(event) =>
                                handleInputBaseCostChange(index, event)
                            }
                            placeholder="30"
                            className={`
                            ${
                                errors.area_weight_range &&
                                errors.area_weight_range[index]?.base_cost &&
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
                </div>
            </fieldset>
        </>
    );
}
