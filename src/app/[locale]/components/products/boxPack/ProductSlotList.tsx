import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { IProduct } from '../../../../../lib/types/types';
import useBoxPackStore from '../../../../store/boxPackStore';
import Spinner from '../../common/Spinner';
import ProductSlotItem from './ProductSlotItem';

interface Props {
    products: IProduct[];
    form: UseFormReturn<any, any>;
}

const ProductSlotList: React.FC<Props> = ({ products, form }) => {
    if (!products) {
        return <div className="mx-4 my-1">No products found.</div>;
    }

    if (products.length === 0) {
        return (
            <div className="mx-4 my-1 ">
                <Spinner color="beer-blonde" size="small" />
            </div>
        );
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
                        index={index}
                    />
                </div>
            ))}
        </div>
    );
};

export default ProductSlotList;