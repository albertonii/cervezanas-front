'use client';

import React, { ComponentProps } from 'react';
import Modal from './Modal';
import { useAuth } from '../../(auth)/Context/useAuth';
import { IMonthlyProduct } from '@/lib//types/types';

interface Props {
    products: IMonthlyProduct[];
    product: IMonthlyProduct | undefined;
    showModal: boolean;
    handleDeleteShowModal: ComponentProps<any>;
    handleSetProducts: ComponentProps<any>;
}

export function DeleteMonthlyProduct({
    products,
    product,
    showModal,
    handleDeleteShowModal,
    handleSetProducts,
}: Props) {
    const { supabase } = useAuth();

    const handleDeleteClick = async () => {
        if (!product) return;

        const { data, error: productError } = await supabase
            .from('monthly_products')
            .delete()
            .eq('product_id', product.product_id);

        if (productError) throw productError;

        handleDeleteShowModal(false);

        handleSetProducts(
            products.filter((b) => {
                return b.product_id !== product?.product_id;
            }),
        );

        return data;
    };

    return (
        <Modal
            showBtn={false}
            showModal={showModal}
            setShowModal={handleDeleteShowModal}
            title={'modal_delete_monthly_product_title'}
            btnTitle={'delete'}
            description={'modal_delete_monthly_product_description'}
            handler={handleDeleteClick}
            classContainer={''}
        >
            <></>
        </Modal>
    );
}
