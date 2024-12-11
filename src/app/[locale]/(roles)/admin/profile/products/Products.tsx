'use client';

import ProfileSectionHeader from '@/app/[locale]/components/ui/ProfileSectionHeader';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ProductList } from './ProductList';
import { IProduct } from '@/lib/types/types';
import { ProductFileUploadProvider } from '@/app/context/ProductFileUploadContext';
import { AddProductModal } from '../../../producer/profile/products/AddProductModal';
import { DeleteProductModal } from '@/app/[locale]/components/modals/DeleteProductModal';
import { UpdateProductModal } from '../../../producer/profile/products/UpdateProductModal';
import { AddBoxPackModal } from '../../../producer/profile/products/(boxPack)/AddBoxPackModal';

interface Props {
    counter: number;
}

export function Products({ counter }: Props) {
    const t = useTranslations();

    const [isEditShowModal, setIsEditShowModal] = useState(false);
    const [isDeleteShowModal, setIsDeleteShowModal] = useState(false);
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

    return (
        <section className="px-4 py-6" aria-label="Products">
            <ProductFileUploadProvider>
                <ProfileSectionHeader
                    headerTitle="products"
                    headerDescription={t(
                        'profile_configure_products_description',
                    )}
                    btnActions={
                        <>
                            <AddProductModal />
                            <AddBoxPackModal />
                        </>
                    }
                />

                <ProductList
                    handleEditShowModal={handleEditShowModal}
                    handleDeleteShowModal={handleDeleteShowModal}
                    handleProductModal={handleProductModal}
                    counter={counter}
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
            </ProductFileUploadProvider>
        </section>
    );
}
