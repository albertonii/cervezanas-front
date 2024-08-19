import { IAward } from '@/lib/types/types';
import React from 'react';
import ProductAwardCard from './ProductAwardCard';

interface Props {
    awards: IAward[];
}

const ProductAwardsInformation = ({ awards }: Props) => {
    return (
        <div className="grid grid-cols-1 gap-6">
            {awards.map((award, index) => (
                <ProductAwardCard key={index} award={award} />
            ))}
        </div>
    );
};

export default ProductAwardsInformation;
