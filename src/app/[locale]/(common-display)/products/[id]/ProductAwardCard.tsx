import DisplayImageProduct from '@/app/[locale]/components/common/DisplayImageProduct';
import React from 'react';
import { IAward } from '@/lib/types/types';
import { SupabaseProps } from '@/constants';

interface Props {
    award: IAward;
}

const ProductAwardCard = ({
    award: { name, description, year, img_url: imageUrl },
}: Props) => {
    const decodedUrl =
        SupabaseProps.BASE_PRODUCTS_URL + decodeURIComponent(imageUrl);

    return (
        <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg p-2 p-1 mb-2 col-span-1 sm:col-span-1 lg-grid-cols-1">
            <div className="flex-shrink-0">
                <DisplayImageProduct
                    imgSrc={decodedUrl}
                    alt={name}
                    width={120}
                    height={120}
                    class="w-[10vw] px-2 py-2 sm:w-[15vw] md:w-[20vw] lg:w-[8vw]"
                />
            </div>
            <div className="mt-4 md:mt-0 md:ml-6 flex flex-col justify-center">
                <h3 className="text-md font-semibold text-gray-800">{name}</h3>
                <p className="text-sm text-gray-600 mt-1">{description}</p>
                <p className="text-sm text-gray-500 mt-2 italic">{year}</p>
            </div>
        </div>
    );
};

export default ProductAwardCard;
