'use client';

import ProfileSectionHeader from '@/app/[locale]/components/ui/ProfileSectionHeader';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ProductList } from './ProductList';
import { IProduct } from '@/lib//types/types';
import { AddProductModal } from '../../../producer/profile/products/AddProductModal';
import { DeleteProductModal } from '@/app/[locale]/components/modals/DeleteProductModal';
import { UpdateProductModal } from '../../../producer/profile/products/UpdateProductModal';

export function Products() {
    const t = useTranslations();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    const [isDeleteShowModal, setIsDeleteShowModal] = useState(false);
    const [isEditShowModal, setIsEditShowModal] = useState(false);
    const [productModal, setProductModal] = useState<IProduct>();

    const handleEditShowModal = (value: boolean) => {
        setIsEditShowModal(value);
    };

    const handleDeleteShowModal = (value: boolean) => {
        setIsDeleteShowModal(value);
    };

    const handleProductModal = (product: IProduct) => {
        setProductModal(product);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <section className="px-4 py-6" aria-label="Products">
            <ProfileSectionHeader
                headerTitle="products"
                btnActions={<AddProductModal />}
            />

            <ProductList
                handleEditShowModal={handleEditShowModal}
                handleDeleteShowModal={handleDeleteShowModal}
                handleProductModal={handleProductModal}
            />

            {isEditShowModal && productModal != null && (
                <UpdateProductModal
                    product={productModal}
                    showModal={isEditShowModal}
                    handleEditShowModal={handleEditShowModal}
                />
            )}

            {isDeleteShowModal && productModal && (
                <DeleteProductModal
                    product={productModal}
                    showModal={isDeleteShowModal}
                    handleDeleteShowModal={handleDeleteShowModal}
                />
            )}
        </section>
    );
}
