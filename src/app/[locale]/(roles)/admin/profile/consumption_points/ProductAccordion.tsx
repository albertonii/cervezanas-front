import ProductAccordionItem from './ProductAccordionItem';
import Spinner from '@/app/[locale]/components/ui/Spinner';
import React from 'react';
import { useTranslations } from 'next-intl';
import { IProduct } from '@/lib/types/types';
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
    const t = useTranslations();
    if (!products || products.length === 0) {
        return <div>{t('errors.products_not_found')}</div>;
    }

    if (products.length === 0) {
        return (
            <Spinner color="beer-blonde" size="xLarge" absolute flexCenter />
        );
    }

    return (
        <section
            className="w-full"
            id={`accordion-collapse`}
            data-accordion="collapse"
        >
            {products.map((product) => (
                <div key={product.id} className="">
                    <ProductAccordionItem
                        product={product}
                        form={form}
                        productItems={productItems}
                    />
                </div>
            ))}
        </section>
    );
};

export default ProductAccordion;
