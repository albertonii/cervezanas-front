'use client';

import AddressForm from '../../../components/AddressForm';
import ModalWithForm from '../../../components/modals/ModalWithForm';
import React, { useState } from 'react';
import { z, ZodType } from 'zod';
import { useTranslations } from 'next-intl';
import { insertBillingAddress } from '../actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from '../../../(auth)/Context/useAuth';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQueryClient } from 'react-query';
import { useMessage } from '../../../components/message/useMessage';
import { ModalBillingAddressFormData } from '../../../../../lib/types/types';

const schema: ZodType<ModalBillingAddressFormData> = z.object({
    name: z.string().nonempty({ message: 'errors.input_required' }),
    lastname: z.string().nonempty({ message: 'errors.input_required' }),
    document_id: z.string().nonempty({ message: 'errors.input_required' }),
    phone: z.string().nonempty({ message: 'errors.input_required' }),
    address: z.string().nonempty({ message: 'errors.input_required' }),
    country: z.string().nonempty({ message: 'errors.input_required' }),
    region: z.string().nonempty({ message: 'errors.input_required' }),
    sub_region: z.string().nonempty({ message: 'errors.input_required' }),
    city: z.string().nonempty({ message: 'errors.input_required' }),
    zipcode: z.string().nonempty({ message: 'errors.input_required' }),
    is_default: z.boolean(),
    address_extra: z.string().optional(),
});

type ValidationSchema = z.infer<typeof schema>;

export function NewBillingAddress() {
    const t = useTranslations();

    const { user } = useAuth();
    const { handleMessage } = useMessage();

    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const queryClient = useQueryClient();

    const form = useForm<ValidationSchema>({
        mode: 'onSubmit',
        resolver: zodResolver(schema),
    });

    const { reset, handleSubmit } = form;

    const handleAddBillingAddress = async (form: ValidationSchema) => {
        setIsLoading(true);

        const object = {
            user_id: user?.id,
            name: form.name,
            lastname: form.lastname,
            document_id: form.document_id,
            phone: form.phone,
            address: form.address,
            zipcode: form.zipcode,
            country: form.country,
            region: form.region,
            sub_region: form.sub_region,
            city: form.city,
            is_default: form.is_default,
        };

        await insertBillingAddress(object)
            .then(() => {
                queryClient.invalidateQueries('billingAddresses');
                setShowModal(false);
                setIsLoading(false);
                setIsSubmitting(false);
                reset();

                handleMessage({
                    type: 'success',
                    message: t('success.billing_address_created'),
                });
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
                handleMessage({
                    type: 'error',
                    message: t('errors.creating_billing_address'),
                });
            });
    };

    const insertBillingMutation = useMutation({
        mutationKey: ['insertBilling'],
        mutationFn: handleAddBillingAddress,
        onMutate: () => {
            setIsSubmitting(true);
        },
        onSuccess: () => {
            setIsSubmitting(false);
        },
        onError: (error) => {
            console.error(error);
            setIsSubmitting(false);
        },
    });

    const onSubmit: SubmitHandler<ValidationSchema> = (
        formValues: ModalBillingAddressFormData,
    ) => {
        return new Promise<void>((resolve, reject) => {
            insertBillingMutation.mutate(formValues, {
                onSuccess: () => resolve(),
                onError: (error) => reject(error),
            });
        });
    };

    return (
        <ModalWithForm
            showBtn={true}
            showModal={showModal}
            setShowModal={setShowModal}
            title={t('add_billing_address')}
            btnTitle={t('save')}
            triggerBtnTitle={t('add_billing_address')}
            description={''}
            icon={faAdd}
            handler={handleSubmit(onSubmit)}
            btnSize={'large'}
            classIcon={'w-6 h-6'}
            classContainer={`!w-1/2 ${isSubmitting && 'opacity-50'}`}
            form={form}
        >
            <>
                <AddressForm form={form} addressNameId={'billing'} />
            </>
        </ModalWithForm>
    );
}
