import UpdateProductSlotItem from './UpdateProductSlotItem';
import React from 'react';
import { IProduct } from '@/lib/types/types';
import { UseFormReturn } from 'react-hook-form';
import Spinner from '../../ui/Spinner';

interface Props {
    products: IProduct[];
    form: UseFormReturn<any, any>;
}

const UpdateProductSlotList: React.FC<Props> = ({ products, form }) => {
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
            className="max-h-[40vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 overflow-y-auto"
            id={`accordion-collapse`}
            data-accordion="collapse"
        >
            {products.map((product, index) => {
                return (
                    <div
                        key={product.id}
                        className="mx-4 my-1 rounded-lg border border-gray-200"
                    >
                        <UpdateProductSlotItem
                            product={product}
                            form={form}
                            index={index}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default UpdateProductSlotList;
