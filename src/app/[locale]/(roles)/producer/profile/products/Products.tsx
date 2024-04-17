'use client';

import { useState } from 'react';
import { ProductList } from './ProductList';
import { useTranslations } from 'next-intl';
import { AddProductModal } from './AddProductModal';
import { IProduct } from '../../../../../../lib/types/types';
import { DeleteProduct } from '../../../../components/modals/DeleteProduct';
import { UpdateProductModal } from './UpdateProductModal';

export function Products() {
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
            <header className="flex flex-col space-y-4">
                <p className="flex justify-between py-4" id="header">
                    <span
                        id="title"
                        className="text-5xl uppercase font-semibold text-beer-blonde"
                    >
                        {t('products')}
                    </span>
                </p>

                <div className="w-40">
                    <AddProductModal />
                </div>
            </header>

            <ProductList
                handleEditShowModal={handleEditShowModal}
                handleDeleteShowModal={handleDeleteShowModal}
                handleProductModal={handleProductModal}
            />

            {isEditShowModal && productModal && (
                <UpdateProductModal
                    product={productModal}
                    showModal={isEditShowModal}
                    handleEditShowModal={handleEditShowModal}
                />
            )}

            {isDeleteShowModal && productModal && (
                <DeleteProduct
                    product={productModal}
                    showModal={isDeleteShowModal}
                    handleDeleteShowModal={handleDeleteShowModal}
                />
            )}
        </section>
    );
}
