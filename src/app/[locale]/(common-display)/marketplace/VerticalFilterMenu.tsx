import { FilterProps, useAppContext } from '@/app/context/AppContext';
import React, { useState } from 'react';
import Image from 'next/image';

const VerticalFilterMenu = () => {
    const { filters, handleFilters, clearFilters } = useAppContext();

    const [isSidebarVisible, setSidebarVisible] = useState(false);

    const handleSliderChange = (
        filterType: keyof FilterProps,
        value: number[],
    ) => {
        handleFilters({
            ...filters,
            [filterType]: value,
        });
    };

    const handleSwitchChange = (filterType: keyof FilterProps) => {
        handleFilters({
            ...filters,
            [filterType]: !filters[filterType],
        });
    };

    const handleCheckboxChange = (
        filterType: keyof FilterProps,
        value: any,
    ) => {
        const currentFilter: any = filters[filterType];

        // Verifica que el filtro actual sea un array (como en style, region, color, etc.)
        if (Array.isArray(currentFilter)) {
            if (currentFilter.includes(value)) {
                // Si el valor ya está presente, se elimina
                handleFilters({
                    ...filters,
                    [filterType]: currentFilter.filter(
                        (filter: any) => filter !== value,
                    ),
                });
            } else {
                // Si el valor no está presente, se agrega
                handleFilters({
                    ...filters,
                    [filterType]: [...currentFilter, value],
                });
            }
        } else {
            console.error(`El filtro ${filterType} no es un array.`);
        }

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };


    return (
        <div className="bg-beer-foam mx-auto absolute md:relative bg-transparent">
            <div className="flex flex-col md:flex-row gap-8">
                <button
                    onClick={toggleSidebar}
                    className="text-sm text-gray-600 hover:underline block md:hidden text-left font-semibold pl-2"
                >
                    {isSidebarVisible
                        ? '< Ocultar Filtros'
                        : '> Mostrar Filtros'}
                </button>
                {/* Barra lateral de filtros */}

                <aside
                    className={`z-20 bg-gray-50 shadow-xl p-4 w-full md:w-64 space-y-6 transition-transform duration-300 ease-in-out  ${
                        isSidebarVisible
                            ? 'transform translate-x-0'
                            : 'transform -translate-x-full'
                    } md:transform-none`} // md:transform-none para ignorar transform en pantallas más grandes
                >
                    <div className="flex justify-between items-center">
                        <h2 className="text-5xl font-bold font-['NexaRust-script'] text-beer-blonde">Filtros</h2>
                        <button
                            onClick={clearFilters}
                            className="text-xs text-gray-400 hover:text-black w-[70px]"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                    <figure className="m-auto text-center">
                            <Image
                                className="m-auto"
                                src="/assets/home/detalle.svg"
                                width={60}
                                height={10}
                                alt="Dingbat"
                            />
                        </figure>
                    {/* Categoría */}
                    <div className="space-y-4 ">
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
                                            // onChange={() =>
                                            //     handleCheckboxChange(
                                            //         'category',
                                            //         category,
                                            //     )
                                            // }
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
                                          //  checked={filters.style.includes(
                                          //      style,
                                          //  )}
                                            // onChange={() =>
                                            //     handleCheckboxChange(
                                            //         'style',
                                            //         style,
                                            //     )
                                            // }
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
                                className="w-full bg-cerv-banana"
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
                                            // onChange={() =>
                                            //     handleCheckboxChange(
                                            //         'color',
                                            //         color,
                                            //     )
                                            // }
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
                                        // onChange={() =>
                                        //     handleCheckboxChange(
                                        //         'volume',
                                        //         volume,
                                        //     )
                                        // }
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
                                        // onChange={() =>
                                        //     handleCheckboxChange(
                                        //         'region',
                                        //         region,
                                        //     )
                                        // }
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
                {/* <main className="flex-1">
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
                </main> */}
            </div>
        </div>
    );
};

export default VerticalFilterMenu;
