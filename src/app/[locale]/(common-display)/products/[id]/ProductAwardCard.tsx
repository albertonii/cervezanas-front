import React from 'react';
import { IAward } from '@/lib/types/types';
import { SupabaseProps } from '@/constants';
import DisplayImageProduct from '@/app/[locale]/components/ui/DisplayImageProduct';

interface Props {
    award: IAward;
}

const ProductAwardCard = ({
    award: { name, description, year, img_url: imageUrl },
}: Props) => {
    const decodedUrl =
        SupabaseProps.BASE_PRODUCTS_URL + decodeURIComponent(imageUrl);

    return (
        <div className="flex bg-white shadow-lg rounded-lg p-1">
            <div className="flex-shrink-0">
                <DisplayImageProduct
                    imgSrc={decodedUrl}
                    alt={name}
                    width={80}
                    height={80}
                    class="w-[6vw] sm:w-[10vw] md:w-[15vw] lg:w-[5vw]"
                />
            </div>

            <div className="mt-4 md:mt-0 flex flex-col justify-center">
                <h3 className="text-md font-semibold text-gray-800">{name}</h3>
                <p className="text-sm text-gray-600 mt-1">{description}</p>
                <p className="text-sm text-gray-500 mt-2 italic">{year}</p>
            </div>
        </div>
    );
};

export default ProductAwardCard;
