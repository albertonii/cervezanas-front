'use client';

import ProfileSectionHeader from '@/app/[locale]/components/ui/ProfileSectionHeader';
import { useState } from 'react';
import { ProductList } from './ProductList';
import { useTranslations } from 'next-intl';
import { IProduct } from '@/lib//types/types';
import { AddProductModal } from './AddProductModal';
import { Type as ProductType } from '@/lib//productEnum';
import { UpdateProductModal } from './UpdateProductModal';
import { AddBoxPackModal } from './(boxPack)/AddBoxPackModal';
import { UpdateBoxPackModal } from './(boxPack)/UpdateBoxPackModal';
import { DeleteProductModal } from '@/app/[locale]/components/modals/DeleteProductModal';
import { ProductFileUploadProvider } from '@/app/context/ProductFileUploadContext';

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
        <section
            className="px-4 py-6 flex flex-col space-y-4"
            aria-label="Products"
        >
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

                {isEditShowModal && productModal && (
                    <>
                        {productModal.type === ProductType.BEER ? (
                            <UpdateProductModal
                                product={productModal}
                                showModal={isEditShowModal}
                                handleEditShowModal={handleEditShowModal}
                            />
                        ) : (
                            <UpdateBoxPackModal
                                product={productModal}
                                showModal={isEditShowModal}
                                handleEditShowModal={handleEditShowModal}
                            />
                        )}
                    </>
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
