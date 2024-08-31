import NewBillingModal from './NewBillingModal';
import AddressRadioInput from './AddressRadioInput';
import useFetchBillingByOwnerId from '@/hooks/useFetchBillingByOwnerId';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IAddress } from '@/lib//types/types';
import { removeBillingAddressById } from '../actions';
import { useMutation, useQueryClient } from 'react-query';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/app/[locale]/(auth)/Context/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useShoppingCart } from '@/app/context/ShoppingCartContext';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { FormBillingData, ValidationSchemaBilling } from './ShoppingBasket';
import { DeleteAddress } from '@/app/[locale]/components/modals/DeleteAddress';
import { DisplayInputError } from '@/app/[locale]/components/common/DisplayInputError';

interface Props {
    formBilling: UseFormReturn<FormBillingData, any>;
}

export default function Billing({ formBilling }: Props) {
    const t = useTranslations();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { handleMessage } = useMessage();
    const queryClient = useQueryClient();

    const { supabase, user } = useAuth();

    const { data: billingAddresses, error: billingAddressesError } =
        useFetchBillingByOwnerId(user?.id);

    const {
        selectedBillingAddress,
        defaultBillingAddress,
        updateSelectedBillingAddress,
        updateDefaultBillingAddress,
        isBillingAddressSelected,
    } = useShoppingCart();

    const {
        register,
        formState: { errors },
        setValue,
    } = formBilling;

    if (billingAddressesError) {
        throw billingAddressesError;
    }

    useEffect(() => {
        billingAddresses?.map((address) => {
            if (address.is_default) {
                updateDefaultBillingAddress(address);
                updateSelectedBillingAddress(address);
                setValue('billing_info_id', address.id);
            }
        });

        return () => {};
    }, [billingAddresses]);

    // Triggers when the user clicks on the button "Delete" in the modal for Campaign deletion
    const handleRemoveBillingAddress = async () => {
        if (!selectedBillingAddress) {
            handleMessage({
                type: 'error',
                message: 'errors.removing_billing_address',
            });

            return;
        }

        removeBillingAddressById(selectedBillingAddress.id)
            .then(() => {
                handleMessage({
                    type: 'success',
                    message: 'success.billing_address_removed',
                });

                queryClient.invalidateQueries('billingAddresses');
            })
            .catch(() => {
                handleMessage({
                    type: 'error',
                    message: 'errors.removing_billing_address',
                });
            });
    };

    const deleteBillingAddress = useMutation({
        mutationKey: ['deleteBillingAddress'],
        mutationFn: handleRemoveBillingAddress,
        onError: (error: any) => {
            console.error(error);
        },
    });

    const onSubmit: SubmitHandler<ValidationSchemaBilling> = async (
        data: any,
    ) => {
        try {
            deleteBillingAddress.mutate(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateDefaultBillingAddress = async (address: IAddress) => {
        if (address.id !== defaultBillingAddress?.id) {
            if (defaultBillingAddress?.prevDefaultAddressId) {
                // Delete previous default billing address
                const { error: prevError } = await supabase
                    .from('billing_info')
                    .update({ is_default: false })
                    .eq('id', defaultBillingAddress.prevDefaultAddressId);

                if (prevError) {
                    handleMessage({
                        type: 'error',
                        message:
                            'errors.updating_to_false_prev_default_billing_address',
                    });

                    return;
                }
            }

            const { error } = await supabase
                .from('billing_info')
                .update({ is_default: true })
                .eq('id', address.id);

            if (error) {
                handleMessage({
                    type: 'error',
                    message: 'errors.updating_default_billing_address',
                });

                return;
            }

            updateDefaultBillingAddress(address);
        }
    };

    return (
        <section className="relative w-full space-y-6 p-6 rounded-lg shadow-md bg-gray-50 dark:bg-gray-800">
            <FontAwesomeIcon
                icon={faMoneyBill}
                title={'Billing Info Icon'}
                className="text-beer-blonde absolute -top-4 -left-4 bg-white p-2 rounded-full shadow-lg"
                size="2xl"
            />

            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                {t('billing_info')}
            </h3>

            <span className="text-md text-gray-600 dark:text-gray-400">
                {t('billing_select_info')}
            </span>

            <ul className="space-y-4">
                {billingAddresses &&
                    billingAddresses.map((address) => (
                        <li
                            key={address.id}
                            className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md dark:bg-gray-700"
                        >
                            <AddressRadioInput
                                register={register}
                                address={address}
                                addressNameId={'billing'}
                                defaultSelectedAddress={defaultBillingAddress}
                                setShowDeleteModal={setShowDeleteModal}
                                handleDefaultAddress={
                                    handleUpdateDefaultBillingAddress
                                }
                                handleSelectedAddress={
                                    updateSelectedBillingAddress
                                }
                                isAddressSelected={isBillingAddressSelected}
                            />
                        </li>
                    ))}

                {errors.billing_info_id && (
                    <DisplayInputError
                        message={errors.billing_info_id.message}
                    />
                )}
            </ul>

            {billingAddresses && billingAddresses.length < 5 && (
                <NewBillingModal />
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
