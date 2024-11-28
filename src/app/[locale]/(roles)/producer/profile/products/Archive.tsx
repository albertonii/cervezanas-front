'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { IProduct } from '@/lib/types/types';
import { ProductsArchiveList } from './ProductsArchiveList';
import { DeleteProductModal } from '@/app/[locale]/components/modals/DeleteProductModal';
import { UpdateProductModal } from './UpdateProductModal';
import ProfileSectionHeader from '@/app/[locale]/components/ui/ProfileSectionHeader';

/**
 *
 * @returns Products archived are not public and can only be viewed by the seller.
 * Useful to keep track of products that have been sold or are no longer available.
 */
export function Archive() {
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
        <>
            <div className="px-4 py-6 " aria-label="Products">
                <ProfileSectionHeader
                    headerTitle="products_archive"
                    headerDescription={t(
                        'profile_configure_archive_description',
                    )}
                />

                <ProductsArchiveList
                    handleEditShowModal={handleEditShowModal}
                    handleDeleteShowModal={handleDeleteShowModal}
                    handleProductModal={handleProductModal}
                />
            </div>

            {productModal && isEditShowModal && (
                <UpdateProductModal
                    product={productModal}
                    handleEditShowModal={handleEditShowModal}
                    showModal={false}
                />
            )}

            {isDeleteShowModal && productModal && (
                <DeleteProductModal
                    product={productModal}
                    showModal={isDeleteShowModal}
                    handleDeleteShowModal={handleDeleteShowModal}
                />
            )}
        </>
    );
}
