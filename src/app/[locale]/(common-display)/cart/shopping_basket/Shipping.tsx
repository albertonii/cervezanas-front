import AddressRadioInput from './AddressRadioInput';
import React, { ComponentProps, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IAddress } from '@/lib//types/types';
import { removeShippingAddressById } from '../actions';
import { useMutation, useQueryClient } from 'react-query';
import { NewShippingAddress } from './NewShippingAddress';
import { UseFormReturn, SubmitHandler } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShippingFast } from '@fortawesome/free-solid-svg-icons';
import { useShoppingCart } from '@/app/context/ShoppingCartContext';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { FormShippingData, ValidationSchemaShipping } from './ShoppingBasket';
import { DeleteAddress } from '@/app/[locale]/components/modals/DeleteAddress';
import { DisplayInputError } from '@/app/[locale]/components/common/DisplayInputError';
import { useAuth } from '@/app/[locale]/(auth)/Context/useAuth';

interface Props {
    shippingAddresses: IAddress[];
    formShipping: UseFormReturn<FormShippingData, any>;
}

export default function Shipping({ formShipping, shippingAddresses }: Props) {
    const t = useTranslations();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { supabase } = useAuth();

    const {
        selectedShippingAddress,
        defaultShippingAddress,
        updateSelectedShippingAddress,
        updateDefaultShippingAddress,
        isShippingAddressSelected,
    } = useShoppingCart();

    const {
        register,
        formState: { errors },
    } = formShipping;

    const { handleMessage } = useMessage();
    const queryClient = useQueryClient();

    // Triggers when the user clicks on the button "Delete" in the modal for Campaign deletion
    const handleRemoveShippingAddress = async () => {
        if (!selectedShippingAddress) {
            handleMessage({
                type: 'error',
                message: 'errors.removing_shipping_address',
            });

            return;
        }

        await removeShippingAddressById(selectedShippingAddress.id)
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

    const handleUpdateDefaultShippingAddress = async (address: IAddress) => {
        if (address.id !== defaultShippingAddress?.id) {
            if (defaultShippingAddress?.prevDefaultAddressId) {
                // Delete previous default shipping address
                const { error: prevError } = await supabase
                    .from('shipping_info')
                    .update({ is_default: false })
                    .eq('id', defaultShippingAddress.prevDefaultAddressId);

                if (prevError) {
                    handleMessage({
                        type: 'error',
                        message:
                            'errors.updating_to_false_prev_default_shipping_address',
                    });

                    return;
                }
            }

            const { error } = await supabase
                .from('shipping_info')
                .update({ is_default: true })
                .eq('id', address.id);

            if (error) {
                handleMessage({
                    type: 'error',
                    message: 'errors.updating_default_shipping_address',
                });

                return;
            }

            updateDefaultShippingAddress(address);
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

            <span className="text-md text-gray-600 dark:text-gray-400">
                {t('shipping_logic_select_info')}
            </span>

            <ul className="space-y-4">
                {shippingAddresses.map((address) => (
                    <li
                        key={address.id}
                        className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md dark:bg-gray-700"
                    >
                        <AddressRadioInput
                            register={register}
                            address={address}
                            addressNameId={'shipping'}
                            defaultSelectedAddress={defaultShippingAddress}
                            setShowDeleteModal={setShowDeleteModal}
                            handleDefaultAddress={
                                handleUpdateDefaultShippingAddress
                            }
                            handleSelectedAddress={
                                updateSelectedShippingAddress
                            }
                            isAddressSelected={isShippingAddressSelected}
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
