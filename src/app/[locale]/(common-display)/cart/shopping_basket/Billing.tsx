import AddressRadioInput from './AddressRadioInput';
import React, { ComponentProps, useState } from 'react';
import { useTranslations } from 'next-intl';
import { removeBillingAddressById } from '../actions';
import { NewBillingIndividualAddress } from './NewBillingIndividualAddress';
import { useMutation, useQueryClient } from 'react-query';
import { IBillingAddress } from '@/lib//types/types';
import { faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { FormBillingData, ValidationSchemaShipping } from './ShoppingBasket';
import { DeleteAddress } from '@/app/[locale]/components/modals/DeleteAddress';
import { DisplayInputError } from '@/app/[locale]/components/common/DisplayInputError';
import NewBillingModal from './NewBillingModal';

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
                {billingAddresses.map((address) => (
                    <li
                        key={address.id}
                        className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md dark:bg-gray-700"
                    >
                        <AddressRadioInput
                            register={register}
                            address={address}
                            addressNameId={'billing'}
                            setShowDeleteModal={setShowDeleteModal}
                            handleOnClick={handleOnClickBilling}
                        />
                    </li>
                ))}

                {errors.billing_info_id && (
                    <DisplayInputError
                        message={errors.billing_info_id.message}
                    />
                )}
            </ul>

            {billingAddresses.length < 5 && <NewBillingModal />}

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
