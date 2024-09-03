import ProductNotes from './ProductNotes';
import ProductAwardsInformation from './ProductAwardsInformation';
import ProductTechnicalInformation from './ProductTechnicalInformation';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IProduct } from '@/lib/types/types';

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

        return () => {};
    }, []);

    return (
        <div className="w-full ">
            <div className="w-full flex justify-start overflow-auto py-2 space-x-4 bg-gray-100 rounded-lg px-2 font-semibold">
                {Array.from(new Set(tabs)).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        className={`px-4 py-2 rounded-md focus:outline-none shadow-sm hover:bg-beer-foam hover:text-beer-draft transition-colors
                            ${
                                selectedTab === tab
                                    ? 'bg-beer-foam text-beer-draft'
                                    : 'bg-muted text-gray-700'
                            }
                        `}
                    >
                        {t(tab).charAt(0).toUpperCase() + t(tab).slice(1)}
                    </button>
                ))}
            </div>

            <div className="mt-2 bg-gradient-to-br from-beer-softBlonde to-beer-softFoam p-6 backdrop-blur-sm bg-opacity-80 bg-white p-6 rounded-lg shadow-md space-y-4 border-beer-blonde border-2">
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
