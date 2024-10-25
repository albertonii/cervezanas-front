import AddressRadioInput from './AddressRadioInput';
import useFetchShippingByOwnerId from '@/hooks/useFetchShippingByOwnerId';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IAddress } from '@/lib//types/types';
import { removeShippingAddressById } from '../actions';
import { useMutation, useQueryClient } from 'react-query';
import { NewShippingAddress } from './NewShippingAddress';
import { UseFormReturn, SubmitHandler } from 'react-hook-form';
import { useAuth } from '@/app/[locale]/(auth)/Context/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShippingFast } from '@fortawesome/free-solid-svg-icons';
import { useShoppingCart } from '@/app/context/ShoppingCartContext';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { FormShippingData, ValidationSchemaShipping } from './ShoppingBasket';
import { DeleteAddress } from '@/app/[locale]/components/modals/DeleteAddress';
import { DisplayInputError } from '@/app/[locale]/components/ui/DisplayInputError';

interface Props {
    formShipping: UseFormReturn<FormShippingData, any>;
}

export default function Shipping({ formShipping }: Props) {
    const t = useTranslations();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { handleMessage } = useMessage();
    const queryClient = useQueryClient();

    const { supabase, user } = useAuth();

    const {
        data: shippingAddresses,
        error: shippingAddressesError,
        refetch,
    } = useFetchShippingByOwnerId(user?.id);

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
        setValue,
    } = formShipping;

    useEffect(() => {
        if (user?.id) {
            refetch();
        }
    }, [user?.id]);

    useEffect(() => {
        const defaultAddress = shippingAddresses?.find(
            (address) => address.is_default,
        );
        if (defaultAddress) {
            updateDefaultShippingAddress(defaultAddress);
            updateSelectedShippingAddress(defaultAddress);
            setValue('shipping_info_id', defaultAddress.id);
        }
    }, [
        shippingAddresses,
        updateDefaultShippingAddress,
        updateSelectedShippingAddress,
        setValue,
    ]);

    // Triggers when the user clicks on the button "Delete" in the modal for Campaign deletion
    const handleRemoveShippingAddress = async () => {
        if (!selectedShippingAddress) {
            handleMessage({
                type: 'error',
                message: 'errors.removing_shipping_address',
            });

            return;
        }

        try {
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
        } catch (error) {
            console.error(error);
            handleMessage({
                type: 'error',
                message: 'errors.removing_shipping_address',
            });
        }
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
        try {
            if (address.id !== defaultShippingAddress?.id) {
                // Single Update for All Records: First, set is_default to false for all addresses except the one being updated.
                const { error: neqError } = await supabase
                    .from('shipping_info')
                    .update({ is_default: false })
                    .neq('id', address.id);

                if (neqError) {
                    handleMessage({
                        type: 'error',
                        message: 'errors.updating_default_shipping_address',
                    });

                    return;
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
        } catch (error) {
            console.error(error);
            handleMessage({
                type: 'error',
                message: 'errors.updating_default_shipping_address',
            });
        }
    };

    if (shippingAddressesError) {
        handleMessage({
            type: 'error',
            message: t('errors.loading_shipping_addresses'),
        });
        return null;
    }

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
                {shippingAddresses &&
                    shippingAddresses.map((address) => (
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

            {shippingAddresses && shippingAddresses.length < 5 && (
                <NewShippingAddress
                    shippingAddressesLength={shippingAddresses.length}
                />
            )}

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
