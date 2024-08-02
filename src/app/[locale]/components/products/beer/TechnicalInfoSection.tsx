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
                <p className="text-slate-700 my-4 text-xl font-semibold">
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
                        infoTooltip={t('hops_type_tooltip')}
                    />

                    <InputLabel
                        form={form}
                        label={'malt_type'}
                        labelText={'malt_type'}
                        registerOptions={{}}
                        inputType="text"
                        infoTooltip={t('malt_type_tooltip')}
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

                    {/* Consumption Recommended Temperatura */}
                    <InputLabel
                        form={form}
                        label={'consumption_temperature'}
                        labelText={'consumption_temperature'}
                        registerOptions={{
                            required: false,
                            min: 0,
                            max: 100,
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
                            min: 0,
                            max: 100,
                            valueAsNumber: true,
                        }}
                        inputType="number"
                        infoTooltip={t('srm_tooltip')}
                    />

                    <InputLabel
                        form={form}
                        label={'ebc'}
                        labelText={'ebc'}
                        registerOptions={{
                            min: 0,
                            max: 100,
                            valueAsNumber: true,
                        }}
                        inputType="number"
                        infoTooltip={t('ebc_tooltip')}
                    />
                </div>

                {/* OF & FG */}
                <div className="flex w-full flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    <InputLabel
                        form={form}
                        label={'og'}
                        labelText={'original_gravity'}
                        registerOptions={{
                            min: 0,
                            max: 100,
                            valueAsNumber: true,
                        }}
                        inputType="number"
                        infoTooltip={t('og_tooltip')}
                    />

                    <InputLabel
                        form={form}
                        label={'fg'}
                        labelText={'final_gravity'}
                        registerOptions={{
                            min: 0,
                            max: 100,
                            valueAsNumber: true,
                        }}
                        inputType="number"
                        infoTooltip={t('fg_tooltip')}
                    />
                </div>
            </section>
        </div>
    );
};

export default TechnicalInfoSection;
