'use client';

import AddressForm from '@/app/[locale]/components/form/AddressForm';
import Spinner from '@/app/[locale]/components/ui/Spinner';
import React, {
    forwardRef,
    useImperativeHandle,
    useEffect,
    useState,
} from 'react';
import { useTranslations } from 'next-intl';
import { SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import { useAuth } from '../../../(auth)/Context/useAuth';
import { useMutation, useQueryClient } from 'react-query';
import { insertIndividualBillingAddress } from '../actions';
import { ModalBillingAddressFormData } from '@/lib/types/types';
import { NewBillingValidationSchema } from './NewBillingModal copy';
import { useMessage } from '@/app/[locale]/components/message/useMessage';

interface Props {
    billingAddressesLength: number;
    form: UseFormReturn<any, any>;
}

export const NewBillingIndividualAddress = forwardRef(
    ({ billingAddressesLength, form }: Props) => {
        const t = useTranslations();

        const { user } = useAuth();
        const { handleMessage } = useMessage();

        const {
            formState: { errors },
            reset,
        } = form;

        const [isLoading, setIsLoading] = useState(false);

        const queryClient = useQueryClient();

        useEffect(() => {
            if (Object.keys(errors).length > 0) {
                console.info('Validation errors:', errors);
            }
        }, [errors]);

        const handleAddBillingAddress = async (
            form: NewBillingValidationSchema,
        ) => {
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

        // const onSubmit: SubmitHandler<NewBillingValidationSchema> = (
        //     formValues: ModalBillingAddressFormData,
        // ) => {
        //     return new Promise<void>((resolve, reject) => {
        //         insertBillingMutation.mutate(formValues, {
        //             onSuccess: () => {
        //                 resolve();
        //             },
        //             onError: (error: any) => {
        //                 console.error('Mutation error:', error);
        //                 reject(error);
        //             },
        //         });
        //     });
        // };

        // const handleSubmitWithLogging = handleSubmit(
        //     (data) => {
        //         onSubmit(data);
        //     },
        //     (errors) => {
        //         console.error('Validation errors:', errors);
        //     },
        // );

        // useImperativeHandle(
        //     ref,
        //     () => ({
        //         submit: () => {
        //             handleSubmitWithLogging();
        //         },
        //         trigger: () => {
        //             return trigger();
        //         },
        //     }),
        //     [handleSubmitWithLogging],
        // );

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
