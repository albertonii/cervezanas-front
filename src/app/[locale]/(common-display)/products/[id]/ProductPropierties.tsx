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
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900 font-['NexaRust-script']">
                    {t('key_features')}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((prop, index) => {
                        if (!prop.value) return null;

                        return (
                            <div
                                key={index}
                                className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm"
                            >
                                <span className="block text-sm font-medium text-gray-500">
                                    {prop.label}
                                </span>
                                <span className="block text-xl font-semibold text-gray-800">
                                    {prop.value}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Pairing */}
            <div className="flex flex-col lg:flex-row space-y-6 space-x-0 lg:space-y-0 lg:space-x-4 ">
                <div className="w-full bg-white p-6 rounded-lg shadow-md space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900 font-['NexaRust-script']">
                        {t('beer_pairing')}
                    </h2>
                    <p className="text-gray-700">{pairing}</p>
                </div>

                {/* Brewers Note */}
                <div className="w-full bg-white p-6 rounded-lg shadow-md space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-900 font-['NexaRust-script']">
                        {t('brewers_note')}
                    </h2>
                    <p className="text-gray-700">{brewers_note}</p>
                </div>
            </div>

            {/* Ingredientes Principales */}
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900 font-['NexaRust-script']">
                    {t('ingredients')}
                </h2>
                <p className="text-gray-700">{ingredients?.join(', ')}</p>
            </div>

            {/* Información sobre la Cervecería */}
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900 font-['NexaRust-script']">
                    {t('brewery_info')}
                </h2>
                <p className="text-gray-700">{'brewery_info'}</p>
            </div>
        </div>
    );

    // return (
    //     <div className="bg-gray-100 shadow-lg rounded-lg p-6 mt-8">
    //         <h3 className="text-3xl font-bold text-gray-900 mb-6">
    //             Propiedades de la Cerveza
    //         </h3>
    //         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    //             {properties.map((prop, index) => (
    //                 <div key={index} className="flex flex-col">
    //                     <span className="text-lg font-semibold text-gray-800 mb-2">
    //                         {prop.label}
    //                     </span>
    //                     <span className="text-xl text-gray-700">
    //                         {prop.value}
    //                     </span>
    //                 </div>
    //             ))}
    //         </div>
    //         <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
    //             <div className="bg-white p-4 rounded-lg shadow-md">
    //                 <h4 className="text-xl font-bold text-gray-800">
    //                     Composición
    //                 </h4>
    //                 <p className="text-gray-700 mt-2">{composition}</p>
    //             </div>
    //             <div className="bg-white p-4 rounded-lg shadow-md">
    //                 <h4 className="text-xl font-bold text-gray-800">
    //                     Intensidad
    //                 </h4>
    //                 <p className="text-gray-700 mt-2">{intensity}</p>
    //             </div>
    //             <div className="bg-white p-4 rounded-lg shadow-md">
    //                 <h4 className="text-xl font-bold text-gray-800">Origen</h4>
    //                 <p className="text-gray-700 mt-2">
    //                     {origin}, {country}
    //                 </p>
    //             </div>
    //         </div>
    //         <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
    //             <div className="bg-white p-4 rounded-lg shadow-md">
    //                 <h4 className="text-xl font-bold text-gray-800">SRM</h4>
    //                 <p className="text-gray-700 mt-2">{srm}</p>
    //             </div>
    //             <div className="bg-white p-4 rounded-lg shadow-md">
    //                 <h4 className="text-xl font-bold text-gray-800">OG</h4>
    //                 <p className="text-gray-700 mt-2">{og}</p>
    //             </div>
    //             <div className="bg-white p-4 rounded-lg shadow-md">
    //                 <h4 className="text-xl font-bold text-gray-800">FG</h4>
    //                 <p className="text-gray-700 mt-2">{fg}</p>
    //             </div>
    //             <div className="bg-white p-4 rounded-lg shadow-md">
    //                 <h4 className="text-xl font-bold text-gray-800">IBU</h4>
    //                 <p className="text-gray-700 mt-2">{ibu}</p>
    //             </div>
    //         </div>
    //     </div>
    // );

    // return (
    //     <div className="bg-white shadow-md rounded-lg p-6 mt-8">
    //         <h3 className="text-2xl font-bold text-gray-800 mb-4">
    //             Propiedades de la Cerveza
    //         </h3>
    //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //             {properties.map((prop, index) => (
    //                 <div
    //                     key={index}
    //                     className="flex justify-between border-b pb-2"
    //                 >
    //                     <span className="font-semibold text-gray-700">
    //                         {prop.label}
    //                     </span>
    //                     <span className="text-gray-900">{prop.value}</span>
    //                 </div>
    //             ))}
    //         </div>
    //     </div>
    // );
};

export default ProductPropierties;
