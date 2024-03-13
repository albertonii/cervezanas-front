import AddressForm from '../../../components/AddressForm';
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useAuth } from '../../../(auth)/Context/useAuth';
import {
  IAddressForm,
  ModalShippingAddressFormData,
} from '../../../../../lib/types/types';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQueryClient } from 'react-query';
import ModalWithForm from '../../../components/modals/ModalWithForm';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema: ZodType<ModalShippingAddressFormData> = z.object({
  name: z.string().nonempty({ message: 'errors.input_required' }),
  lastname: z.string().nonempty({ message: 'errors.input_required' }),
  document_id: z.string().nonempty({ message: 'errors.input_required' }),
  phone: z.string().nonempty({ message: 'errors.input_required' }),
  address: z.string().nonempty({ message: 'errors.input_required' }),
  country: z.string().nonempty({ message: 'errors.input_required' }),
  state: z.string().nonempty({ message: 'errors.input_required' }),
  city: z.string().nonempty({ message: 'errors.input_required' }),
  zipcode: z.string().nonempty({ message: 'errors.input_required' }),
  is_default: z.boolean(),
  address_extra: z.string().optional(),
  address_observations: z.string().optional(),
});

type ValidationSchema = z.infer<typeof schema>;

export function NewShippingAddress() {
  const t = useTranslations();
  const { supabase, user } = useAuth();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const form = useForm<IAddressForm>({
    mode: 'onSubmit',
    resolver: zodResolver(schema),
  });

  const { reset, handleSubmit } = form;

  const handleAddShippingAddress = async (form: ValidationSchema) => {
    const {
      name,
      lastname,
      document_id,
      phone,
      address,
      address_extra,
      address_observations,
      country,
      state,
      city,
      zipcode,
      is_default,
    } = form;

    const { error } = await supabase.from('shipping_info').insert({
      owner_id: user?.id,
      name,
      lastname,
      document_id,
      phone,
      address,
      address_extra,
      address_observations,
      country,
      zipcode,
      city,
      state,
      is_default: is_default,
    });

    if (error) {
      console.error(error);
      throw error;
    }

    reset();
  };

  const insertShippingMutation = useMutation({
    mutationKey: ['insertShipping'],
    mutationFn: handleAddShippingAddress,
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shippingAddresses'] });
      setShowModal(false);
      setIsSubmitting(false);
    },
    onError: (error: any) => {
      console.error(error);
      setIsSubmitting(false);
    },
  });

  const onSubmit: SubmitHandler<ValidationSchema> = (
    formValues: ModalShippingAddressFormData,
  ) => {
    try {
      insertShippingMutation.mutate(formValues);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ModalWithForm
      showBtn={true}
      showModal={showModal}
      setShowModal={setShowModal}
      title={t('add_shipping_address')}
      btnTitle={t('add_shipping_address')}
      description={''}
      icon={faAdd}
      handler={handleSubmit(onSubmit)}
      btnSize={'large'}
      classIcon={'w-6 h-6'}
      classContainer={`!w-1/2 ${isSubmitting && 'opacity-50'}`}
      form={form}
    >
      <AddressForm form={form} addressNameId={'shipping'} />
    </ModalWithForm>
  );
}
