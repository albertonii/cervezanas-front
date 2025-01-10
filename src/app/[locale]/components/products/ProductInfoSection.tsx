import BeerInfoSection from './beer/BeerInfoSection';
import React, { useState } from 'react';
import { Type } from '@/lib//productEnum';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { product_type_options } from '@/lib//beerEnum';

import { ICustomizeSettings, ModalAddProductFormData } from '@/lib/types/types';

interface Props {
    form: UseFormReturn<ModalAddProductFormData, any>;
    customizeSettings: ICustomizeSettings;
}

export function ProductInfoSection({ form, customizeSettings }: Props) {
    const t = useTranslations();

    const { register, setValue } = form;

    const [isBeer, setIsBeer] = useState(true);

    // Function that switch between merchandising and beer when select option is clicked
    const handleProductType = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const category = event.target.value.toLowerCase();
        if (category === Type.BEER) {
            setIsBeer(true);
        } else if (category === 'merchandising') {
            setIsBeer(false);
        }

        setValue('category', category);
    };

    return (
        <>
            {/* Select product type  */}
            <section className="relative flex-auto pt-6">
                {/* IS Public  */}
                <div className="flex w-full flex-col items-center sm:items-end">
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
                            defaultChecked={true}
                        />

                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-beer-blonde peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-beer-softFoam dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-beer-blonde"></div>

                        <span className="ml-3 text-lg font-medium text-gray-900 dark:text-gray-300">
                            {t('is_public')}
                        </span>
                    </label>

                    <span className="mt-2 text-sm font-medium text-gray-400 dark:text-gray-300">
                        {t('is_public_product_description')}
                    </span>
                </div>

                {/* Is available? Does it have stock?  */}
                <div className="flex w-full flex-col items-center sm:items-end mt-6">
                    <label
                        className="relative inline-flex cursor-pointer items-center"
                        htmlFor="is_available"
                    >
                        <input
                            id="is_available"
                            type="checkbox"
                            className="peer sr-only"
                            {...register('is_available', {
                                required: true,
                            })}
                            defaultChecked={true}
                        />

                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-beer-blonde peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-beer-softFoam dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-beer-blonde"></div>

                        <span className="ml-3 text-lg font-medium text-gray-900 dark:text-gray-300">
                            {t('is_available')}
                        </span>
                    </label>

                    <span className="mt-2 text-sm font-medium text-gray-400 dark:text-gray-300">
                        {t('is_available_product_description')}
                    </span>
                </div>

                {/* IS configured for events?  */}
                <div className="flex w-full flex-col items-center sm:items-end">
                    <label
                        className="relative inline-flex cursor-pointer items-center"
                        htmlFor="is_for_event"
                    >
                        <input
                            id="is_for_event"
                            type="checkbox"
                            className="peer sr-only"
                            {...register('is_for_event', {
                                required: true,
                            })}
                            defaultChecked={false}
                        />

                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-beer-blonde peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-beer-softFoam dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-beer-blonde"></div>

                        <span className="ml-3 text-lg font-medium text-gray-900 dark:text-gray-300">
                            {t('is_for_event')}
                        </span>
                    </label>

                    <span className="mt-2 text-sm font-medium text-gray-400 dark:text-gray-300">
                        {t('is_for_event_product_description')}
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
                        {...register('type')}
                        onChange={handleProductType}
                        className="relative  block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                    >
                        {product_type_options.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                selected={option.label === 'beer'}
                            >
                                {t(option.label.toLowerCase())}
                            </option>
                        ))}
                    </select>
                </div>
            </section>

            {/* Beer type */}
            {isBeer && (
                <BeerInfoSection
                    form={form}
                    customizeSettings={customizeSettings}
                />
            )}
        </>
    );
}
