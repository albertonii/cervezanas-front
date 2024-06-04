'use client';

import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import {
    format_options,
    product_type_options,
} from '../../../../../../lib/beerEnum';
import {
    ICustomizeSettings,
    ModalUpdateProductFormData,
} from '../../../../../../lib/types/types';
import InputLabel from '../../../../components/common/InputLabel';
import StockInformationDetailsAndPacksUpdate from '../../../../components/modals/StockInformationDetailsAndPacksUpdate';
import UpdateBeerInfoSection from '../../../../components/products/beer/UpdateBeerInfoSection';

interface Props {
    form: UseFormReturn<ModalUpdateProductFormData, any>;
    customizeSettings: ICustomizeSettings;
}

export function UpdateProductInfoSection({ form, customizeSettings }: Props) {
    const t = useTranslations();

    const {
        register,
        formState: { errors },
        getValues,
    } = form;

    const [formatOptions, setFormatOptions] = useState<string>(
        format_options[0].label,
    );

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFormatOptions(event.target.value);
    };

    return (
        <>
            {/* Select product type  */}
            <section className="relative flex-auto pt-6">
                <div className="flex w-full flex-col items-end">
                    <label
                        className="relative inline-flex cursor-pointer items-center"
                        htmlFor="is_public"
                    >
                        <input
                            id="is_public"
                            type="checkbox"
                            className="peer sr-only"
                            {...register('is_public', {
                                required: true,
                            })}
                            defaultChecked={getValues('is_public')}
                        />

                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-beer-blonde peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-beer-softFoam dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-beer-blonde"></div>

                        <span className="ml-3 text-lg font-medium text-gray-900 dark:text-gray-300">
                            {t('is_public')}
                        </span>
                    </label>

                    <span className="mt-2 text-sm font-medium text-gray-400 dark:text-gray-300">
                        {t('is_public_description')}
                    </span>
                </div>

                <div className="w-full pt-6">
                    <label
                        htmlFor="product_type"
                        className="text-sm text-gray-600"
                    >
                        {t('product_type')}
                    </label>

                    <select
                        id="product_type"
                        defaultValue={getValues('type') ?? 'BEER'}
                        className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 hover:cursor-not-allowed hover:bg-gray-200 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                        disabled
                    >
                        {product_type_options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {t(option.label.toLowerCase())}
                            </option>
                        ))}
                    </select>
                </div>
            </section>

            {/* Beer type */}
            {getValues('type') === 'BEER' && (
                <UpdateBeerInfoSection
                    form={form}
                    customizeSettings={customizeSettings}
                />
            )}
        </>
    );
}
