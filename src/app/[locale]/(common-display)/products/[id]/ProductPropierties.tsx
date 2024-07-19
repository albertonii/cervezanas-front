import React from 'react';
import { IProduct } from '../../../../../lib/types/types';

interface Props {
    product: IProduct;
}

const ProductPropierties = ({ product }: Props) => {
    if (!product.beers) return null;

    const {
        category,
        fermentation,
        color,
        family,
        era,
        aroma,
        is_gluten,
        format,
        volume,
        sku,
        intensity,
        origin,
        country,
        composition,
        srm,
        og,
        fg,
        ibu,
    } = product.beers;

    const properties = [
        { label: 'Categoría', value: category },
        { label: 'Fermentación', value: fermentation },
        { label: 'Color', value: color },
        { label: 'Familia', value: family },
        { label: 'Era', value: era },
        { label: 'Aroma', value: aroma },
        { label: 'Sin Gluten', value: is_gluten ? 'Sí' : 'No' },
        { label: 'Formato', value: format },
        { label: 'Volumen', value: `${volume} ml` },
        { label: 'SKU', value: sku },
        { label: 'Intensidad', value: intensity },
        { label: 'Origen', value: origin },
        { label: 'País', value: country },
        { label: 'Composición', value: composition },
        { label: 'SRM', value: srm },
        { label: 'OG', value: og },
        { label: 'FG', value: fg },
        { label: 'IBU', value: ibu },
    ];

    // return (
    //     <div className="bg-gray-50 p-8 rounded-lg shadow-lg">
    //         <h3 className="text-3xl font-bold text-gray-900 mb-6">
    //             Propiedades de la Cerveza
    //         </h3>
    //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    //             {properties.map((prop, index) => (
    //                 <div
    //                     key={index}
    //                     className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm"
    //                 >
    //                     <span className="block text-sm font-medium text-gray-500">
    //                         {prop.label}
    //                     </span>
    //                     <span className="block text-xl font-semibold text-gray-800">
    //                         {prop.value}
    //                     </span>
    //                 </div>
    //             ))}
    //         </div>
    //         <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    //             <div className="bg-white p-6 rounded-lg shadow-md">
    //                 <h4 className="text-2xl font-semibold text-gray-900">
    //                     Composición
    //                 </h4>
    //                 <p className="text-gray-700 mt-2">{composition}</p>
    //             </div>
    //             <div className="bg-white p-6 rounded-lg shadow-md">
    //                 <h4 className="text-2xl font-semibold text-gray-900">
    //                     Intensidad
    //                 </h4>
    //                 <p className="text-gray-700 mt-2">{intensity}</p>
    //             </div>
    //             <div className="bg-white p-6 rounded-lg shadow-md">
    //                 <h4 className="text-2xl font-semibold text-gray-900">
    //                     Origen
    //                 </h4>
    //                 <p className="text-gray-700 mt-2">
    //                     {origin}, {country}
    //                 </p>
    //             </div>
    //         </div>
    //         <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    //             <div className="bg-white p-6 rounded-lg shadow-md">
    //                 <h4 className="text-2xl font-semibold text-gray-900">
    //                     SRM
    //                 </h4>
    //                 <p className="text-gray-700 mt-2">{srm}</p>
    //             </div>
    //             <div className="bg-white p-6 rounded-lg shadow-md">
    //                 <h4 className="text-2xl font-semibold text-gray-900">OG</h4>
    //                 <p className="text-gray-700 mt-2">{og}</p>
    //             </div>
    //             <div className="bg-white p-6 rounded-lg shadow-md">
    //                 <h4 className="text-2xl font-semibold text-gray-900">FG</h4>
    //                 <p className="text-gray-700 mt-2">{fg}</p>
    //             </div>
    //             <div className="bg-white p-6 rounded-lg shadow-md">
    //                 <h4 className="text-2xl font-semibold text-gray-900">
    //                     IBU
    //                 </h4>
    //                 <p className="text-gray-700 mt-2">{ibu}</p>
    //             </div>
    //         </div>
    //     </div>
    // );

    return (
        <div className="bg-gray-50 p-8 rounded-lg shadow-lg space-y-12">
            {/* Características Clave */}
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">
                    Características Clave
                </h2>
                <ul className="list-disc list-inside text-gray-700">
                    <li>
                        <strong>Contenido de Alcohol:</strong> {ibu}%
                    </li>
                    <li>
                        <strong>Volumen:</strong> {volume} ml
                    </li>
                    <li>
                        <strong>Perfil de Sabor:</strong> {aroma}
                    </li>
                </ul>
            </div>

            {/* Notas de Cata */}
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">
                    Notas de Cata
                </h2>
                <p className="text-gray-700">
                    Disfruta de esta cerveza artesanal con sus delicados matices
                    de sabor, que incluyen notas a malta, lúpulo fresco y un
                    toque de frutas cítricas. Perfecta para maridar con comidas
                    ligeras y quesos suaves.
                </p>
            </div>

            {/* Ingredientes Principales */}
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">
                    Ingredientes Principales
                </h2>
                <p className="text-gray-700">{"ingredients.join(', ')"}</p>
            </div>

            {/* Información sobre la Cervecería */}
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">
                    Información sobre la Cervecería
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
