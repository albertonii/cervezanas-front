import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import {
    aroma_options,
    color_options,
    era_options,
    family_options,
    fermentation_options,
    format_options,
    origin_options,
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
import InputLabel from '../../common/InputLabel';
import InputTextarea from '../../common/InputTextarea';
import SelectInput from '../../common/SelectInput';
import StockInformationDetailsAndPacksAdd from '../../StockInformationDetailsAndPacksAdd';

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
        <div className="relative flex-auto space-y-4 pt-6">
            <p className="text-slate-500 my-4 text-xl leading-relaxed">
                {t('modal_product_add_details_title')}
            </p>

            {/* Name & Campaign  */}
            <InputLabel
                form={form}
                label={'name'}
                registerOptions={{
                    required: true,
                }}
            />

            {/* Description  */}
            <div>
                <InputTextarea
                    form={form}
                    label={'description'}
                    registerOptions={{
                        required: true,
                    }}
                    placeholder="IPA Jaira is a beer with a strong and intense aroma, with a fruity and floral touch."
                />
            </div>

            {/* Intensity & Fermentation  */}
            <div className="flex w-full flex-row space-x-3 ">
                <InputLabel
                    form={form}
                    label={'intensity'}
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

            {/* Color  */}
            <div className="flex w-full flex-row space-x-3 ">
                <SelectInput
                    form={form}
                    labelTooltip={'color_tooltip'}
                    options={color_options}
                    label={'color'}
                    registerOptions={{
                        required: true,
                        valueAsNumber: true,
                    }}
                />

                <SelectInput
                    form={form}
                    labelTooltip={'origin_tooltip'}
                    options={origin_options}
                    label={'origin'}
                    registerOptions={{
                        required: true,
                        valueAsNumber: true,
                    }}
                />
            </div>

            {/* Family  */}
            <div className="flex w-full flex-row space-x-3 ">
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

                {/*
              TODO: Volver aqui para ver por qué está famStyleOptions
              <label htmlFor="family" className="text-sm text-gray-600">
                {t("family")}

                <InfoTooltip
                  content={`${t("family_tooltip")}`}
                  direction="top"
                  delay={200}
                  width={300}
                />
              </label>

              <select
                id="family"
                {...register("family", {
                  required: true,
                  valueAsNumber: true,
                })}
                defaultValue={family_options[0].value}
                className="relative  block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
              >
                {famStyleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.label)}
                  </option>
                ))}
              </select>

              {errors.family?.type === "required" && (
                <p>{t("errors.input_required")}</p>
              )} */}

                <SelectInput
                    form={form}
                    labelTooltip={'era_tooltip'}
                    options={era_options}
                    label={'era'}
                    registerOptions={{
                        required: true,
                        valueAsNumber: true,
                    }}
                />
            </div>

            <div className="flex w-full flex-row space-x-3 ">
                {/* Aroma  */}
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

                {/* IBU  */}
                <InputLabel
                    form={form}
                    label={'ibu'}
                    registerOptions={{
                        required: true,
                        min: 0,
                        valueAsNumber: true,
                    }}
                    inputType="number"
                    infoTooltip={t('ibu_tooltip')}
                />
            </div>

            {/* Is Gluten  */}
            <div className="flex w-full flex-row space-x-3 ">
                <div className="w-full ">
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
                        className="relative  block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                    >
                        <option key={0} value={'false'}>
                            {t('no')}
                        </option>
                        <option key={1} value={'true'}>
                            {t('yes')}
                        </option>
                    </select>

                    {errors.is_gluten && (
                        <DisplayInputError message={errors.is_gluten.message} />
                    )}
                </div>
            </div>

            {/* Format & Volume  */}
            <div className="flex w-full flex-row space-x-3 ">
                <div className="w-full ">
                    <label htmlFor="format" className="text-sm text-gray-600">
                        {t('format')}
                    </label>

                    <select
                        id="format"
                        {...register('format', {
                            value: formatOptions,
                        })}
                        onChange={handleChange}
                        className="relative  block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                    >
                        {format_options.map((option) => (
                            <option key={option.value} value={option.label}>
                                {t(option.label)}
                            </option>
                        ))}
                    </select>

                    {errors.format && (
                        <DisplayInputError message={errors.format.message} />
                    )}
                </div>

                <div className="space-y w-full">
                    <label htmlFor="volume" className="text-sm text-gray-600">
                        {t('volume_label')}
                    </label>

                    <select
                        className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
                        id="volume"
                        {...register(`volume`, {
                            valueAsNumber: true,
                            required: true,
                        })}
                        onChange={(e) => {
                            handleSelectVolume(e);
                        }}
                        value={volume}
                    >
                        {formatOptions === 'can' ? (
                            <>
                                {volume_can_type_options.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.value} (ML)
                                    </option>
                                ))}
                            </>
                        ) : formatOptions === 'bottle' ? (
                            <>
                                {volume_bottle_type_options.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.value} (ML)
                                    </option>
                                ))}
                            </>
                        ) : (
                            <>
                                {volume_draft_type_options.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.value} (L)
                                    </option>
                                ))}
                            </>
                        )}
                    </select>

                    {errors.volume && (
                        <DisplayInputError message={errors.volume.message} />
                    )}
                </div>

                {/* Product Weight  */}
                <div className="flex w-full flex-row space-x-3 ">
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
            </div>

            {/* Individual Price  */}
            <div className="flex w-full flex-row space-x-3 ">
                <InputLabel
                    form={form}
                    label={'price'}
                    labelText={`${t('pvpr')} (€)`}
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

            {/* Stock information and Packs */}
            <StockInformationDetailsAndPacksAdd form={form} />
        </div>
    );
}