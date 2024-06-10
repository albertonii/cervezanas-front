import AddressForm from '../../../components/AddressForm';
import Spinner from '../../../components/common/Spinner';
import ModalWithForm from '../../../components/modals/ModalWithForm';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { insertShippingAddress } from '../actions';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuth } from '../../../(auth)/Context/useAuth';
import {
    IAddressForm,
    ModalShippingAddressFormData,
} from '../../../../../lib/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQueryClient } from 'react-query';
import { z, ZodType } from 'zod';
import { useMessage } from '../../../components/message/useMessage';

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
    const { user } = useAuth();
    const { handleMessage } = useMessage();

    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const queryClient = useQueryClient();

    const form = useForm<IAddressForm>({
        mode: 'onSubmit',
        resolver: zodResolver(schema),
    });

    const { reset, handleSubmit } = form;

    const handleAddShippingAddress = async (form: ValidationSchema) => {
        setIsLoading(true);

        const object = {
            user_id: user?.id,
            name: form.name,
            lastname: form.lastname,
            document_id: form.document_id,
            phone: form.phone,
            address: form.address,
            address_extra: form.address_extra,
            address_observations: form.address_observations,
            country: form.country,
            zipcode: form.zipcode,
            city: form.city,
            state: form.state,
            is_default: form.is_default,
        };

        await insertShippingAddress(object)
            .then(() => {
                queryClient.invalidateQueries('shippingAddresses');
                setShowModal(false);
                setIsLoading(false);
                setIsSubmitting(false);
                reset();

                handleMessage({
                    type: 'success',
                    message: t('success.shipping_address_created'),
                });
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
                handleMessage({
                    type: 'error',
                    message: t('errors.creating_shipping_address'),
                });
            });
    };

    const insertShippingMutation = useMutation({
        mutationKey: ['insertShipping'],
        mutationFn: handleAddShippingAddress,
        onMutate: () => {
            setIsSubmitting(true);
        },
        onError: (error: any) => {
            console.error(error);
            setIsSubmitting(false);
        },
    });

    const onSubmit: SubmitHandler<ValidationSchema> = (
        formValues: ModalShippingAddressFormData,
    ) => {
        return new Promise<void>((resolve, reject) => {
            insertShippingMutation.mutate(formValues, {
                onSuccess: () => resolve(),
                onError: (error: any) => reject(error),
            });
        });
    };

    return (
        <ModalWithForm
            showBtn={true}
            showModal={showModal}
            setShowModal={setShowModal}
            title={t('add_shipping_address')}
            btnTitle={t('save')}
            triggerBtnTitle={t('add_shipping_address')}
            description={''}
            icon={faAdd}
            handler={handleSubmit(onSubmit)}
            btnSize={'large'}
            classIcon={'w-6 h-6'}
            classContainer={`!w-1/2 ${isSubmitting && 'opacity-75'}`}
            form={form}
        >
            <>
                <AddressForm form={form} addressNameId={'shipping'} />
            </>
        </ModalWithForm>
    );
}
