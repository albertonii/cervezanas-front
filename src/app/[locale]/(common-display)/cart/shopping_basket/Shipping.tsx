import { useTranslations } from 'next-intl';
import { useAuth } from '../../../(auth)/Context/useAuth';
import { IAddress } from '../../../../../lib/types/types';
import AddressRadioInput from './AddressRadioInput';
import React, { ComponentProps, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { NewShippingAddress } from './NewShippingAddress';
import { UseFormReturn, SubmitHandler } from 'react-hook-form';
import { useMessage } from '../../../components/message/useMessage';
import { DeleteAddress } from '../../../components/modals/DeleteAddress';
import { FormShippingData, ValidationSchemaShipping } from './ShoppingBasket';
import { DisplayInputError } from '../../../components/common/DisplayInputError';

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
  const { supabase } = useAuth();
  const queryClient = useQueryClient();

  // Triggers when the user clicks on the button "Delete" in the modal for Campaign deletion
  const handleRemoveShippingAddress = async () => {
    const shippingAddressId = selectedShippingAddress;

    const { error: shippingAddressError } = await supabase
      .from('shipping_info')
      .delete()
      .eq('id', shippingAddressId);

    if (shippingAddressError) throw shippingAddressError;

    handleMessage({
      type: 'success',
      message: 'shipping_address_removed_successfully',
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
    <>
      <h3 className="text-xl font-semibold leading-5 text-gray-800 dark:text-white">
        {t('shipping_info')}{' '}
      </h3>

      <span className="flex w-full flex-col items-start justify-start space-y-4">
        <label className="text-sm font-medium text-gray-500">
          {t('shipping')}
        </label>
      </span>

      {/* Radio button for select shipping address */}
      <ul className="grid w-full gap-6 md:grid-cols-1">
        {shippingAddresses.map((address) => {
          return (
            <article key={address.id}>
              <li onClick={() => handleOnClickShipping(address.id)}>
                <AddressRadioInput
                  register={register}
                  address={address}
                  addressNameId={'shipping'}
                  setShowDeleteModal={setShowDeleteModal}
                />
              </li>
            </article>
          );
        })}

        {/* Error input displaying */}
        {errors.shipping_info_id && (
          <DisplayInputError message={errors.shipping_info_id.message} />
        )}
      </ul>

      {/* Add Shipping Information */}
      {shippingAddresses.length < 5 && <NewShippingAddress />}

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
