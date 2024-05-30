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
                    message: 'billing_address_removed_successfully',
                });

                queryClient.invalidateQueries('billingAddresses');
            })
            .catch(() => {
                handleMessage({
                    type: 'error',
                    message: 'error_removing_billing_address',
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
        <>
            <h3 className="text-xl font-semibold leading-5 text-gray-800 dark:text-white">
                {t('billing_info')}{' '}
            </h3>

            <span className="flex w-full flex-col items-start justify-start space-y-4">
                <label
                    htmlFor="billing"
                    className="text-sm font-medium text-gray-500"
                >
                    {t('billing')}
                </label>
            </span>

            {/* Radio button for select billing address */}
            <ul className="grid w-full gap-6 md:grid-cols-1">
                {billingAddresses.map((address) => {
                    return (
                        <div key={address.id}>
                            <li
                                onClick={() => handleOnClickBilling(address.id)}
                            >
                                <AddressRadioInput
                                    register={register}
                                    address={address}
                                    addressNameId={'billing'}
                                    setShowDeleteModal={setShowDeleteModal}
                                />
                            </li>
                        </div>
                    );
                })}

                {/* Error input displaying */}
                {errors.billing_info_id && (
                    <DisplayInputError
                        message={errors.billing_info_id.message}
                    />
                )}
            </ul>

            {/* Add Billing Information */}
            {billingAddresses.length < 5 && <NewBillingAddress />}

            {showDeleteModal && (
                <DeleteAddress
                    handleResponseModal={onSubmit}
                    showModal={showDeleteModal}
                    setShowModal={setShowDeleteModal}
                />
            )}
        </>
    );
}
