import React from 'react';
import { IProduct } from '@/lib//types/types';
import { useTranslations } from 'next-intl';
import {
    aroma_options,
    color_options,
    family_options,
    fermentation_options,
    recommended_glass_options,
} from '@/lib/beerEnum';

interface Props {
    product: IProduct;
}

const ProductPropierties = ({ product }: Props) => {
    if (!product.beers) return null;
    const t = useTranslations();

    const {
        category,
        fermentation,
        color,
        family,
        aroma,
        is_gluten,
        format,
        volume,
        sku,
        intensity,
        srm,
        og,
        fg,
        ibu,
        pairing,
        ingredients,
        recommended_glass,
        brewers_note,
    } = product.beers;

    const recommendedGlass =
        recommended_glass &&
        t(
            `glass_type.${
                recommended_glass_options[parseInt(recommended_glass)].label
            }`,
        );

    const properties = [
        // { label: 'Categoría', value: category },
        {
            label: 'Fermentación',
            value: t(fermentation_options[parseInt(fermentation)].label),
        },
        { label: 'Color', value: t(color_options[parseInt(color)].label) },
        { label: 'Familia', value: t(family_options[parseInt(family)].label) },
        { label: 'Aroma', value: t(aroma_options[parseInt(aroma)].label) },
        { label: 'Intensidad', value: intensity + '%' },
        { label: '¿Tiene Gluten?', value: is_gluten ? 'Sí' : 'No' },
        { label: 'Formato', value: t(format) },
        { label: 'Volumen', value: `${volume} ml` },
        { label: 'IBU', value: ibu },
        { label: 'SKU', value: sku },
        { label: 'SRM', value: srm },
        { label: 'OG', value: og },
        { label: 'FG', value: fg },
        {
            label: 'Vaso Recomendado',
            value: recommendedGlass,
        },
    ];

    return (
        <div className="bg-gray-50 p-8 rounded-lg shadow-lg space-y-6">
            {/* Características Clave */}
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4 border-beer-blonde border-2">
                <h2 className="text-3xl font-semibold text-gray-900 font-['NexaRust-script']">
                    {t('key_features')}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-4">
                    {properties.map((prop, index) => {
                        if (!prop.value) return null;

                        return (
                            <div
                                key={index}
                                className="bg-white p-2 border border-gray-200 rounded-lg shadow-sm"
                            >
                                <span className="block font-semibold text-beer-draft text-xs ">
                                    {prop.label}
                                </span>
                                <span className="block text-sm md:text-lg font-semibold text-gray-800">
                                    {prop.value}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row space-y-6 space-x-0 lg:space-y-0 lg:space-x-4 ">
                {/* Pairing */}
                {pairing && (
                    <div className="w-full bg-white p-6 rounded-lg shadow-md space-y-4">
                        <h2 className="text-3xl font-semibold text-gray-900 font-['NexaRust-script']">
                            {t('beer_pairing')}
                        </h2>
                        <p className="text-gray-700">{pairing}</p>
                    </div>
                )}

                {/* Brewers Note */}
                {brewers_note && (
                    <div className="w-full bg-white p-6 rounded-lg shadow-md space-y-4">
                        <h2 className="text-3xl font-semibold text-gray-900 font-['NexaRust-script']">
                            {t('brewers_note')}
                        </h2>
                        <p className="text-gray-700">{brewers_note}</p>
                    </div>
                )}
            </div>

            {/* Ingredientes Principales */}
            {ingredients && (
                <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                    <h2 className="text-3xl font-semibold text-gray-900 font-['NexaRust-script']">
                        {t('ingredients')}
                    </h2>
                    <p className="text-gray-700">{ingredients?.join(', ')}</p>
                </div>
            )}

            {/* Información sobre la Cervecería */}
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-3xl font-semibold text-gray-900 font-['NexaRust-script']">
                    {t('brewery_info')}
                </h2>
                <p className="text-gray-700">{'brewery_info'}</p>
            </div>
        </div>
    );
};

export default ProductPropierties;
