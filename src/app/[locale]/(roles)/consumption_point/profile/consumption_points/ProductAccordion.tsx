import AccordionItem from './AccordionItem';
import React from 'react';
import { IProduct } from '../../../../../../lib/types/types';
import Spinner from '../../../../components/common/Spinner';
import { UseFormReturn } from 'react-hook-form';

interface Props {
  products: IProduct[];
  form: UseFormReturn<any, any>;
  productItems?: string[];
}

const ProductAccordion: React.FC<Props> = ({
  products,
  form,
  productItems,
}) => {
  if (!products || products.length === 0) {
    return <div>No products found.</div>;
  }

  if (products.length === 0) {
    return <Spinner color="beer-blonde" size="xLarge" absolute center />;
  }

  return (
    <div className="w-full" id={`accordion-collapse`} data-accordion="collapse">
      {products.map((product) => (
        <div key={product.id} className="">
          <AccordionItem
            product={product}
            form={form}
            productItems={productItems}
          />
        </div>
      ))}
    </div>
  );
};

export default ProductAccordion;