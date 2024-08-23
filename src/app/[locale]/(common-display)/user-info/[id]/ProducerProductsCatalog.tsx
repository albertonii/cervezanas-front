import MinimalisticProductCard from './MinimalisticProductCard';
import useFetchProductsByOwner from '@/hooks/useFetchProductsByOwner';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IProducerUser, IProduct } from '@/lib/types/types';

interface Props {
    producer: IProducerUser;
}

const ProducerProductsCatalog = ({ producer }: Props) => {
    const t = useTranslations();

    const {
        data: productsData,
        isError,
        isLoading: isLoadingProduct,
    } = useFetchProductsByOwner(producer.user_id, true);

    const [products, setProducts] = useState<IProduct[]>([]);

    useEffect(() => {
        if (productsData) {
            setProducts(productsData);
        }

        return () => {};
    }, [productsData]);

    if (isError) return <div>Error...</div>;

    if (isLoadingProduct) return <div>Loading...</div>;

    return (
        <div className="py-4">
            <h3 className="text-lg font-semibold text-gray-900">
                {t('public_user_information.producer_catalog')}
            </h3>

            <div className="flex gap-4 overflow-x-auto pb-4">
                {products.map((product) => (
                    <div className=" ">
                        <MinimalisticProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProducerProductsCatalog;
