'use client';

import AddressForm from '../../../components/AddressForm';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useAuth } from '../../../(auth)/Context/useAuth';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQueryClient } from 'react-query';
import { ModalBillingAddressFormData } from '../../../../../lib/types/types';
import ModalWithForm from '../../../components/modals/ModalWithForm';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Spinner from '../../../components/common/Spinner';

const schema: ZodType<ModalBillingAddressFormData> = z.object({
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
});

type ValidationSchema = z.infer<typeof schema>;

export function NewBillingAddress() {
    const t = useTranslations();

    const { user, supabase } = useAuth();

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

        const {
            name,
            lastname,
            document_id,
            phone,
            address,
            country,
            state,
            city,
            zipcode,
            is_default,
        } = form;

        const { error } = await supabase.from('billing_info').insert({
            owner_id: user?.id,
            name,
            lastname,
            document_id,
            phone,
            address,
            country,
            zipcode,
            city,
            state,
            is_default,
        });

        if (error) {
            console.error(error);

            setIsLoading(false);
            throw error;
        }

        setIsLoading(false);
        setShowModal(false);
        queryClient.invalidateQueries('billingAddresses');

        reset();
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
        try {
            insertBillingMutation.mutate(formValues);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <ModalWithForm
            showBtn={true}
            showModal={showModal}
            setShowModal={setShowModal}
            title={t('add_billing_address')}
            btnTitle={t('add_billing_address')}
            description={''}
            icon={faAdd}
            handler={handleSubmit(onSubmit)}
            btnSize={'large'}
            classIcon={'w-6 h-6'}
            classContainer={`!w-1/2 ${isSubmitting && 'opacity-50'}`}
            form={form}
        >
            <>
                {isLoading && (
                    <div className="h-[50vh]">
                        <Spinner size="xxLarge" color="beer-blonde" center />
                    </div>
                )}

                <AddressForm form={form} addressNameId={'billing'} />
            </>
        </ModalWithForm>
    );
}
