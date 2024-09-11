import Image from 'next/image';
import React, { useState } from 'react';
import {
    Color,
    Family,
    Volume_bottle,
    Volume_can,
    Volume_draft,
} from '@/lib/beerEnum';
import { useTranslations } from 'next-intl';
import { FilterProps, useAppContext } from '@/app/context/AppContext';

const regions = [
    'Cataluña',
    'Madrid',
    'Andalucía',
    'País Vasco',
    'Valencia',
    'Galicia',
];

const colors = Object.entries(Color)
    .filter(([key, value]) => !isNaN(Number(key))) // Filtra los valores que no sean numéricos
    .map(([key, value]) => ({
        label: key,
        value: value as string, // El valor del color en string
    }));

const families = Object.entries(Family)
    .filter(([key, value]) => !isNaN(Number(key))) // Filtra los valores que no sean numéricos
    .map(([key, value]) => ({
        label: key,
        value: value as string, // El valor de la familia en string
    }));

const volumesCan = Object.entries(Volume_can)
    .filter(([key, value]) => !isNaN(Number(key))) // Filtra los valores que no sean numéricos
    .map(([key, value]) => ({
        label: key,
        value: value as string, // El valor del volumen en string
    }));

const volumesBottle = Object.entries(Volume_bottle)
    .filter(([key, value]) => !isNaN(Number(key))) // Filtra los valores que no sean numéricos
    .map(([key, value]) => ({
        label: key,
        value: value as string, // El valor del volumen en string
    }));

const volumesDraft = Object.entries(Volume_draft)
    .filter(([key, value]) => !isNaN(Number(key))) // Filtra los valores que no sean numéricos
    .map(([key, value]) => ({
        label: key,
        value: value as string, // El valor del volumen en string
    }));

