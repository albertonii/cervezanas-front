import React from 'react';
import {
    aroma_options,
    color_options,
    family_options,
    fermentation_options,
    recommended_glass_options,
} from '@/lib/beerEnum';
import { IProduct } from '@/lib/types/types';
import { useTranslations } from 'next-intl';

interface Props {
    product: IProduct;
}

const ProductTechnicalInformation = ({ product }: Props) => {
    if (!product.beers) return null;

    const t = useTranslations();

    const {
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
        recommended_glass,
        ingredients,
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

    console.log(ingredients);

    return (
        <div className="">
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

            {/* Ingredientes Principales */}
            {ingredients && ingredients?.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md space-y-4 mt-6">
                    <h2 className="text-3xl font-semibold text-gray-900 font-['NexaRust-script']">
                        {t('ingredients')}
                    </h2>
                    <p className="text-gray-700">{ingredients?.join(', ')}</p>
                </div>
            )}
        </div>
    );
};

export default ProductTechnicalInformation;
