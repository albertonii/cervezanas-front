'use client';

import Modal from './Modal';
import Spinner from '../common/Spinner';
import useBreweryStore from '@/app/store/breweryStore';
import React, { useState } from 'react';
import { useMessage } from '../message/useMessage';
import { useMutation, useQueryClient } from 'react-query';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const deleteBreweryUrl = `${baseUrl}/api/breweries`;

export function DeleteBreweryModal() {
    const [isLoading, setIsLoading] = useState(false);
    const { handleMessage } = useMessage();
    const { isDeleteShowModal, handleDeleteShowModal, brewery } =
        useBreweryStore();

    const queryClient = useQueryClient();

    const handleDelete = async () => {
        if (!brewery) return;

        setIsLoading(true);

        const formData = new FormData();

        formData.append('brewery_id', brewery.id);

        // Delete Brewery Fetch
        const responseBrewery = await fetch(deleteBreweryUrl, {
            method: 'DELETE',
            body: formData,
        });

        if (responseBrewery.status !== 200) {
            handleMessage({
                type: 'error',
                message: 'Error deleting brewery',
            });

            setIsLoading(false);

            return;
        }

        if (responseBrewery.status === 200) {
            handleMessage({
                type: 'success',
                message: 'success.deleting_brewery',
            });
        }

        handleDeleteShowModal(false);

        setIsLoading(false);
        queryClient.invalidateQueries('breweriesList');
    };

    const deleteBreweryMutation = useMutation({
        mutationKey: ['deleteBrewery'],
        mutationFn: handleDelete,
        onError: (error) => {
            console.error(error);
        },
    });

    const onSubmitDelete = async () => {
        try {
            deleteBreweryMutation.mutate();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Modal
            showBtn={false}
            showModal={isDeleteShowModal}
            setShowModal={handleDeleteShowModal}
            title={'modal_delete_brewery_title'}
            btnTitle={'delete'}
            description={'modal_delete_brewery_description'}
            handler={onSubmitDelete}
            classIcon={''}
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
