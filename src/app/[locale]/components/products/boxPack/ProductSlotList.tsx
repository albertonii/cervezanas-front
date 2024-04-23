import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IProduct } from '../../../../../lib/types/types';
import Spinner from '../../common/Spinner';
import ProductSlotItem from './ProductSlotItem';

interface Props {
    products: IProduct[];
    form: UseFormReturn<any, any>;
    productItems?: string[];
}

const ProductSlotList: React.FC<Props> = ({ products, form, productItems }) => {
    if (!products || products.length === 0) {
        return <div>No products found.</div>;
    }

    if (products.length === 0) {
        return <Spinner color="beer-blonde" size="xLarge" absolute center />;
    }

    return (
        <div
            className="w-full"
            id={`accordion-collapse`}
            data-accordion="collapse"
        >
            {products.map((product, index) => (
                <div key={product.id} className="">
                    <ProductSlotItem
                        product={product}
                        form={form}
                        productItems={productItems}
                        index={index}
                    />
                </div>
            ))}
        </div>
    );
};

export default ProductSlotList;
