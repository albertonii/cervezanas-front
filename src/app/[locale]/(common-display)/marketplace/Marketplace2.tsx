'use client';

import React, { useState } from 'react';

export default function EnhancedProductFilterPage() {
    const [filters, setFilters] = useState<{
        category: string[];
        style: string[];
        ibu: number[];
        abv: number[];
        color: string[];
        price: number[];
        volume: string[];
        region: string[];
        isPack: boolean;
        isAwardWinning: boolean;
        isOrganic: boolean;
        isNonAlcoholic: boolean;
        isGlutenFree: boolean;
    }>({
        category: [],
        style: [],
        ibu: [0, 100],
        abv: [0, 20],
        color: [],
        price: [0, 100],
        volume: [],
        region: [],
        isPack: false,
        isAwardWinning: false,
        isOrganic: false,
        isNonAlcoholic: false,
        isGlutenFree: false,
    });

    const [products, setProducts] = useState([
        {
            id: '1',
            name: 'IPA Clásica',
            category: 'Cerveza',
            style: 'IPA',
            ibu: 60,
            abv: 6.5,
            color: 'Dorada',
            image: '/placeholder.svg',
            price: 3.99,
            volume: '330ml',
            region: 'Cataluña',
            isPack: false,
            isAwardWinning: true,
            isOrganic: false,
            isNonAlcoholic: false,
            isGlutenFree: false,
        },
        // ... más productos
    ]);

    const handleCheckboxChange = (
        filterType: keyof typeof filters,
        value: any,
    ) => {
        // setFilters((prev) => {
        //     const updatedFilter = prev[filterType];
        //     if (typeof updatedFilter === 'boolean') {
        //         return {
        //             ...prev,
        //             [filterType]: !updatedFilter,
        //         };
        //     } else if (Array.isArray(updatedFilter)) {
        //         return {
        //             ...prev,
        //             [filterType]: updatedFilter.includes(value)
        //                 ? updatedFilter.filter((item: any) => item !== value)
        //                 : [...updatedFilter, value],
        //         };
        //     } else {
        //         return prev;
        //     }
        // });
    };

    const handleSliderChange = (filterType: any, value: any) => {
        setFilters((prev) => ({
            ...prev,
            [filterType]: value,
        }));
    };

    const handleSwitchChange = (filterType: keyof typeof filters) => {
        setFilters((prev) => ({
            ...prev,
            [filterType]: !prev[filterType],
        }));
    };

    const clearAllFilters = () => {
        setFilters({
            category: [],
            style: [],
            ibu: [0, 100],
            abv: [0, 20],
            color: [],
            price: [0, 100],
            volume: [],
            region: [],
            isPack: false,
            isAwardWinning: false,
            isOrganic: false,
            isNonAlcoholic: false,
            isGlutenFree: false,
        });
    };

    const filteredProducts = products.filter((product) => {
        return (
            (filters.category.length === 0 ||
                filters.category.includes(product.category)) &&
            (filters.style.length === 0 ||
                filters.style.includes(product.style)) &&
            product.ibu >= filters.ibu[0] &&
            product.ibu <= filters.ibu[1] &&
            product.abv >= filters.abv[0] &&
            product.abv <= filters.abv[1] &&
            (filters.color.length === 0 ||
                filters.color.includes(product.color)) &&
            product.price >= filters.price[0] &&
            product.price <= filters.price[1] &&
            (filters.volume.length === 0 ||
                filters.volume.includes(product.volume)) &&
            (filters.region.length === 0 ||
                filters.region.includes(product.region)) &&
            (!filters.isPack || product.isPack) &&
            (!filters.isAwardWinning || product.isAwardWinning) &&
            (!filters.isOrganic || product.isOrganic) &&
            (!filters.isNonAlcoholic || product.isNonAlcoholic) &&
            (!filters.isGlutenFree || product.isGlutenFree)
        );
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Barra lateral de filtros */}
                <aside className="w-full md:w-64 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Filtros</h2>
                        <button
                            onClick={clearAllFilters}
                            className="text-sm text-gray-600 hover:underline"
                        >
                            Limpiar filtros
                        </button>
                    </div>

                    {/* Categoría */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Categoría</h3>
                        <div className="space-y-2">
                            {['Cerveza', 'Sidra', 'Hidromiel'].map(
                                (category) => (
                                    <div
                                        key={category}
                                        className="flex items-center space-x-2"
                                    >
                                        <input
                                            type="checkbox"
                                            id={`category-${category}`}
                                            checked={filters.category.includes(
                                                category,
                                            )}
                                            onChange={() =>
                                                handleCheckboxChange(
                                                    'category',
                                                    category,
                                                )
                                            }
                                            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                        />
                                        <label
                                            htmlFor={`category-${category}`}
                                            className="text-gray-700"
                                        >
                                            {category}
                                        </label>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>

                    {/* Estilo */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Estilo</h3>
                        <div className="space-y-2">
                            {['IPA', 'Lager', 'Stout', 'Pilsner'].map(
                                (style) => (
                                    <div
                                        key={style}
                                        className="flex items-center space-x-2"
                                    >
                                        <input
                                            type="checkbox"
                                            id={`style-${style}`}
                                            checked={filters.style.includes(
                                                style,
                                            )}
                                            onChange={() =>
                                                handleCheckboxChange(
                                                    'style',
                                                    style,
                                                )
                                            }
                                            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                        />
                                        <label
                                            htmlFor={`style-${style}`}
                                            className="text-gray-700"
                                        >
                                            {style}
                                        </label>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>

                    {/* IBUs */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">IBUs</h3>
                        <div className="space-y-2">
                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={filters.ibu[1]}
                                onChange={(e) =>
                                    handleSliderChange('ibu', [
                                        filters.ibu[0],
                                        Number(e.target.value),
                                    ])
                                }
                                className="w-full"
                            />
                            <div className="flex justify-between">
                                <span>{filters.ibu[0]} IBU</span>
                                <span>{filters.ibu[1]} IBU</span>
                            </div>
                        </div>
                    </div>

                    {/* ABV */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">ABV</h3>
                        <div className="space-y-2">
                            <input
                                type="range"
                                min={0}
                                max={20}
                                step={0.1}
                                value={filters.abv[1]}
                                onChange={(e) =>
                                    handleSliderChange('abv', [
                                        filters.abv[0],
                                        Number(e.target.value),
                                    ])
                                }
                                className="w-full"
                            />
                            <div className="flex justify-between">
                                <span>{filters.abv[0]}%</span>
                                <span>{filters.abv[1]}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Color */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Color</h3>
                        <div className="space-y-2">
                            {['Dorada', 'Ámbar', 'Marrón', 'Negra'].map(
                                (color) => (
                                    <div
                                        key={color}
                                        className="flex items-center space-x-2"
                                    >
                                        <input
                                            type="checkbox"
                                            id={`color-${color}`}
                                            checked={filters.color.includes(
                                                color,
                                            )}
                                            onChange={() =>
                                                handleCheckboxChange(
                                                    'color',
                                                    color,
                                                )
                                            }
                                            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                        />
                                        <label
                                            htmlFor={`color-${color}`}
                                            className="text-gray-700"
                                        >
                                            {color}
                                        </label>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>

                    {/* Precio */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Precio</h3>
                        <div className="space-y-2">
                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={filters.price[1]}
                                onChange={(e) =>
                                    handleSliderChange('price', [
                                        filters.price[0],
                                        Number(e.target.value),
                                    ])
                                }
                                className="w-full"
                            />
                            <div className="flex justify-between">
                                <span>{filters.price[0]}€</span>
                                <span>{filters.price[1]}€</span>
                            </div>
                        </div>
                    </div>

                    {/* Volumen */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Volumen</h3>
                        <div className="space-y-2">
                            {['330ml', '500ml', '750ml', '1L'].map((volume) => (
                                <div
                                    key={volume}
                                    className="flex items-center space-x-2"
                                >
                                    <input
                                        type="checkbox"
                                        id={`volume-${volume}`}
                                        checked={filters.volume.includes(
                                            volume,
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                'volume',
                                                volume,
                                            )
                                        }
                                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                    />
                                    <label
                                        htmlFor={`volume-${volume}`}
                                        className="text-gray-700"
                                    >
                                        {volume}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Región */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Región</h3>
                        <div className="space-y-2">
                            {[
                                'Cataluña',
                                'Madrid',
                                'Andalucía',
                                'País Vasco',
                            ].map((region) => (
                                <div
                                    key={region}
                                    className="flex items-center space-x-2"
                                >
                                    <input
                                        type="checkbox"
                                        id={`region-${region}`}
                                        checked={filters.region.includes(
                                            region,
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                'region',
                                                region,
                                            )
                                        }
                                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                    />
                                    <label
                                        htmlFor={`region-${region}`}
                                        className="text-gray-700"
                                    >
                                        {region}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Switches */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isPack"
                                checked={filters.isPack}
                                onChange={() => handleSwitchChange('isPack')}
                                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <label htmlFor="isPack" className="text-gray-700">
                                Pack de diferentes cervezas
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isAwardWinning"
                                checked={filters.isAwardWinning}
                                onChange={() =>
                                    handleSwitchChange('isAwardWinning')
                                }
                                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <label
                                htmlFor="isAwardWinning"
                                className="text-gray-700"
                            >
                                Cervezas premiadas
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isOrganic"
                                checked={filters.isOrganic}
                                onChange={() => handleSwitchChange('isOrganic')}
                                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <label
                                htmlFor="isOrganic"
                                className="text-gray-700"
                            >
                                Cervezas ecológicas
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isNonAlcoholic"
                                checked={filters.isNonAlcoholic}
                                onChange={() =>
                                    handleSwitchChange('isNonAlcoholic')
                                }
                                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <label
                                htmlFor="isNonAlcoholic"
                                className="text-gray-700"
                            >
                                Sin alcohol
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isGlutenFree"
                                checked={filters.isGlutenFree}
                                onChange={() =>
                                    handleSwitchChange('isGlutenFree')
                                }
                                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <label
                                htmlFor="isGlutenFree"
                                className="text-gray-700"
                            >
                                Sin gluten
                            </label>
                        </div>
                    </div>
                </aside>

                {/* Área de productos */}
                <main className="flex-1">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold mb-2">
                            Nuestros Productos
                        </h1>
                        <p className="text-gray-600">
                            {filteredProducts.length} productos encontrados
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg mb-2">
                                        {product.name}
                                    </h3>
                                    <p className="text-gray-600 mb-2">
                                        {product.style}
                                    </p>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-lg">
                                            {product.price.toFixed(2)}€
                                        </span>
                                        <span>{product.volume}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-2">
                                            <svg
                                                className="w-5 h-5 text-amber-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M8 12h4m-2-2v4m5 2a2 2 0 100-4 2 2 0 000 4zm-4-2H5a2 2 0 100 4h4a2 2 0 110-4H5"
                                                ></path>
                                            </svg>
                                            <span>{product.abv}% ABV</span>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {product.region}
                                        </span>
                                    </div>
                                    {product.isAwardWinning && (
                                        <span className="text-yellow-500 text-sm">
                                            Premiada
                                        </span>
                                    )}
                                    {product.isOrganic && (
                                        <span className="text-green-500 text-sm">
                                            Ecológica
                                        </span>
                                    )}
                                    {product.isNonAlcoholic && (
                                        <span className="text-blue-500 text-sm">
                                            Sin alcohol
                                        </span>
                                    )}
                                    {product.isGlutenFree && (
                                        <span className="text-purple-500 text-sm">
                                            Sin gluten
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
