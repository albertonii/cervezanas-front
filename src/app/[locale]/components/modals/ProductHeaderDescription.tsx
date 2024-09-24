import React from 'react';
import { useTranslations } from 'next-intl';

const ProductHeaderDescription = () => {
    const t = useTranslations();
    return (
        <div>
            <p className="text-gray-700 my-6 text-base leading-relaxed max-w-full text-justify bg-white bg-opacity-90 p-6 rounded-lg shadow-lg border-l-4 border-yellow-500">
                {t('modal_product_description')}
            </p>

            <div className="text-gray-700 my-6 text-base leading-relaxed max-w-full text-justify bg-white bg-opacity-90 p-6 rounded-lg shadow-lg border-l-4 border-yellow-500 bg-opacity-30 transform transition-transform duration-500 hover:scale-105 mb-6">
                <h3 className="text-xl font-bold mb-4">
                    🚨 {t('modal_product_important_notice')}
                </h3>
                <p className=" max-w-full text-justify ">
                    {t('modal_product_disclaimer')}
                </p>
            </div>

            <div className="text-gray-700 my-6 text-base leading-relaxed max-w-full text-justify bg-white bg-opacity-90 p-6 rounded-lg shadow-lg border-l-4 border-yellow-500 bg-opacity-20 transform transition-transform duration-500 hover:scale-105">
                <h3 className="text-xl font-bold mb-4">
                    📋 {t('modal_product_more_details')}
                </h3>
                <p className="max-w-full text-justify">
                    {t('modal_product_description_two')}
                </p>
            </div>
        </div>
    );
};

export default ProductHeaderDescription;
