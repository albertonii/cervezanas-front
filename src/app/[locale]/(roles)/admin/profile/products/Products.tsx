'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { ProductList } from './ProductList';
import { IProduct } from '@/lib//types/types';
import { DeleteProductModal } from '@/app/[locale]/components/modals/DeleteProductModal';
import { UpdateProductAdmin } from './UpdateProductAdmin';
import { AddProductModal } from './AddProductModal';
import ProfileSectionHeader from '@/app/[locale]/components/basic/ProfileSectionHeader';

export function Products() {
    const t = useTranslations();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    const [isEditShowModal, setIsEditShowModal] = useState(false);
    const [productModal, setProductModal] = useState<IProduct>();
    const [isDeleteShowModal, setIsDeleteShowModal] = useState(false);

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
                <UpdateProductAdmin
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
