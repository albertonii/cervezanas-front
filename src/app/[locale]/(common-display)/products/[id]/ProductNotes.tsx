import { IProduct } from '@/lib/types/types';
import { useTranslations } from 'next-intl';
import React from 'react';

interface Props {
    product: IProduct;
}

const ProductNotes = ({ product }: Props) => {
    if (!product.beers) return null;

    const t = useTranslations();

    const { pairing, brewers_note } = product.beers;

    return (
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
    );
};

export default ProductNotes;
