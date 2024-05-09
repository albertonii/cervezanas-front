'use client';

import React, { ComponentProps } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { IAward, IProduct, IProductPack } from '../../../../lib/types/types';
import { useAuth } from '../../(auth)/Context/useAuth';
import Modal from './Modal';
import { useMessage } from '../message/useMessage';

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
    const { supabase } = useAuth();
    const { handleMessage } = useMessage();

    const queryClient = useQueryClient();

    const handleAwardsDeleteFolder = async (awards?: IAward[]) => {
        if (awards) {
            awards.map(async (award) => {
                const { error: awardError } = await supabase.storage
                    .from('products')
                    .remove([`${decodeURIComponent(award.img_url)}`]);

                if (awardError) throw awardError;
            });
        }
    };

    const handleMultimediaDeleteFiles = async (product?: IProduct) => {
        if (product && product?.product_multimedia) {
            const formData = new FormData();

            formData.append('product_id', product.id);

            formData.append(
                'p_principal',
                product.product_multimedia?.p_principal || '',
            );
            formData.append('p_back', product.product_multimedia?.p_back || '');
            formData.append(
                'p_extra_1',
                product.product_multimedia?.p_extra_1 || '',
            );
            formData.append(
                'p_extra_2',
                product.product_multimedia?.p_extra_2 || '',
            );

            const deleteMultimediaUrl = `${baseUrl}/api/products/multimedia`;

            // Delete Multimedia Fetch
            const responseMultimedia = await fetch(deleteMultimediaUrl, {
                method: 'DELETE',
                body: formData,
            });

            if (responseMultimedia.status !== 200) {
                handleMessage({
                    type: 'error',
                    message: 'Error deleting product multimedia',
                });
                return;
            }

            if (responseMultimedia.status === 200) {
                handleMessage({
                    type: 'success',
                    message: 'Success deleting product multimedia',
                });
            }
        }
    };

    const handleDelete = async () => {
        if (!product) return;

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
                message: 'Error deleting product',
            });
            return;
        }

        if (responseProduct.status === 200) {
            handleMessage({
                type: 'success',
                message: 'Success deleting product',
            });
        }

        // Delete multimedia in storage
        handleProductPacksDeleteFiles(product);
        handleAwardsDeleteFiles(product);
        handleMultimediaDeleteFiles(product);

        handleDeleteShowModal(false);
        queryClient.invalidateQueries('productList');
    };

    const handleProductPacksDeleteFiles = (product?: IProduct) => {
        if (product && product?.product_packs) {
            product?.product_packs.map(
                async (pack: IProductPack, index: number) => {
                    const formData = new FormData();

                    formData.append(
                        'packs_size',
                        product?.product_packs?.length.toString() || '0',
                    );

                    formData.append(`pack[${index}].img_url`, pack.img_url);

                    const deletePacksUrl = `${baseUrl}/api/products/packs`;

                    // Delete Packs Fetch
                    const responsePacks = await fetch(deletePacksUrl, {
                        method: 'DELETE',
                        body: formData,
                    });

                    if (responsePacks.status !== 200) {
                        handleMessage({
                            type: 'error',
                            message: 'Error deleting product packs',
                        });
                        return;
                    }

                    if (responsePacks.status === 200) {
                        handleMessage({
                            type: 'success',
                            message: 'Success deleting product packs',
                        });
                    }
                },
            );
        }
    };

    const handleAwardsDeleteFiles = async (product?: IProduct) => {
        if (product && product?.awards) {
            const formData = new FormData();

            formData.append(
                'awards_size',
                product?.awards?.length.toString() || '0',
            );

            product?.awards.map(async (award: IAward, index: number) => {
                formData.append(`award[${index}].img_url`, award.img_url);
            });

            const deleteAwardsUrl = `${baseUrl}/api/products/awards`;

            // Delete Awards Fetch
            const responseAwards = await fetch(deleteAwardsUrl, {
                method: 'DELETE',
                body: formData,
            });

            if (responseAwards.status !== 200) {
                handleMessage({
                    type: 'error',
                    message: 'Error deleting product awards',
                });
                return;
            }

            if (responseAwards.status === 200) {
                handleMessage({
                    type: 'success',
                    message: 'Success deleting product awards',
                });
            }
        }
    };

    const deleteProductMutation = useMutation({
        mutationKey: ['deleteProduct'],
        mutationFn: handleDelete,
        onError: (error) => {
            console.error(error);
        },
    });

    const onSubmitDelete = () => {
        try {
            deleteProductMutation.mutate();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Modal
            showBtn={false}
            showModal={showModal}
            setShowModal={handleDeleteShowModal}
            title={'modal_delete_product_title'}
            btnTitle={'delete'}
            description={'modal_delete_product_description'}
            handler={() => {
                onSubmitDelete();
            }}
            classIcon={''}
            classContainer={''}
        >
            <></>
        </Modal>
    );
}
