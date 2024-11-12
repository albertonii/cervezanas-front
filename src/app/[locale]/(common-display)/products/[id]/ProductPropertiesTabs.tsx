import ProductNotes from './ProductNotes';
import ProductAwardsInformation from './ProductAwardsInformation';
import ProductTechnicalInformation from './ProductTechnicalInformation';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IProduct } from '@/lib/types/types';
import BreweryPropertiesTab from './BreweryPropertiesTab';

interface Props {
    product: IProduct;
}

const ProductPropertiesTabs = ({ product }: Props) => {
    const t = useTranslations();

    const [selectedTab, setSelectedTab] = useState('details');
    const [tabs, setTabs] = useState<string[]>([]);

    useEffect(() => {
        if (
            product.beers?.aroma ||
            product.beers?.color ||
            product.beers?.family ||
            product.beers?.fermentation ||
            product.beers?.recommended_glass ||
            product.beers?.is_gluten ||
            product.beers?.format ||
            product.beers?.volume ||
            product.beers?.intensity ||
            product.beers?.srm ||
            product.beers?.og ||
            product.beers?.fg ||
            product.beers?.ibu ||
            product.beers?.ingredients
        ) {
            // No lo añade si ya existe
            if (!tabs.includes('details'))
                setTabs((prev) => [...prev, 'details']);
        }

        if (product?.beers?.pairing || product?.beers?.brewers_note) {
            setTabs((prev) => [...prev, 'notes']);
        }

        if (product.awards && product.awards.length > 0) {
            setTabs((prev) => [...prev, 'awards']);
        }

        if (product.brewery_id) {
            setTabs((prev) => [...prev, 'brewery']);
        }

        return () => {};
    }, []);

    return (
        <div className="w-full ">
            <div className="flex justify-start overflow-auto bg-gradient-to-r from-gray-100 to-gray-300 rounded-t-lg font-semibold border-beer-blonde border-t-2 border-r-2 border-l-2">
                {Array.from(new Set(tabs)).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        className={`px-4 py-2 focus:outline-none  hover:bg-gray-50 hover:text-beer-draft transition-colors
                            ${
                                selectedTab === tab
                                    ? 'bg-beer-softBlondeBubble text-beer-draft italic'
                                    : 'bg-muted text-gray-700'
                            }
                        `}
                    >
                        {t(tab).charAt(0).toUpperCase() + t(tab).slice(1)}
                    </button>
                ))}
            </div>

            <div className="bg-gradient-to-br from-white to-gray-100 backdrop-blur-sm bg-opacity-80 bg-white p-2 sm:p-6 rounded-b-lg shadow-md space-y-4 border-beer-blonde border-b-2 border-r-2 border-l-2">
                {selectedTab === 'details' && (
                    <ProductTechnicalInformation product={product} />
                )}

                {selectedTab === 'notes' && <ProductNotes product={product} />}

                {selectedTab === 'awards' && (
                    <>
                        {product.awards && product.awards.length > 0 && (
                            <div className="px-4">
                                <ProductAwardsInformation
                                    awards={product.awards}
                                />
                            </div>
                        )}
                    </>
                )}

                {product.breweries && selectedTab === 'brewery' && (
                    <BreweryPropertiesTab brewery={product.breweries} />
                )}

                {/* {selectedTab === 'faq' && (
                    <>
                        <h3 className="text-2xl font-bold mb-4">
                            Preguntas Frecuentes
                        </h3>
                        <div className="w-full">
                            {product.faqs.map((faq, index) => (
                                <details key={index} className="mb-4">
                                    <summary className="cursor-pointer text-lg font-semibold">
                                        {faq.question}
                                    </summary>
                                    <p className="mt-2">{faq.answer}</p>
                                </details>
                            ))}
                        </div>
                    </>
                )} */}
            </div>
        </div>
    );
};

export default ProductPropertiesTabs;
