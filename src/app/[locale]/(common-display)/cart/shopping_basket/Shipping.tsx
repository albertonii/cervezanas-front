import AddressRadioInput from './AddressRadioInput';
import React, { ComponentProps, useState } from 'react';
import { useTranslations } from 'next-intl';
import { removeShippingAddressById } from '../actions';
import { IAddress } from '../../../../../lib/types/types';
import { useMutation, useQueryClient } from 'react-query';
import { NewShippingAddress } from './NewShippingAddress';
import { UseFormReturn, SubmitHandler } from 'react-hook-form';
import { useMessage } from '../../../components/message/useMessage';
import { DeleteAddress } from '../../../components/modals/DeleteAddress';
import { FormShippingData, ValidationSchemaShipping } from './ShoppingBasket';
import { DisplayInputError } from '../../../components/common/DisplayInputError';
import { faShippingFast } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
    shippingAddresses: IAddress[];
    selectedShippingAddress: string;
    handleOnClickShipping: ComponentProps<any>;
    formShipping: UseFormReturn<FormShippingData, any>;
}

export default function Shipping({
    formShipping,
    shippingAddresses,
    selectedShippingAddress,
    handleOnClickShipping,
}: Props) {
    const t = useTranslations();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const {
        register,
        formState: { errors },
    } = formShipping;

    const { handleMessage } = useMessage();
    const queryClient = useQueryClient();

    // Triggers when the user clicks on the button "Delete" in the modal for Campaign deletion
    const handleRemoveShippingAddress = async () => {
        const shippingAddressId = selectedShippingAddress;

        await removeShippingAddressById(shippingAddressId)
            .then(() => {
                handleMessage({
                    type: 'success',
                    message: 'success.shipping_address_removed',
                });

                queryClient.invalidateQueries('shippingAddresses');
            })
            .catch(() => {
                handleMessage({
                    type: 'error',
                    message: 'errors.removing_shipping_address',
                });
            });
    };

    const deleteShippingAddress = useMutation({
        mutationKey: ['deleteShippingAddress'],
        mutationFn: handleRemoveShippingAddress,
        onSuccess: () => {
            queryClient.invalidateQueries('shippingAddresses');
        },
        onError: (error: any) => {
            console.error(error);
        },
    });

    const onSubmit: SubmitHandler<ValidationSchemaShipping> = async (
        data: any,
    ) => {
        try {
            deleteShippingAddress.mutate(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <section className="relative w-full space-y-6 p-6 rounded-lg shadow-md bg-gray-50 dark:bg-gray-800">
            <FontAwesomeIcon
                icon={faShippingFast}
                title={'Shipping Info Icon'}
                className="text-beer-blonde absolute -top-4 -left-4 bg-white p-2 rounded-full shadow-lg"
                size="2xl"
            />

            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                {t('shipping_info')}
            </h3>

            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                {t('shipping')}
            </label>

            <ul className="space-y-4">
                {shippingAddresses.map((address) => (
                    <li
                        key={address.id}
                        className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md dark:bg-gray-700"
                        onClick={() => handleOnClickShipping(address.id)}
                    >
                        <AddressRadioInput
                            register={register}
                            address={address}
                            addressNameId={'shipping'}
                            setShowDeleteModal={setShowDeleteModal}
                        />
                    </li>
                ))}

                {errors.shipping_info_id && (
                    <DisplayInputError
                        message={errors.shipping_info_id.message}
                    />
                )}
            </ul>

            {shippingAddresses.length < 5 && <NewShippingAddress />}

            {showDeleteModal && (
                <DeleteAddress
                    handleResponseModal={onSubmit}
                    showModal={showDeleteModal}
                    setShowModal={setShowDeleteModal}
                />
            )}
        </section>
    );
}
