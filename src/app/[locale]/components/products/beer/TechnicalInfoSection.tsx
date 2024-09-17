import { recommended_glass_options } from '@/lib/beerEnum';
import { ModalAddProductFormData } from '@/lib/types/types';
import { faRulerCombined } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import InputLabel from '../../common/InputLabel';
import InputTextarea from '../../common/InputTextarea';
import SelectInput from '../../common/SelectInput';
import IngredientInput from './IngredientInput';

interface Props {
    form: UseFormReturn<ModalAddProductFormData, any>;
}

const TechnicalInfoSection = ({ form }: Props) => {
    const t = useTranslations();

    const [ingredients, setIngredients] = useState<string[]>([]);

    const { setValue } = form;

    useEffect(() => {
        setValue('ingredients', ingredients);
    }, [ingredients]);

    return (
        <div className="relative border-2 rounded-lg border-gray-200 p-6 bg-white shadow-md">
            <FontAwesomeIcon
                icon={faRulerCombined}
                title={'Beer Properties Icon'}
                className="h-12 w-12 text-beer-blonde absolute -top-4 -left-4 bg-white p-2 rounded-full shadow-lg"
            />

            <section className="mx-10">
                <p className="text-4xl font-['NexaRust-script']">
                    {t('modal_product_add_technical_details_title')}
                </p>

                {/* Technical Details commitment notice */}
                <p className="text-sm text-gray-600 mb-4 block">
                    Especifica los detalles técnicos de tu producto. Estos datos
                    son <b>opcionales</b> pero recomendados para que los
                    consumidores conozcan mejor tu producto. Las casillas vacías
                    no se mostrarán en la ficha de producto.
                </p>

                {/* Ingredients  */}
                <IngredientInput
                    ingredients={ingredients}
                    setIngredients={setIngredients}
                />

                {/* Hops and Malts */}
                <div className="flex w-full flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    <InputLabel
                        form={form}
                        label={'hops_type'}
                        labelText={'hops_type'}
                        registerOptions={{}}
                        inputType="text"
                        infoTooltip={t('tooltips.hops_type')}
                    />

                    <InputLabel
                        form={form}
                        label={'malt_type'}
                        labelText={'malt_type'}
                        registerOptions={{}}
                        inputType="text"
                        infoTooltip={t('tooltips.malt_type')}
                    />
                </div>

                <div className="flex w-full flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    {/* Recommended Glass  */}
                    <SelectInput
                        form={form}
                        options={recommended_glass_options}
                        label={'recommended_glass'}
                        optionLabelTranslationPrefix={'glass_type.'}
                        registerOptions={{
                            required: true,
                            valueAsNumber: true,
                        }}
                    />

                    {/* Recommended Consumption Temperature */}
                    <InputLabel
                        form={form}
                        label={'consumption_temperature'}
                        labelText={'consumption_temperature'}
                        registerOptions={{
                            required: false,
                            min: 0,
                            max: 100,
                            setValueAs: (value) => {
                                if (
                                    value === '' ||
                                    value === null ||
                                    value === undefined
                                )
                                    return null;
                                return isNaN(parseFloat(value))
                                    ? null
                                    : parseFloat(value);
                            },
                        }}
                        inputType="number"
                    />
                </div>

                <div className="flex w-full flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    {/* Beer Pairing information  */}
                    <InputTextarea
                        form={form}
                        label={'pairing'}
                        labelText={t('beer_pairing')}
                        registerOptions={{
                            required: false,
                        }}
                    />

                    {/* Brewers Note  */}
                    <InputTextarea
                        form={form}
                        label={'brewers_note'}
                        registerOptions={{
                            required: false,
                        }}
                    />
                </div>

                {/* SRM & EBC */}
                <div className="flex w-full flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    <InputLabel
                        form={form}
                        label={'srm'}
                        labelText={'srm'}
                        registerOptions={{
                            required: false,
                            min: 0,
                            max: 100,
                            setValueAs: (value) => {
                                if (
                                    value === '' ||
                                    value === null ||
                                    value === undefined
                                )
                                    return null;
                                return isNaN(parseFloat(value))
                                    ? null
                                    : parseFloat(value);
                            },
                        }}
                        inputType="number"
                        infoTooltip={t('tooltips.srm')}
                    />

                    <InputLabel
                        form={form}
                        label={'ebc'}
                        labelText={'ebc'}
                        registerOptions={{
                            required: false,
                            min: 0,
                            max: 100,
                            setValueAs: (value) => {
                                if (
                                    value === '' ||
                                    value === null ||
                                    value === undefined
                                )
                                    return null;
                                return isNaN(parseFloat(value))
                                    ? null
                                    : parseFloat(value);
                            },
                        }}
                        inputType="number"
                        infoTooltip={t('tooltips.ebc')}
                    />
                </div>

                {/* OF & FG */}
                <div className="flex w-full flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    <InputLabel
                        form={form}
                        label={'og'}
                        labelText={'original_gravity'}
                        registerOptions={{
                            required: false,
                            min: 0,
                            max: 100,
                            setValueAs: (value) => {
                                if (
                                    value === '' ||
                                    value === null ||
                                    value === undefined
                                )
                                    return null;
                                return isNaN(parseFloat(value))
                                    ? null
                                    : parseFloat(value);
                            },
                        }}
                        inputType="number"
                        infoTooltip={t('tooltips.og')}
                    />

                    <InputLabel
                        form={form}
                        label={'fg'}
                        labelText={'final_gravity'}
                        registerOptions={{
                            required: false,
                            min: 0,
                            max: 100,
                            setValueAs: (value) => {
                                if (
                                    value === '' ||
                                    value === null ||
                                    value === undefined
                                )
                                    return null;
                                return isNaN(parseFloat(value))
                                    ? null
                                    : parseFloat(value);
                            },
                        }}
                        inputType="number"
                        infoTooltip={t('tooltips.fg')}
                    />
                </div>
            </section>
        </div>
    );
};

export default TechnicalInfoSection;
