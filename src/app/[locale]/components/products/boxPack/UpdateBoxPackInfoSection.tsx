import InputLabel from '../../form/InputLabel';
import InputTextarea from '../../form/InputTextarea';
import React from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { formatCurrency } from '@/utils/formatCurrency';
import { ModalUpdateBoxPackFormData } from '@/lib/types/product';

interface Props {
    form: UseFormReturn<ModalUpdateBoxPackFormData, any>;
}

export function UpdateBoxPackInfoSection({ form }: Props) {
    const t = useTranslations();

    const { register, getValues } = form;

    return (
        <section className="relative flex-auto pt-6">
            {/* IS Public  */}
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

            {/* Is available? Does it have stock?  */}
            <div className="flex w-full flex-col items-end">
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
                        defaultChecked={getValues('is_available')}
                    />

                    <div
                        className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] 
                            after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all
                            after:content-[''] peer-checked:bg-beer-blonde peer-checked:after:translate-x-full peer-checked:after:border-white 
                            peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-beer-softFoam dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-beer-blonde"
                    ></div>

                    <span className="ml-3 text-lg font-medium text-gray-900 dark:text-gray-300">
                        {t('is_available')}
                    </span>
                </label>

                <span className="mt-2 text-sm font-medium text-gray-400 dark:text-gray-300">
                    {t('is_available_product_description')}
                </span>
            </div>

            <div className="relative flex-auto space-y-4 pt-6">
                <p className="text-slate-500 my-4 text-xl leading-relaxed">
                    {t('modal_product_add_details_title')}
                </p>

                {/* Name   */}
                <InputLabel
                    form={form}
                    label={'name'}
                    registerOptions={{
                        required: true,
                    }}
                    defaultValue={getValues('name')}
                    placeholder={t('introduce_box_pack_name')}
                />

                {/* Description  */}
                <div>
                    <InputTextarea
                        form={form}
                        label={'description'}
                        registerOptions={{
                            required: true,
                        }}
                        placeholder={`${t('introduce_box_pack_description')}`}
                    />
                </div>

                <div className="flex w-full flex-row space-x-3 ">
                    {/* Product Weight  */}
                    <div className="flex w-full flex-row space-x-3 ">
                        {/* Price  */}
                        <InputLabel
                            form={form}
                            label={'price'}
                            labelText={`${'price_input'}`}
                            registerOptions={{
                                required: true,
                                min: 0,
                                valueAsNumber: true,
                            }}
                            inputType="number"
                            placeholder={formatCurrency(24)}
                            infoTooltip={'tooltips.price'}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
