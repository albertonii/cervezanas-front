import InputLabel from '../../common/InputLabel';
import InputTextarea from '../../common/InputTextarea';
import SelectInput from '../../common/SelectInput';
import StockInformation from '../../StockInformation';
import ProductPackInformation from '../../ProductPackInformation';
import React, { useEffect, useState } from 'react';
import { faPalette } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import {
    aroma_options,
    color_options,
    family_options,
    fermentation_options,
    format_options,
    volume_bottle_type_options,
    volume_can_type_options,
    volume_draft_type_options,
} from '../../../../../lib/beerEnum';
import {
    ICustomizeSettings,
    ModalAddProductFormData,
} from '../../../../../lib/types/types';
import { formatCurrency } from '../../../../../utils/formatCurrency';
import { capitalizeFirstLetter } from '../../../../../utils/formatWords';
import { DisplayInputError } from '../../common/DisplayInputError';

interface Props {
    form: UseFormReturn<ModalAddProductFormData>;
    customizeSettings: ICustomizeSettings;
}

export default function BeerInfoSection({ form, customizeSettings }: Props) {
    const t = useTranslations();

    const {
        register,
        formState: { errors },
        trigger,
        setValue,
    } = form;

    const [formatOptions, setFormatOptions] = useState<string>(
        format_options[0].label,
    );

    const [volume, setVolume] = useState<number>(0);

    useEffect(() => {
        const colorSettings = customizeSettings.colors.map((color) => {
            return { label: capitalizeFirstLetter(color), value: color };
        });
        const newSet = [...color_options, ...colorSettings];

        // setColorOptions(newSet);
    }, [customizeSettings.colors]);

    useEffect(() => {
        const famStyleSettings = customizeSettings.family_styles.map(
            (famStyle) => {
                return {
                    label: capitalizeFirstLetter(famStyle),
                    value: famStyle,
                };
            },
        );
        const newSet = [...family_options, ...famStyleSettings];

        // setFamStyleOptions(newSet);
    }, [customizeSettings.family_styles]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFormatOptions(event.target.value);
    };

    const handleSelectVolume = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setVolume(parseInt(e.target.value));
        setValue('volume', parseInt(e.target.value));
        trigger('volume');
    };

    return (
        <section className="relative border-2 rounded-lg border-gray-200 p-6 bg-white shadow-md space-y-8 mt-8">
            <p className="text-slate-500 text-xl font-semibold leading-relaxed">
                {t('modal_product_add_details_title')}
            </p>

            {/* Name */}
            <InputLabel
                form={form}
                label={'name'}
                registerOptions={{
                    required: true,
                }}
                placeholder={t('introduce_beer_name')}
            />

            {/* Description */}
            <div className="w-full">
                <InputTextarea
                    form={form}
                    label={'description'}
                    registerOptions={{
                        required: true,
                    }}
                    placeholder={t('introduce_beer_description')}
                />
            </div>

            <div className="relative border-2 rounded-lg border-gray-200 p-6 bg-white shadow-md">
                <FontAwesomeIcon
                    icon={faPalette}
                    title={'Beer Properties Icon'}
                    className="h-12 w-12 text-beer-blonde absolute -top-4 -left-4 bg-white p-2 rounded-full shadow-lg"
                />

                <section className="mx-10">
                    {/* Intensity & Fermentation */}
                    <div className="flex w-full flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                        <InputLabel
                            form={form}
                            label={'intensity'}
                            labelText={t('intensity_input')}
                            registerOptions={{
                                required: true,
                                min: 0,
                                max: 100,
                                valueAsNumber: true,
                            }}
                            inputType="number"
                            infoTooltip={t('intensity_tooltip')}
                        />

                        <SelectInput
                            form={form}
                            labelTooltip={'fermentation_tooltip'}
                            options={fermentation_options}
                            label={'fermentation'}
                            registerOptions={{
                                required: true,
                                valueAsNumber: true,
                            }}
                        />
                    </div>

                    {/* Family */}
                    <div className="flex w-full flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                        <SelectInput
                            form={form}
                            labelTooltip={'family_tooltip'}
                            options={family_options}
                            label={'family'}
                            registerOptions={{
                                required: true,
                                valueAsNumber: true,
                            }}
                        />

                        <SelectInput
                            form={form}
                            options={color_options}
                            label={'color'}
                            registerOptions={{
                                required: true,
                                valueAsNumber: true,
                            }}
                        />
                    </div>

                    {/* Aroma & IBU */}
                    <div className="flex w-full flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                        <SelectInput
                            form={form}
                            labelTooltip={'aroma_tooltip'}
                            options={aroma_options}
                            label={'aroma'}
                            registerOptions={{
                                required: true,
                                valueAsNumber: true,
                            }}
                        />

                        <InputLabel
                            form={form}
                            label={'ibu'}
                            labelText={t('ibu_input')}
                            registerOptions={{
                                required: true,
                                min: 0,
                                valueAsNumber: true,
                            }}
                            inputType="number"
                            infoTooltip={t('ibu_tooltip')}
                        />
                    </div>

                    {/* Is Gluten */}
                    <div className="w-full">
                        <label
                            htmlFor="is_gluten"
                            className="text-sm text-gray-600"
                        >
                            {t('is_gluten')}
                        </label>

                        <select
                            id="is_gluten"
                            {...register('is_gluten', {
                                required: true,
                            })}
                            className="relative block w-full mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-blonde focus:outline-none focus:ring-beer-blonde"
                        >
                            <option key={0} value={'false'}>
                                {t('no')}
                            </option>
                            <option key={1} value={'true'}>
                                {t('yes')}
                            </option>
                        </select>

                        {errors.is_gluten && (
                            <DisplayInputError
                                message={errors.is_gluten.message}
                            />
                        )}
                    </div>

                    {/* Format & Volume */}
                    <div className="flex w-full flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                        <div className="w-full">
                            <label
                                htmlFor="format"
                                className="text-sm text-gray-600"
                            >
                                {t('format')}
                            </label>

                            <select
                                id="format"
                                {...register('format', {
                                    value: formatOptions,
                                })}
                                onChange={handleChange}
                                className="relative block w-full mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-blonde focus:outline-none focus:ring-beer-blonde"
                            >
                                {format_options.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.label}
                                    >
                                        {t(option.label)}
                                    </option>
                                ))}
                            </select>

                            {errors.format && (
                                <DisplayInputError
                                    message={errors.format.message}
                                />
                            )}
                        </div>

                        <div className="w-full">
                            <label
                                htmlFor="volume"
                                className="text-sm text-gray-600"
                            >
                                {t('volume_label')}
                            </label>

                            <select
                                className="relative block w-full mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-blonde focus:outline-none focus:ring-beer-blonde"
                                id="volume"
                                {...register(`volume`, {
                                    valueAsNumber: true,
                                    required: true,
                                })}
                                onChange={handleSelectVolume}
                                value={volume}
                            >
                                {formatOptions === 'can'
                                    ? volume_can_type_options.map((option) => (
                                          <option
                                              key={option.value}
                                              value={option.value}
                                          >
                                              {option.value} (ML)
                                          </option>
                                      ))
                                    : formatOptions === 'bottle'
                                    ? volume_bottle_type_options.map(
                                          (option) => (
                                              <option
                                                  key={option.value}
                                                  value={option.value}
                                              >
                                                  {option.value} (ML)
                                              </option>
                                          ),
                                      )
                                    : volume_draft_type_options.map(
                                          (option) => (
                                              <option
                                                  key={option.value}
                                                  value={option.value}
                                              >
                                                  {option.value} (L)
                                              </option>
                                          ),
                                      )}
                            </select>

                            {errors.volume && (
                                <DisplayInputError
                                    message={errors.volume.message}
                                />
                            )}
                        </div>
                    </div>

                    {/* Product Weight */}
                    <div className="w-full">
                        <InputLabel
                            form={form}
                            label={'weight'}
                            labelText={t('weight') + ' (gr)'}
                            registerOptions={{
                                required: true,
                                min: 0,
                                valueAsNumber: true,
                            }}
                            inputType="number"
                            defaultValue={330}
                        />
                    </div>

                    {/* Individual Price */}
                    <div className="w-full">
                        <InputLabel
                            form={form}
                            label={'price'}
                            labelText={`${t('pvpr_input')}`}
                            registerOptions={{
                                required: true,
                                min: 0,
                                valueAsNumber: true,
                            }}
                            inputType="number"
                            placeholder={formatCurrency(2.5)}
                            infoTooltip={'pvpr_tooltip'}
                        />
                    </div>
                </section>
            </div>

            {/* Stock information and Packs */}
            <StockInformation form={form} />

            <ProductPackInformation form={form} />
        </section>
    );
}