const VerticalFilterMenu = () => {
    const t = useTranslations();

    const { filters, handleFilters, clearFilters } = useAppContext();

    const [isSidebarVisible, setSidebarVisible] = useState(false);

    const [showMoreFamilies, setShowMoreFamilies] = useState(false);
    const [showMoreRegions, setShowMoreRegions] = useState(false);
    const [showMoreColors, setShowMoreColors] = useState(false);
    const [showMoreVolumesCan, setShowMoreVolumesCan] = useState(false);
    const [showMoreVolumesBottle, setShowMoreVolumesBottle] = useState(false);
    const [showMoreVolumesDraft, setShowMoreVolumesDraft] = useState(false);

    const visibleFamilies = showMoreFamilies ? families : families.slice(0, 3);
    const visibleRegions = showMoreRegions ? regions : regions.slice(0, 3);
    const visibleColors = showMoreColors ? colors : colors.slice(0, 3);
    const visibleVolumesCan = showMoreVolumesCan
        ? volumesCan
        : volumesCan.slice(0, 3);

    const visibleVolumesBottle = showMoreVolumesBottle
        ? volumesBottle
        : volumesBottle.slice(0, 3);

    const visibleVolumesDraft = showMoreVolumesDraft
        ? volumesDraft
        : volumesDraft.slice(0, 3);

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
    };

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
                        <h2 className="text-5xl font-bold font-['NexaRust-script'] text-beer-blonde">
                            {t('filters')}
                        </h2>
                        <button
                            onClick={clearFilters}
                            className="text-xs text-gray-400 hover:text-black w-[70px]"
                        >
                            {t('clear_filters')}
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

                    {/* Precio */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">{t('price')}</h3>
                        <div className="space-y-2">
                            <input
                                type="range"
                                min={0}
                                max={500}
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

                    {/* Estilo */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">{t('family')}</h3>
                        <div className="space-y-2">
                            {visibleFamilies.map((family) => (
                                <div
                                    key={family.value}
                                    className="flex items-center space-x-2"
                                >
                                    <input
                                        type="checkbox"
                                        id={`style-${family}`}
                                        checked={filters.family.includes(
                                            family.value,
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                'family',
                                                family.value,
                                            )
                                        }
                                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                    />
                                    <label
                                        htmlFor={`style-${family}`}
                                        className="text-gray-700"
                                    >
                                        {t(family.value)}
                                    </label>
                                </div>
                            ))}

                            {families.length > 3 && (
                                <button
                                    onClick={() =>
                                        setShowMoreFamilies(!showMoreFamilies)
                                    }
                                    className="text-beer-draft text-sm mt-2 focus:outline-none"
                                >
                                    {showMoreFamilies
                                        ? t('show_less')
                                        : t('show_more')}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Categoría */}
                    {/* <div className="space-y-4">
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
                    </div> */}

                    {/* IBUs */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                            {t('bitterness')}
                        </h3>
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
                                className="w-full "
                                style={{
                                    WebkitAppearance: 'none',
                                    MozAppearance: 'none',
                                }}
                            />

                            <div className="flex justify-between">
                                <span>{filters.ibu[0]} IBU</span>
                                <span>{filters.ibu[1]} IBU</span>
                            </div>
                        </div>
                    </div>

                    {/* ABV */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                            {t('abv_alcoholic')}
                        </h3>
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
                        <h3 className="text-lg font-semibold">{t('color')}</h3>
                        <div className="space-y-2">
                            {visibleColors.map((color) => (
                                <div
                                    key={color.label}
                                    className="flex items-center space-x-2"
                                >
                                    <input
                                        type="checkbox"
                                        id={`color-${color}`}
                                        checked={filters.color.includes(
                                            color.value,
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                'color',
                                                color.value,
                                            )
                                        }
                                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                    />
                                    <label
                                        htmlFor={`color-${color}`}
                                        className="text-gray-700"
                                    >
                                        {t(color.value)}
                                    </label>
                                </div>
                            ))}

                            {colors.length > 3 && (
                                <button
                                    onClick={() =>
                                        setShowMoreColors(!showMoreColors)
                                    }
                                    className="text-beer-draft text-sm mt-2 focus:outline-none"
                                >
                                    {showMoreColors
                                        ? t('show_less')
                                        : t('show_more')}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Volumen Lata */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                            {t('volume_can') + ' (ml)'}
                        </h3>
                        <div className="space-y-2">
                            {visibleVolumesCan.map((volume) => (
                                <div
                                    key={volume.label}
                                    className="flex items-center space-x-2"
                                >
                                    <input
                                        type="checkbox"
                                        id={`volume-can-${volume}`}
                                        checked={filters.volume_can.includes(
                                            volume.label,
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                'volume_can',
                                                volume.label,
                                            )
                                        }
                                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                    />
                                    <label
                                        htmlFor={`volume-can-${volume}`}
                                        className="text-gray-700"
                                    >
                                        {t(volume.label)}
                                    </label>
                                </div>
                            ))}

                            {volumesCan.length > 3 && (
                                <button
                                    onClick={() =>
                                        setShowMoreVolumesCan(
                                            !showMoreVolumesCan,
                                        )
                                    }
                                    className="text-beer-draft text-sm mt-2 focus:outline-none"
                                >
                                    {showMoreVolumesCan
                                        ? t('show_less')
                                        : t('show_more')}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Volumen Botella */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                            {t('volume_bottle') + ' (ml)'}
                        </h3>
                        <div className="space-y-2">
                            {visibleVolumesBottle.map((volume) => (
                                <div
                                    key={volume.label}
                                    className="flex items-center space-x-2"
                                >
                                    <input
                                        type="checkbox"
                                        id={`volume-bottle-${volume}`}
                                        checked={filters.volume_bottle.includes(
                                            volume.label,
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                'volume_bottle',
                                                volume.label,
                                            )
                                        }
                                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                    />
                                    <label
                                        htmlFor={`volume-bottle-${volume}`}
                                        className="text-gray-700"
                                    >
                                        {t(volume.label)}
                                    </label>
                                </div>
                            ))}

                            {volumesBottle.length > 3 && (
                                <button
                                    onClick={() =>
                                        setShowMoreVolumesBottle(
                                            !showMoreVolumesBottle,
                                        )
                                    }
                                    className="text-beer-draft text-sm mt-2 focus:outline-none"
                                >
                                    {showMoreVolumesBottle
                                        ? t('show_less')
                                        : t('show_more')}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Volumen Barril */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                            {t('volume_keg') + ' (lt)'}
                        </h3>
                        <div className="space-y-2">
                            {visibleVolumesDraft.map((volume) => (
                                <div
                                    key={volume.label}
                                    className="flex items-center space-x-2"
                                >
                                    <input
                                        type="checkbox"
                                        id={`volume-keg-${volume}`}
                                        checked={filters.volume_keg.includes(
                                            volume.label,
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(
                                                'volume_keg',
                                                volume.label,
                                            )
                                        }
                                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                    />
                                    <label
                                        htmlFor={`volume-keg-${volume}`}
                                        className="text-gray-700"
                                    >
                                        {t(volume.label)}
                                    </label>
                                </div>
                            ))}

                            {volumesDraft.length > 3 && (
                                <button
                                    onClick={() =>
                                        setShowMoreVolumesDraft(
                                            !showMoreVolumesDraft,
                                        )
                                    }
                                    className="text-beer-draft text-sm mt-2 focus:outline-none"
                                >
                                    {showMoreVolumesDraft
                                        ? t('show_less')
                                        : t('show_more')}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Región */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">{t('region')}</h3>
                        <div className="space-y-2">
                            {visibleRegions.map((region) => (
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

                            {regions.length > 3 && (
                                <button
                                    onClick={() =>
                                        setShowMoreRegions(!showMoreRegions)
                                    }
                                    className="text-beer-draft text-sm mt-2 focus:outline-none"
                                >
                                    {showMoreRegions
                                        ? t('show_less')
                                        : t('show_more')}
                                </button>
                            )}
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
                                {t('pack_different_beers')}
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
                                {t('award_winning')}
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
                                {t('eco_beers')}
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
                                {t('non_alcoholic')}
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
                                {t('gluten_free')}
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
