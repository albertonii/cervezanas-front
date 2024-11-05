'use client';

import React, {
    forwardRef,
    Ref,
    useImperativeHandle,
    useEffect,
    useState,
} from 'react';
import { z, ZodType } from 'zod';
import { useTranslations } from 'next-intl';
import { insertIndividualBillingAddress } from '../actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from '../../../(auth)/Context/useAuth';
import { useMutation, useQueryClient } from 'react-query';
import { ModalBillingAddressFormData } from '@/lib//types/types';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import AddressForm from '@/app/[locale]/components/form/AddressForm';
import Spinner from '@/app/[locale]/components/ui/Spinner';

export type NewBillingIndividualAddressRef = {
    submit: () => void;
    trigger: () => Promise<boolean>;
};

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
    address_extra: z.string().optional(),
});

type ValidationSchema = z.infer<typeof schema>;

interface Props {
    billingAddressesLength: number;
}

export const NewBillingIndividualAddress = forwardRef(
    (
        { billingAddressesLength }: Props,
        ref: Ref<NewBillingIndividualAddressRef>,
    ) => {
        const t = useTranslations();

        const { user } = useAuth();
        const { handleMessage } = useMessage();

        const [isLoading, setIsLoading] = useState(false);

        const queryClient = useQueryClient();

        const form = useForm<ValidationSchema>({
            mode: 'onSubmit',
            resolver: zodResolver(schema),
        });

        const {
            reset,
            handleSubmit,
            formState: { errors },
            trigger,
        } = form;

        useEffect(() => {
            if (Object.keys(errors).length > 0) {
                console.info('Validation errors:', errors);
            }
        }, [errors]);

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
                is_default: billingAddressesLength === 0,
                is_company: false,
            };

            await insertIndividualBillingAddress(object)
                .then(() => {
                    queryClient.invalidateQueries([
                        'billingAddresses',
                        user?.id,
                    ]);
                    reset();

                    handleMessage({
                        type: 'success',
                        message: 'success.billing_address_created',
                    });
                })
                .catch((error) => {
                    console.error(error);
                    setIsLoading(false);
                    handleMessage({
                        type: 'error',
                        message: 'errors.creating_billing_address',
                    });
                })
                .finally(() => {
                    setIsLoading(false);
                });
        };

        const insertBillingMutation = useMutation({
            mutationKey: ['insertBillingIndividualAddress'],
            mutationFn: handleAddBillingAddress,
            onError: (error) => {
                console.error(error);
            },
        });

        const onSubmit: SubmitHandler<ValidationSchema> = (
            formValues: ModalBillingAddressFormData,
        ) => {
            return new Promise<void>((resolve, reject) => {
                insertBillingMutation.mutate(formValues, {
                    onSuccess: () => {
                        resolve();
                    },
                    onError: (error: any) => {
                        console.error('Mutation error:', error);
                        reject(error);
                    },
                });
            });
        };

        const handleSubmitWithLogging = handleSubmit(
            (data) => {
                onSubmit(data);
            },
            (errors) => {
                console.error('Validation errors:', errors);
            },
        );

        useImperativeHandle(
            ref,
            () => ({
                submit: () => {
                    handleSubmitWithLogging();
                },
                trigger: () => {
                    return trigger();
                },
            }),
            [handleSubmitWithLogging],
        );

        return (
            <>
                {isLoading ? (
                    <Spinner color="beer-blonde" size="medium" />
                ) : (
                    <AddressForm form={form} addressNameId={'billing'} />
                )}
            </>
        );
    },
);
