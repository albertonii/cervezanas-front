import { useTranslations } from 'next-intl';
import AddressRadioInput from './AddressRadioInput';
import React, { ComponentProps, useState } from 'react';
import { NewBillingAddress } from './NewBillingAddress';
import { useMutation, useQueryClient } from 'react-query';
import { IBillingAddress } from '../../../../../lib/types/types';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { useMessage } from '../../../components/message/useMessage';
import { DeleteAddress } from '../../../components/modals/DeleteAddress';
import { DisplayInputError } from '../../../components/common/DisplayInputError';
import { FormBillingData, ValidationSchemaShipping } from './ShoppingBasket';
import { removeBillingAddressById } from '../actions';

interface Props {
    selectedBillingAddress: string;
    billingAddresses: IBillingAddress[];
    handleOnClickBilling: ComponentProps<any>;
    formBilling: UseFormReturn<FormBillingData, any>;
}

export default function Billing({
    formBilling,
    billingAddresses,
    selectedBillingAddress,
    handleOnClickBilling,
}: Props) {
    const t = useTranslations();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const {
        register,
        formState: { errors },
    } = formBilling;

    const { handleMessage } = useMessage();
    const queryClient = useQueryClient();

    // Triggers when the user clicks on the button "Delete" in the modal for Campaign deletion
    const handleRemoveBillingAddress = async () => {
        const billingAddressId = selectedBillingAddress;

        removeBillingAddressById(billingAddressId)
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

    const onSubmit: SubmitHandler<ValidationSchemaShipping> = async (
        data: any,
    ) => {
        try {
            deleteBillingAddress.mutate(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <section className="w-full space-y-6 p-6 rounded-lg shadow-md bg-gray-50 dark:bg-gray-800">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                {t('billing_info')}
            </h3>

            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                {t('billing')}
            </label>

            <ul className="space-y-4">
                {billingAddresses.map((address) => (
                    <li
                        key={address.id}
                        className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md dark:bg-gray-700"
                        onClick={() => handleOnClickBilling(address.id)}
                    >
                        <AddressRadioInput
                            register={register}
                            address={address}
                            addressNameId={'billing'}
                            setShowDeleteModal={setShowDeleteModal}
                        />
                    </li>
                ))}

                {errors.billing_info_id && (
                    <DisplayInputError
                        message={errors.billing_info_id.message}
                    />
                )}
            </ul>

            {billingAddresses.length < 5 && <NewBillingAddress />}

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
