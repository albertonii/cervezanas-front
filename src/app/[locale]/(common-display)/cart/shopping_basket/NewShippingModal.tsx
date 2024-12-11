import Spinner from '@/app/[locale]/components/ui/Spinner';
import AddressForm from '@/app/[locale]/components/form/AddressForm';
import ModalWithForm from '@/app/[locale]/components/modals/ModalWithForm';
import React, { useState } from 'react';
import { z, ZodType } from 'zod';
import { useTranslations } from 'next-intl';
import { insertShippingAddress } from '../actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuth } from '../../../(auth)/Context/useAuth';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQueryClient } from 'react-query';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { IAddressForm, ModalShippingAddressFormData } from '@/lib//types/types';

const schema: ZodType<ModalShippingAddressFormData> = z.object({
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
    address_extra: z.string().optional(),
});

type ValidationSchema = z.infer<typeof schema>;

interface Props {
    shippingAddressesLength: number;
}

export function NewShippingModal({ shippingAddressesLength }: Props) {
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
            country: form.country,
            region: form.region,
            sub_region: form.sub_region,
            city: form.city,
            zipcode: form.zipcode,
            is_default: shippingAddressesLength === 0,
        };

        await insertShippingAddress(object)
            .then(() => {
                setShowModal(false);
                setIsLoading(false);
                setIsSubmitting(false);
                reset();
                queryClient.invalidateQueries(['shippingAddresses', user?.id]);

                handleMessage({
                    type: 'success',
                    message: 'success.shipping_address_created',
                });
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
                handleMessage({
                    type: 'error',
                    message: 'errors.creating_shipping_address',
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
            btnTitle={t('add_shipping_address')}
            triggerBtnTitle={t('add_shipping_address')}
            description={''}
            icon={faAdd}
            classContainer={`!w-full sm:!w-1/2 ${isSubmitting && 'opacity-75'}`}
            handler={handleSubmit(onSubmit)}
            form={form}
        >
            {isLoading ? (
                <Spinner color="beer-blonde" size="medium" />
            ) : (
                <AddressForm form={form} addressNameId={'shipping'} />
            )}
        </ModalWithForm>
    );
}
