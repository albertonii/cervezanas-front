'use client';

import Modal from './Modal';
import Spinner from '../ui/Spinner';
import React, { ComponentProps, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IProduct } from '@/lib/types/types';
import { useMessage } from '../message/useMessage';
import { useMutation, useQueryClient } from 'react-query';

interface Props {
    product: IProduct;
    showModal: boolean;
    handleDeleteShowModal: ComponentProps<any>;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const deleteProductUrl = `${baseUrl}/api/products`;

export function DeleteProductModal({
    product,
    showModal,
    handleDeleteShowModal,
}: Props) {
    const t = useTranslations('');
    const [isLoading, setIsLoading] = useState(false);
    const { handleMessage } = useMessage();

    const queryClient = useQueryClient();

    const handleDelete = async () => {
        if (!product) return;

        setIsLoading(true);

        const formData = new FormData();
        formData.append('product_id', product.id);

        // Delete Product Fetch
        const responseProduct = await fetch(deleteProductUrl, {
            method: 'DELETE',
            body: formData,
        });

        if (responseProduct.status !== 200) {
            handleMessage({
                type: 'error',
                message: t('errors.deleting_product'),
            });
            setIsLoading(false);
            return;
        }

        handleMessage({
            type: 'success',
            message: t('success.product_deleted'),
        });

        handleDeleteShowModal(false);
        setIsLoading(false);
        queryClient.invalidateQueries('productList');
    };

    const deleteProductMutation = useMutation({
        mutationKey: ['deleteProduct'],
        mutationFn: handleDelete,
        onError: (error) => {
            console.error(error);
        },
    });

    const onSubmitDelete = async () => {
        return new Promise<void>((resolve, reject) => {
            deleteProductMutation.mutate(undefined, {
                onSuccess: () => resolve(),
                onError: (error) => reject(error),
            });
        });
    };

    return (
        <Modal
            showBtn={false}
            showModal={showModal}
            setShowModal={handleDeleteShowModal}
            title={'modal_delete_product_title'}
            btnTitle={'delete'}
            description={'modal_delete_product_description'}
            handler={onSubmitDelete}
            classContainer={`${isLoading && ' opacity-75'}`}
        >
            <>
                {isLoading && (
                    <div className="h-[50vh]">
                        <Spinner size="xxLarge" color="beer-blonde" />
                    </div>
                )}
            </>
        </Modal>
    );
}
